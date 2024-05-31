import express from "express"
import path from "path"
import { Game } from "./Game.js"

export const Present = (game: Game) => {
  const app = express()
  const __dirname = path.resolve(path.dirname(""))
  app.use(express.static(__dirname + "/src/html"))
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/html/index.html"))
  })
  app.get("/game", (req, res) => {
    const { player, dragon } = game
    res.send(
      {
        matrix: game.matrix,
        heroStart: { x: player.start.x, y: player.start.y },
        heroPath: game.playerPath,
        dragonStart: { x: dragon.start.x, y: dragon.start.y },
        dragonPath: game.dragonPath,
        start: { x: game.start.x, y: game.start.y },
        end: { x: game.end.x, y: game.end.y },
        moves: game.moves
      }
    )
  })
  app.listen(3000, () => console.log("Presentation running on port 3000."))
}