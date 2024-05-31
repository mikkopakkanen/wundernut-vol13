const mazeContainer = document.getElementById("maze-container")

// Function to create the maze grid
function createMaze(maze) {
  mazeContainer.innerHTML = ""
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
    })
  })
}

// Initial Positions
let heroPosition = { x: 0, y: 0 }
let dragonPosition = { x: 0, y: 0 }

// Function to place the Hero and Dragon
function placeCharacters() {
  document.querySelector(".hero")?.classList.remove("hero")
  document.querySelector(".dragon")?.classList.remove("dragon")
  document.querySelector(`[data-row="${heroPosition.y}"][data-col="${heroPosition.x}"]`).classList.add("hero")
  document.querySelector(`[data-row="${dragonPosition.y}"][data-col="${dragonPosition.x}"]`).classList.add("dragon")
}

async function fetchAsync (url) {
  let response = await fetch(url)
  let data = await response.json()
  return data
}

// Function to animate the movement
function animate(heroPath, dragonPath, moves, i = 0) {
  console.log(i)
  heroPosition.x = heroPath[0].y
  heroPosition.y = heroPath[0].x
  dragonPosition.x = dragonPath[0].y
  dragonPosition.y = dragonPath[0].x

  placeCharacters()
  i++

  if (i !== moves) {
    heroPath.shift()
    dragonPath.shift()
    setTimeout(() => animate(heroPath, dragonPath, moves, i), 500) // Adjust speed of animation
  }
}

async function init() {
  const data = await fetchAsync("/game")
  const { matrix, heroStart, heroPath, dragonStart, dragonPath, start, end, moves } = data
  heroPosition = heroStart
  dragonPosition = dragonStart
  createMaze(matrix)
  placeCharacters(heroStart, dragonStart)
  animate(heroPath, dragonPath, moves, 0)
}

// Initialize the maze and characters
init()
createMaze()
placeCharacters()
animate()
