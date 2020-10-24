import app from './app.js'
import {MARK_CELL_EVENT_NAME, UNMARK_CELL_EVENT_NAME} from './cell.js'

const bombsCount = app.bombsCount

window.globalThis.markedBombsCount = 0

const bombsCountLabel = document.querySelector('.bombs-count')

bombsCountLabel.innerHTML = `${window.globalThis.markedBombsCount}/${bombsCount}`

document.addEventListener(MARK_CELL_EVENT_NAME, () => {
    if (window.globalThis.markedBombsCount < bombsCount) {
        window.globalThis.markedBombsCount += 1
        bombsCountLabel.innerHTML = `${window.globalThis.markedBombsCount}/${bombsCount}`
    }
})

document.addEventListener(UNMARK_CELL_EVENT_NAME, () => {
    window.globalThis.markedBombsCount -= 1
    bombsCountLabel.innerHTML = `${window.globalThis.markedBombsCount}/${bombsCount}`
})

