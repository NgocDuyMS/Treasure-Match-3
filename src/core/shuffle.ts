// src/core/shuffle.ts
import { Board, Cell } from '@/types/board';
import { CellModifier, GemType } from '@/types/gem';
import { findMatches } from './match';
import { findBestMove } from '@/ai/search';

/**
 * Thuật toán Xáo trộn (Shuffle) giải quyết Bế tắc (Deadlock)
 */
export const shuffleBoard = (board: Board): Board => {
  let newBoard = board.map(row => [...row]);
  let isValid = false;

  // AI vòng lặp: Cứ trộn đến khi nào ra một bàn cờ đạt chuẩn thì thôi
  while (!isValid) {
    const movableCells: Cell[] = [];

    // 1. Gom tất cả các viên đá có thể hoán đổi (Bỏ qua ô Trống và ô Bị Xích)
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[0].length; c++) {
        if (newBoard[r][c].type !== GemType.EMPTY && newBoard[r][c].modifier !== CellModifier.CHAINED) {
          movableCells.push(newBoard[r][c]);
        }
      }
    }

    // 2. Thuật toán Fisher-Yates xáo trộn mảng cực nhanh
    for (let i = movableCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempType = movableCells[i].type;
      movableCells[i].type = movableCells[j].type;
      movableCells[j].type = tempType;
    }

    // 3. Xếp đá đã trộn quay trở lại ma trận 2 chiều
    let index = 0;
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[0].length; c++) {
        if (newBoard[r][c].type !== GemType.EMPTY && newBoard[r][c].modifier !== CellModifier.CHAINED) {
          // Chỉ thay đổi Màu sắc (type), giữ nguyên các thuộc tính khác như ID, Position
          newBoard[r][c] = { ...newBoard[r][c], type: movableCells[index].type };
          index++;
        }
      }
    }

    // 4. KIỂM ĐỊNH BẰNG AI
    const hasImmediateMatches = findMatches(newBoard).length > 0;
    const hasValidMoves = findBestMove(newBoard) !== null;

    // Bàn cờ chuẩn là: KHÔNG CÓ chuỗi nổ sẵn VÀ PHẢI CÓ ít nhất 1 nước đi
    if (!hasImmediateMatches && hasValidMoves) {
      isValid = true; 
    }
  }

  return newBoard;
};