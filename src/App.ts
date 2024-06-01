import { Game } from "./Game.js"
import { FormGameData } from "./Maze.js"
import { inputs } from "./Inputs.js"
import { Present } from "./Presentation.js"

export const Solve = (input: string[][]) => {
  const { matrix, player, dragon, start, end } = FormGameData(input)
  const game = new Game(matrix, player, dragon, start, end, 0)
  let i = 0, endReached = false
  while(!endReached) {
    endReached = player.endReached(player.getCoords(), end)
    if(i % 2 === 0) player.makeTurn(game)
    else
      dragon.makeTurn(game)
    i++
  }

  console.log(`Hero reached the end! Total moves: ${game.moves}`)
  return game
}

export const SolveAll = () => {
  const games = inputs.map((input) => Solve(input))
  Present(games)
}

SolveAll()
