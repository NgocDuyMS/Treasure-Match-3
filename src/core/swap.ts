// src/core/swap.ts
import { Board, Position } from '@/types/board';
import { CellModifier } from '@/types/gem';
/**
 * 1. Kiểm tra 2 vị trí có nằm sát cạnh nhau không
 * Chỉ hợp lệ nếu khác biệt đúng 1 đơn vị ở hàng HOẶC cột.
 */
export const isAdjacent = (pos1: Position, pos2: Position): boolean => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  
  // Tổng khoảng cách ngang và dọc phải bằng 1 (nghĩa là không được đi chéo)
  return rowDiff + colDiff === 1;
};
export const canSwap = (board: Board, pos1: Position, pos2: Position): boolean => {
  if (!isAdjacent(pos1, pos2)) return false;

  const cell1 = board[pos1.row][pos1.col];
  const cell2 = board[pos2.row][pos2.col];

  // Nếu 1 trong 2 ô bị Xích hoặc Đóng băng thì KHÔNG cho đổi chỗ
  if (cell1.modifier !== CellModifier.NONE || cell2.modifier !== CellModifier.NONE) {
    return false;
  }

  return true;
};
export const swapGems = (board: Board, pos1: Position, pos2: Position): Board => {
  // QUAN TRỌNG: Trong React, chúng ta không được sửa trực tiếp biến State.
  // Phải tạo một bản sao (clone) của bàn chơi hiện tại.
  const newBoard = board.map(row => [...row]);

  // Lấy ra 2 viên đá cần đổi chỗ
  const cell1 = newBoard[pos1.row][pos1.col];
  const cell2 = newBoard[pos2.row][pos2.col];

  // Tráo đổi tọa độ (position) bên trong dữ liệu của viên đá
  const tempPos = { ...cell1.position };
  cell1.position = { ...cell2.position };
  cell2.position = tempPos;

  // Tráo đổi vị trí của chúng trên lưới mảng 2 chiều
  newBoard[pos1.row][pos1.col] = cell2;
  newBoard[pos2.row][pos2.col] = cell1;

  return newBoard;
};