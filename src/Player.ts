import { Game } from "./Game.js"
import { CalculateDist, Point, QueueNode, ROW, COL } from "./Maze.js"

const CHECK_DRAGON_DIST = 3

export class Player {
  x: number
  y: number
  start: Point
  visitedCoords: boolean[][]

  constructor(row: number, col: number) {
    this.x = row
    this.y = col
    this.start = new Point(row, col)
    this.visitedCoords = this.resetVisitedArray()
  }

  // Returns Hero's current coords as Point
  getCoords() {
    return new Point(this.x, this.y)
  }

  // Checks if given Point equals to dest Point
  endReached(p: Point, dest: Point) {
    return p.x == dest.x && p.y == dest.y
  }

  // Returns shortest path and distance Points to exit
  getDistanceToEnd(game: Game) {
    return CalculateDist(
      game.matrix,
      new Point(this.x, this.y),
      new Point(game.end.x, game.end.y)
    )
  }

  // Returns boolean[][] arr with false values
  resetVisitedArray() {
    return new Array(ROW).fill(false).map(() => new Array(COL).fill(false))
  }

  // Reset visited tiles and sets Hero's current location as visited
  resetVisitedTiles(game: Game) {
    this.visitedCoords = this.resetVisitedArray()
    this.visitedCoords[game.player.x][game.player.y] = true // set current tile as visited
  }

  // Move Hero to given Point
  moveHero(game: Game, pt: Point) {
    this.x = pt.x
    this.y = pt.y
    this.visitedCoords[pt.x][pt.y] = true
    game.playerPath.push({ x: pt.x, y: pt.y })
    game.moves++
  }

  // Check if Dragon exists on neighbour tiles of given Point
  dragonNearby(game: Game, pt: Point) {
    const rowNum = [-1, 0, 0, 1]
    const colNum = [0, -1, 1, 0]
    for(let i=0; i<4; i++){
      const row = pt.x + rowNum[i]
      const col = pt.y + colNum[i]
      const point = new Point(row,col)
      const dragon = game.dragon.getCoords()
      if(point.x == dragon.x && point.y == dragon.y)
        return true
    }
    return false
  }

  // Calculates path to end & checks if Dragon exists on nearby tiles
  // Change CHECK_DRAGON -> from how far Dragon is checked
  makeTurn(game: Game) {
    if(game.moves === 0) this.visitedCoords[game.player.x][game.player.y] = true // set source tile as visited
    let { path } = this.getDistanceToEnd(game)
    if(!path || path.length === 0) throw "Player: no path"

    // keep only unvisited points which are certain dist away
    path = path.filter(p => p.dist <= CHECK_DRAGON_DIST && !this.visitedCoords[p.pt.x][p.pt.y])

    // check if dragon is nearby
    const nearbyDragonTiles = path.map(p => this.dragonNearby(game, p.pt) ? p : null).filter(p => p)

    if(nearbyDragonTiles.length > 0)
      this.reCalcRoute(game, nearbyDragonTiles)
    else
      this.moveHero(game, path[0].pt)
  }

  // Recalculates new path to end
  reCalcRoute(game: Game, nearbyDragonTiles: (QueueNode | null)[]) {
    this.resetVisitedTiles(game)
    game.matrix[game.dragon.x][game.dragon.y] = 0 // mark dragon tile as impassable so path to end is calculated differently

    const { path } = this.getDistanceToEnd(game)
    if(!path || path.length === 0) throw "Player: no recalc path"

    path.filter(p => p.dist <= 2) // filter out points more than 2 tiles away

    let safeCells = path.filter((p) => { // filter out nearby dragon tiles
      return !nearbyDragonTiles.some((p2) => {
        return p.pt.x === p2?.pt.x && p.pt.y === p2?.pt.y
      })
    })
    safeCells = safeCells.filter(p => p.dist === 1) // keep only safe points 1 tile away

    if(safeCells.length > 0)
      this.moveHero(game, safeCells[0].pt)
    else
      throw("Player: no recalc path")

    game.matrix[game.dragon.x][game.dragon.y] = 1 // mark dragon tile as passable again
  }

}
