import { CellValue } from './cell'
import { cloneBoard } from './board'
import { recursiveSolve } from './solve'

export const sweep = (board, x, y) => {
  const losePosition = getSweepLosePosition(board, x, y)

  if (losePosition) {
    return { losePosition }
  } else {
    return { board: sweepSafely(board, x, y) }
  }
}

const sweepSafely = (board, x, y) => {
  const boardWidth = board[0].length
  const boardHeight = board.length

  let newBoard = cloneBoard(board)

  for (let i = Math.max(0, x - 1); i < Math.min(x + 2, boardWidth); i++)
    for (let j = Math.max(0, y - 1); j < Math.min(y + 2, boardHeight); j++) {
      if (board[j][i] === CellValue.UnknownClear)
        newBoard = recursiveSolve(newBoard, i, j)
    }

  return newBoard
}

const getSweepLosePosition = (board, x, y) => {
  const boardWidth = board[0].length
  const boardHeight = board.length
  for (let i = Math.max(0, x - 1); i < Math.min(x + 2, boardWidth); i++)
    for (let j = Math.max(0, y - 1); j < Math.min(y + 2, boardHeight); j++)
      if (board[j][i] === CellValue.UnknownMine)
        return { x: i, y: j }
  return null
}
