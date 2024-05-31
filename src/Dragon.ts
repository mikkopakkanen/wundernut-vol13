import { Game } from "./Game.js"
import { CalculateDist, Point } from "./Maze.js"

export class Dragon {
  x: number
  y: number
  start: Point

  constructor(row: number, col: number) {
    this.x = row
    this.y = col
    this.start = new Point(row, col)
  }

  getCoords() {
    return new Point(this.x, this.y)
  }

  getDistanceToHero(game: Game) {
    return CalculateDist(
      game.matrix,
      new Point(this.x, this.y),
      new Point(game.player.x, game.player.y)
    )
  }

  makeTurn(game: Game) {
    const { dist, path } = this.getDistanceToHero(game)
    if(!path || path.length === 0) throw "Dragon: no path"
    if(dist === 0) throw(`Dragon reached Hero on move: ${game.moves}`)
    const filteredPath = path.filter(point => point.dist === 1)
    const pt = filteredPath[0].pt
    this.x = pt.x
    this.y = pt.y
    game.dragonPath.push({ x: pt.x, y: pt.y })
  }

}
