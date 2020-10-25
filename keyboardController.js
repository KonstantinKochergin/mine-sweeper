import app from './app.js'

let isKeyboardMode = false  //true - управление клавиатурой; false - управление мышкой
let currentCoors = {x: -1, y: -1}

function startKeyboardMode() {
    isKeyboardMode = true
    currentCoors = findFirstAvailableCellCoors()
    setCellFocus(currentCoors)
    app.minefieldContainer.classList.add('keyboard-mode')
}

export function breakKeyboardMode() {
    if (!isKeyboardMode) return
    isKeyboardMode = false
    setCellUnfocus(currentCoors)
    currentCoors = {x: -1, y: -1}
    app.minefieldContainer.classList.remove('keyboard-mode')
}

function setCellFocus(coors) {
    window.globalThis.cells[coors.y][coors.x].setFocus()
}

function setCellUnfocus(coors) {
    window.globalThis.cells[coors.y][coors.x].dropFocus()
}

function moveFocusRight() {
    let nextX = currentCoors.x + 1
    let nextY = currentCoors.y
    if (nextX >= app.fieldWidth) { 
        nextX = 0
        nextY = changeValueInInterval(nextY, 0, app.fieldHeight - 1, 1)
    }
    setCellUnfocus(currentCoors)
    currentCoors.x = nextX
    currentCoors.y = nextY
    setCellFocus(currentCoors)
}

function moveFocusLeft() {
    let nextX = currentCoors.x - 1
    let nextY = currentCoors.y
    if (nextX < 0) { 
        nextX = app.fieldWidth - 1
        nextY = changeValueInInterval(nextY, 0, app.fieldHeight - 1, -1)
    }
    setCellUnfocus(currentCoors)
    currentCoors.x = nextX
    currentCoors.y = nextY
    setCellFocus(currentCoors)
}

function moveFocusUp() {
    let nextY = currentCoors.y - 1
    let nextX = currentCoors.x
    if (nextY < 0) { 
        nextY = app.fieldHeight - 1
        nextX = changeValueInInterval(nextX, 0, app.fieldWidth - 1, -1)
    }
    setCellUnfocus(currentCoors)
    currentCoors.y = nextY
    currentCoors.x = nextX
    setCellFocus(currentCoors)
}

function moveFocusDown() {
    let nextY = currentCoors.y + 1
    let nextX = currentCoors.x
    if (nextY >= app.fieldHeight) { 
        nextY = 0
        nextX = changeValueInInterval(nextX, 0, app.fieldWidth - 1, 1)
    }
    setCellUnfocus(currentCoors)
    currentCoors.y = nextY
    currentCoors.x = nextX
    setCellFocus(currentCoors)
}

function changeValueInInterval(value, min, max, delta) {
    value += delta
    if (value > max) {
        value = min
    }
    else if (value < min) {
        value = max
    }
    return value
}

function findFirstAvailableCellCoors() {
    for (let i = 0; i < app.fieldHeight; i++) {
        for (let j = 0; j < app.fieldWidth; j++) {
            if (!window.globalThis.cells[i][j].isOpen) {
                return {x: j, y: i}
            }
        }
    }
}

document.addEventListener('keyup', event => {
    let arrowLeftCondition = event.code === 'ArrowLeft'
    let arrowRightCondition = event.code === 'ArrowRight'
    let arrowUpCondition =  event.code === 'ArrowUp'
    let arrowDownCondition =  event.code === 'ArrowDown'  
    if (arrowLeftCondition || arrowRightCondition || arrowDownCondition || arrowUpCondition) {
        if (!isKeyboardMode) {
            startKeyboardMode()
            return
        }
    }
    if (arrowLeftCondition) {
        moveFocusLeft()
    }
    else if (arrowRightCondition) {
        moveFocusRight()
    }
    else if (arrowUpCondition) {
        moveFocusUp()
    }
    else if (arrowDownCondition) {
        moveFocusDown()
    }
    else if (event.code === 'Escape') {
        if (isKeyboardMode) {
            breakKeyboardMode()
        }
    }
    else if (event.code === 'Space') {
        if (isKeyboardMode) {
            if (!window.globalThis.isBombsInitiated) {
                app.firstClickHandler({target: window.globalThis.cells[currentCoors.y][currentCoors.x].elem})     //костыль
            }
            window.globalThis.cells[currentCoors.y][currentCoors.x].onClick()
        }
    }
    else if (event.code === 'Enter') {
        if (isKeyboardMode) {
            window.globalThis.cells[currentCoors.y][currentCoors.x].onRightClick()
        }
    }
    else if (event.code === 'KeyR') {
        app.restartGame()
    }
})

document.addEventListener('click', () => {
    breakKeyboardMode()
})