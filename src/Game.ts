import { Dragon } from "./Dragon.js"
import { Point } from "./Maze.js"
import { Player } from "./Player.js"

export class Game {
  matrix: number[][]
  player: Player
  dragon: Dragon
  start: Point
  end: Point
  moves: number

  constructor(matrix: number[][], player: Player, dragon: Dragon, start: Point, end: Point, moves: number) {
    this.matrix = matrix
    this.player = player
    this.dragon = dragon
    this.start = start
    this.end = end
    this.moves = moves
  }

}
