import Cell from './cell.js'
import {DEFEAT_EVENT_NAME} from './cell.js'
import {breakKeyboardMode} from './keyboardController.js'

const fieldWidth = 12
const fieldHeight = 12
const bombsCount = 20

const minefieldContainer = document.querySelector('.minefield')

const flagsCountLabel = document.querySelector('.bombs-count')

window.globalThis.cells = []

minefieldContainer.addEventListener('contextmenu', event => {
    event.preventDefault()
})

function initGame() {
    window.globalThis.isBombsInitiated = false
    window.globalThis.gameStatus = 0    //0 - игра идет; 1 игра окончена
    window.globalThis.closedCellsCount = fieldWidth * fieldHeight
    window.globalThis.markedBombsCount = 0
    generateField(fieldWidth, fieldHeight)
    minefieldContainer.addEventListener('click', firstClickHandler, {capture: true})
}

function clearGame() {
    breakKeyboardMode()
    gameResultLabel.classList.add('hide')
    gameResultLabel.classList.remove('lose')
    gameResultLabel.classList.remove('victory')
    window.globalThis.cells = []
    minefieldContainer.innerHTML = ""
    flagsCountLabel.innerHTML = `0/${bombsCount}`
}

function restartGame() {
    clearGame()
    initGame()
}

function firstClickHandler(event) {
    if (event.target.classList.contains('cell')) {
        let x = +event.target.getAttribute('x')
        let y = +event.target.getAttribute('y')
        setBombs(fieldWidth, bombsCount, {x, y})
        minefieldContainer.removeEventListener('click', firstClickHandler, {capture: true})
        window.globalThis.isBombsInitiated = true
    }
}

function generateField(fieldWidth, fieldHeight) {
    for (let i = 0; i < fieldWidth; i++) {
        window.globalThis.cells[i] = []
        for (let j = 0; j < fieldHeight; j++) {
            let cell = document.createElement('div')
            cell.classList.add('cell')
            minefieldContainer.append(cell)
            window.globalThis.cells[i].push(new Cell(cell, j, i, false, window.globalThis.cells))
        }
    }
}

function setBombs(fieldWidth, bombsCount, initPoint = {x: -1, y: -1}) {
    let settedBombsHashes = new Set()
    while (settedBombsHashes.size < bombsCount) {
        let bombX = Math.trunc(Math.random() * 12)
        let bombY = Math.trunc(Math.random() * 12)
        let hash = bombY * fieldWidth + bombX
        let notBombNearCondition = !(bombX === initPoint.x && bombY === initPoint.y) && !(bombX === initPoint.x && bombY === initPoint.y + 1)
                        &&  !(bombX === initPoint.x && bombY === initPoint.y - 1) && !(bombX === initPoint.x - 1 && bombY === initPoint.y)
                        &&  !(bombX === initPoint.x - 1 && bombY === initPoint.y - 1) && !(bombX === initPoint.x - 1 && bombY === initPoint.y + 1)
                        &&  !(bombX === initPoint.x + 1 && bombY === initPoint.y - 1) && !(bombX === initPoint.x + 1 && bombY === initPoint.y)
                        && !(bombX === initPoint.x + 1 && bombY === initPoint.y + 1)
        if (notBombNearCondition) {
            settedBombsHashes.add(hash)
        }
    }
    settedBombsHashes.forEach(hash => {
        let x = hash % fieldWidth
        let y = (hash - x) / fieldWidth
        window.globalThis.cells[y][x].hasBomb = true
    })
    window.globalThis.cells.forEach(cellsRow => {
        cellsRow.forEach(cell => {
            cell.setBombsNearCount()
        })
    })
}

const gameResultLabel = document.querySelector('.game-result')
const DEFEAT_TEXT = 'Неудача'
const VICTORY_TEXT = 'Победа!'

function showDefeat() {
    gameResultLabel.innerHTML = DEFEAT_TEXT
    gameResultLabel.classList.remove('hide')
    gameResultLabel.classList.add('lose')
    window.globalThis.cells.forEach(cellsRow => {
        cellsRow.forEach(cell => {
            if (cell.hasBomb) {
                cell.showBomb()
            }
        })
    })
    window.globalThis.gameStatus = 1
}

document.addEventListener(DEFEAT_EVENT_NAME, () => {
    showDefeat()
})

function checkVictory() {
    if (window.globalThis.markedBombsCount === bombsCount && window.globalThis.closedCellsCount === bombsCount) {
        showVictory()
    }
}

function showVictory() {
    gameResultLabel.innerHTML = VICTORY_TEXT
    gameResultLabel.classList.remove('hide')
    gameResultLabel.classList.add('victory')
    window.globalThis.gameStatus = 1
}

initGame()

let playAgainButton = document.querySelector('.play-again-button')
playAgainButton.addEventListener('click', () => {
    restartGame()
})

export default {bombsCount, checkVictory, fieldWidth, fieldHeight, minefieldContainer, firstClickHandler, restartGame}

