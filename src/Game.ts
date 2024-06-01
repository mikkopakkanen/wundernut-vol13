import { Dragon } from "./Dragon.js"
import { Point } from "./Maze.js"
import { Player } from "./Player.js"

type Path = {
  x: number
  y: number
}

export class Game {
  matrix: number[][]
  rows: number
  cols: number
  player: Player
  playerPath: Path[]
  dragon: Dragon
  dragonPath: Path[]
  start: Point
  end: Point
  moves: number

  constructor(matrix: number[][], rows: number, cols: number, player: Player, dragon: Dragon, start: Point, end: Point, moves: number) {
    this.matrix = matrix
    this.rows = rows
    this.cols = cols
    this.player = player
    this.playerPath = []
    this.dragon = dragon
    this.dragonPath = []
    this.start = start
    this.end = end
    this.moves = moves
  }

}
