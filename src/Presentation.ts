import express from "express"
import path from "path"
import { Game } from "./Game.js"

const formRes = (game: Game) => {
  const { player, dragon } = game
  return {
    matrix: game.matrix,
    heroStart: { x: player.start.x, y: player.start.y },
    heroPath: game.playerPath,
    dragonStart: { x: dragon.start.x, y: dragon.start.y },
    dragonPath: game.dragonPath,
    start: { x: game.start.x, y: game.start.y },
    end: { x: game.end.x, y: game.end.y },
    moves: game.moves
  }
}

export const Present = (games: Game[]) => {
  const app = express()
  const __dirname = path.resolve(path.dirname(""))
  let gameOrderNum = 0
  app.use(express.static(__dirname + "/src/html"))
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/html/index.html"))
  })
  app.get("/game", (req, res) => {
    res.send(formRes(games[0]))
    gameOrderNum++
  })
  app.get("/newgame", (req, res) => {
    const game = games[gameOrderNum++]
    if(game) {
      res.send(formRes(game))
    }
    else {
      res.status(400)
      res.send(JSON.stringify("End of games"))
    }
  })
  app.listen(3000, () => console.log("Presentation running on port 3000."))
}