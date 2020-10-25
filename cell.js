import app from './app.js'

export const MARK_CELL_EVENT_NAME = 'markcell'
export const UNMARK_CELL_EVENT_NAME = 'unmarkcell'
export const DEFEAT_EVENT_NAME = 'defeat'

class Cell {

    constructor(elem, x, y, hasBomb, cellsAr) {   //x,y - координаты; hasBomb - содержит ли ячейка бомбу; cellsAr - массив всех Cell
        this.elem = elem
        this.x = x
        this.y = y
        this.hasBomb = hasBomb
        this.cellsAr = cellsAr
        this.isOpen = false     //открыта ли ячейка
        this.isMarked = false   //помечена ли ячейка флагом
        this.markCellEvent = new Event(MARK_CELL_EVENT_NAME, {bubbles: true}) //клетка отмечена флагом
        this.unmarkCellEvent = new Event(UNMARK_CELL_EVENT_NAME, {bubbles: true}) //флаг снят
        this.defeatEvent = new Event(DEFEAT_EVENT_NAME, {bubbles: true})    //событие поражения
        elem.setAttribute('x', x)
        elem.setAttribute('y', y)
        elem.addEventListener('click', this.onClick.bind(this))
        elem.addEventListener('contextmenu', this.onRightClick.bind(this))
        this.isFocused = false
    }

    _checkBombsNear() {
        if (this.hasBomb) {
            return -1
        }
        else {
            let bombsCount = 0
            if (this.cellsAr[this.y - 1]) {
                bombsCount += this.cellsAr[this.y - 1][this.x + 1]?.hasBomb ? 1 : 0
                bombsCount += this.cellsAr[this.y - 1][this.x]?.hasBomb ? 1 : 0
                bombsCount += this.cellsAr[this.y - 1][this.x - 1]?.hasBomb ? 1 : 0
            }
            if (this.cellsAr[this.y + 1]) {
                bombsCount += this.cellsAr[this.y + 1][this.x + 1]?.hasBomb ? 1 : 0
                bombsCount += this.cellsAr[this.y + 1][this.x]?.hasBomb ? 1 : 0
                bombsCount += this.cellsAr[this.y + 1][this.x - 1]?.hasBomb ? 1 : 0
            }
            bombsCount += this.cellsAr[this.y][this.x + 1]?.hasBomb ? 1 : 0
            bombsCount += this.cellsAr[this.y][this.x - 1]?.hasBomb ? 1 : 0
            return bombsCount
        }
    }

    showBomb() {
        let childImg = this.elem.querySelector('img')
        if (childImg === null) {
            childImg = document.createElement('img')
            this.elem.append(childImg)
        }
        childImg.src = './media/black-bomb.svg'
    }

    setBombsNearCount() {
        //console.log(this)
        this.bombsNearCount = this._checkBombsNear()
    }

    openCell() {
        if (this.isOpen || this.isMarked) return
        this.isOpen = true
        if (this.hasBomb) {
            this.elem.classList.add('open-bomb')
            let bomb = document.createElement('img')
            bomb.src = './media/bomb.svg'
            this.elem.append(bomb)
            this.elem.dispatchEvent(this.defeatEvent)
            return
        }
        else if (this.bombsNearCount > 0) {
            this.elem.classList.add('open')
            this.elem.innerHTML = this.bombsNearCount
        }
        else {
            this.elem.classList.add('open')
            if (this.cellsAr[this.y - 1]) {
                this.cellsAr[this.y - 1][this.x + 1]?.openCell()
                this.cellsAr[this.y - 1][this.x]?.openCell()
                this.cellsAr[this.y - 1][this.x - 1]?.openCell()
            }
            if (this.cellsAr[this.y + 1]) {
                this.cellsAr[this.y + 1][this.x + 1]?.openCell()
                this.cellsAr[this.y + 1][this.x - 1]?.openCell()
                this.cellsAr[this.y + 1][this.x]?.openCell()
            }
            this.cellsAr[this.y][this.x - 1]?.openCell()
            this.cellsAr[this.y][this.x + 1]?.openCell()
        }
        window.globalThis.closedCellsCount -= 1
        app.checkVictory()
    }

    toogleMarkCell() {
        if (window.globalThis.markedBombsCount >= app.bombsCount && !this.isMarked) return
        this.isMarked = !this.isMarked
        if (this.isMarked) {
            let flag = document.createElement('img')
            flag.src = './media/flag.svg'
            this.elem.append(flag)
            this.elem.dispatchEvent(this.markCellEvent)
            app.checkVictory()
        }
        else {
            this.elem.innerHTML = ''
            this.elem.dispatchEvent(this.unmarkCellEvent)
        }
    }

    onClick() {
        if (window.globalThis.gameStatus !== 0) return
        if (!this.isMarked) {
            this.openCell()
        }
    }

    onRightClick(event) {
        if (window.globalThis.gameStatus !== 0) return
        event?.preventDefault()
        if (!this.isOpen) {
            this.toogleMarkCell()
        }
    }

    setFocus() {
        this.isFocused = true
        this.elem.classList.add('active-cell')
    }

    dropFocus() {
        this.isFocused = false
        this.elem.classList.remove('active-cell')
    }
}

export default Cell