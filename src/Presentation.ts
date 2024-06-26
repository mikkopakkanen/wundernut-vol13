import express from "express"
import path from "path"
import { exec } from "node:child_process"
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
    res.send(formRes(games[gameOrderNum]))
  })
  app.get("/prev", (req, res) => {
    gameOrderNum--
    const game = games[gameOrderNum]
    if(game) {
      res.send(formRes(game))
    }
    else {
      gameOrderNum++
      res.send(JSON.stringify("First game reached"))
    }
  })
  app.get("/next", (req, res) => {
    gameOrderNum++
    const game = games[gameOrderNum]
    if(game) {
      res.send(formRes(game))
    }
    else {
      gameOrderNum--
      res.send(JSON.stringify("Last game reached"))
    }
  })
  app.listen(3000, () => console.log("Presentation running on port 3000."))
  const url = 'http://localhost:3000';
  var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
  exec(start + ' ' + url);
}