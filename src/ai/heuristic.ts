// src/ai/heuristic.ts
import { Board, Position } from '@/types/board';
import { findMatches } from '@/core/match';
import { swapGems } from '@/core/swap';
import { CellModifier } from '@/types/gem';

/**
 * Hàm Đánh Giá Heuristic: Chấm điểm độ "Ngon" của một nước đi.
 * Điểm càng cao, AI sẽ càng ưu tiên chọn nước đi đó.
 */
export const evaluateMove = (board: Board, pos1: Position, pos2: Position): number => {
  // 1. Mô phỏng nước đi trên một bàn cờ tạm (State Space Search)
  const simulatedBoard = swapGems(board, pos1, pos2);
  const matches = findMatches(simulatedBoard);

  // Nếu nước đi sai (không có chuỗi) -> Điểm = 0
  if (matches.length === 0) return 0;

  let heuristicScore = 0;

  // 2. Tiêu chí 1: Số lượng đá phá được (Khuyến khích tạo chuỗi dài)
  // Ăn 3 viên được 30đ, ăn 4 được 40đ...
  heuristicScore += matches.length * 10; 

  // 3. Tiêu chí 2: ƯU TIÊN PHÁ CHƯỚNG NGẠI VẬT (Tính chiến thuật)
  matches.forEach(pos => {
    // 3.1. Nếu viên đá ăn được đang bị XÍCH -> Cộng điểm rất lớn
    if (board[pos.row][pos.col].modifier === CellModifier.CHAINED) {
      heuristicScore += 100; 
    }

    // 3.2. Quét 4 hướng xung quanh xem có phá được BĂNG không
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(([dr, dc]) => {
      const r = pos.row + dr;
      const c = pos.col + dc;
      
      // Đảm bảo không quét văng ra khỏi mảng
      if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
        if (board[r][c].modifier === CellModifier.FROZEN) {
          // Thưởng điểm cao nếu nước đi này giải cứu được ô đóng băng
          heuristicScore += 80; 
        }
      }
    });
  });

  return heuristicScore;
};