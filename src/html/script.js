const mazeContainer = document.getElementById("maze-container")
const statsContainer = document.getElementById("stats")

// Function to create the maze grid
function createMaze(maze, end) {
  mazeContainer.innerHTML = ""
  statsContainer.innerHTML = "Moves: 0"
  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div")
      cellElement.classList.add("cell")
      cellElement.dataset.row = rowIndex
      cellElement.dataset.col = colIndex
      if (cell === 1) {
        cellElement.classList.add("path")
      } else {
        cellElement.classList.add("wall")
      }
      mazeContainer.appendChild(cellElement)
      mazeContainer.style.gridTemplateColumns = `repeat(${colIndex+1}, 60px)`
    })
    mazeContainer.style.gridTemplateRows = `repeat(${rowIndex+1}, 60px)`
  })
  document.querySelector(`[data-row="${end.x}"][data-col="${end.y}"]`).classList.add("end") // add end icon
}

// Initial Positions
let heroPosition = { x: 0, y: 0 }
let dragonPosition = { x: 0, y: 0 }

// Function to place the Hero and Dragon
function placeCharacters() {
  document.querySelector(".hero")?.classList.remove("hero")
  document.querySelector(".dragon")?.classList.remove("dragon")
  document.querySelector(`[data-row="${heroPosition.x}"][data-col="${heroPosition.y}"]`).classList.add("hero")
  document.querySelector(`[data-row="${dragonPosition.x}"][data-col="${dragonPosition.y}"]`).classList.add("dragon")
}

async function fetchAsync (url) {
  let response = await fetch(url)
  let data = await response.json()
  if(response.status === 400) {
    alert(data)
    return response.status
  }
  return data
}

// Function to animate the movement
function animate(heroPath, dragonPath, moves, i = 0) {
  heroPosition.x = heroPath[0].x
  heroPosition.y = heroPath[0].y
  dragonPosition.x = dragonPath[0].x
  dragonPosition.y = dragonPath[0].y

  placeCharacters()
  i++
  statsContainer.innerHTML = `Moves: ${i}`

  if (i !== moves) {
    heroPath.shift()
    dragonPath.shift()
    setTimeout(() => animate(heroPath, dragonPath, moves, i), 500) // Adjust speed of animation
  }
}

async function Present(next) {
  let data

  if(!next)
    data = await fetchAsync("/game")
  else
    data = await fetchAsync("/newgame")

  if(data !== 400) {
    const { matrix, heroStart, heroPath, dragonStart, dragonPath, moves, end } = data
    heroPosition = heroStart
    dragonPosition = dragonStart

    createMaze(matrix, end)
    placeCharacters()

    setTimeout(() => animate(heroPath, dragonPath, moves, 0), 1000)
  }
}

Present()
