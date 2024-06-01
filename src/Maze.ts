import { Dragon } from "./Dragon.js"
import { Player } from "./Player.js"
import { DragonTile, ExitTile, PlayerTile, ValidTiles } from "./Inputs.js"

export const ROW = 12
export const COL = 12

export class QueueNode {
  pt: Point
  dist: number
  constructor(pt: Point, dist: number){
    this.pt = pt // Tile Point
    this.dist = dist // Tile distance from the source
  }
}

export class Point {
  x: number
  y: number
  constructor(row: number, col: number) {
    this.x = row
    this.y = col
  }
}

type GameData = {
  matrix: (number)[][]
  player: Player
  dragon: Dragon
  start: Point
  end: Point
}

// Forms binary matrix of given emoji arr
// Replaces emojis: Passable: 1, Impassable: 0, Dragon: 1, Exit: 1
// Returns GameData obj containing matrix + other relevant things
export const FormGameData = (input: string[][]): GameData => {
  let player = new Player(0, 0)
  let dragon = new Dragon(0, 0)
  let end = new Point(0, 0)

  const MapTile = (tile: string, x: number, y: number) => {
    if(PlayerTile.includes(tile)) {
      player = new Player(x, y)
      return 1
    }
    if(DragonTile.includes(tile)) {
      dragon = new Dragon(x, y)
      return 1
    }
    if(ExitTile.includes(tile)) {
      end = new Point(x, y)
      return 1
    }
    return ValidTiles.includes(tile) ? 1 : 0
  }

  const matrix = input.map((row, x) =>
    row.map((tile, y) => MapTile(tile, x, y))
  )

  return {
    matrix: matrix,
    player: player,
    dragon: dragon,
    start: new Point(player.x, player.y),
    end: end
  }
}

// Check whether given cell is a valid cell or not
const IsValid = (row: number, col: number) => {
  return (row >= 0) && (row < ROW) && (col >= 0) && (col < COL)
}

type CalculateDistResult = {
  dist: number
  path: QueueNode[] | null
}

// Finds the shortest path between src cell and dest cell
// Implements Lee algorithm which is based on breadth-first search
// https://en.wikipedia.org/wiki/Lee_algorithm
// https://www.codesdope.com/blog/article/lee-algorithm/
export const CalculateDist = (mat: (number)[][], src: Point, dest: Point): CalculateDistResult => {
  const rowNum = [-1, 0, 0, 1]
  const colNum = [0, -1, 1, 0]

  // check source and destination cell of the matrix have value 1
  if(mat[src.x][src.y]!=1 || mat[dest.x][dest.y] != 1)
    throw ("src and dest cells should have value 1")

  const visited = new Array(ROW).fill(false).map(() => new Array(COL).fill(false))
  const previous = new Array(ROW).fill(null).map(() => new Array(COL).fill(null))

  visited[src.x][src.y] = true // mark the source cell as visited
  const q = [] // create a queue for BFS
  const path = [] // store path points here

  // enqueue source cell
  const s = new QueueNode(src, 0)
  q.push(s)

  // do BFS starting from source cell
  while (q) {

    const curr: QueueNode = q.shift()! // dequeue the front cell

    // Dest reached, lets quit
    const pt = curr.pt
    if(pt.x == dest.x && pt.y == dest.y) {
      let current = new QueueNode(new Point(dest.x, dest.y), curr.dist + 1)
      while (current !== null) {
        path.push(current)
        current = previous[current.pt.x][current.pt.y]
      }
      return {
        dist: curr.dist,
        path: path.reverse()
      }
    }

    // otherwise enqueue adjacent cells
    for(let i=0; i<4; i++){
      const row = pt.x + rowNum[i]
      const col = pt.y + colNum[i]

      // if adjacent cell is valid, has path and not visited yet -> enqueue it
      if (IsValid(row, col) && mat[row][col] == 1 && !visited[row][col]){
        visited[row][col] = true
        const Adjcell = new QueueNode(new Point(row,col), curr.dist + 1)
        q.push(Adjcell)
        previous[row][col] = new QueueNode(new Point(pt.x, pt.y), curr.dist)
      }
    }
  }
  // Return -1 if destination cannot be reached
  throw ("Destination cannot be reached")
}
