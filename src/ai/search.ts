// src/ai/search.ts
import { Board, Position } from '@/types/board';
import { canSwap } from '@/core/swap';
import { evaluateMove } from './heuristic';

// Định nghĩa cấu trúc kết quả trả về của một nước đi gợi ý
export interface MoveSuggestion {
  pos1: Position;
  pos2: Position;
  score: number;
}

/**
 * Thuật toán tìm nước đi tốt nhất hiện tại trên bàn cờ
 */
export const findBestMove = (board: Board): MoveSuggestion | null => {
  let bestMove: MoveSuggestion | null = null;
  let maxScore = -1; // Khởi tạo điểm cao nhất

  const rows = board.length;
  const cols = board[0].length;

  // Duyệt qua từng ô trên bàn cờ
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const currentPos = { row: r, col: c };

      // Để tối ưu, chúng ta chỉ cần thử hoán đổi viên hiện tại với viên BÊN PHẢI và viên BÊN DƯỚI
      // (Vì từ trái qua phải, từ trên xuống dưới sẽ bao quát hết mọi cặp, không cần thử lại bên trái/trên)
      const neighbors = [
        { row: r, col: c + 1 }, // Phải
        { row: r + 1, col: c }  // Dưới
      ];

      for (const neighborPos of neighbors) {
        // Kiểm tra xem neighbor có nằm trong bàn cờ không
        if (neighborPos.row < rows && neighborPos.col < cols) {
          
          // Kiểm tra xem có bị xích/băng cản trở không
          if (canSwap(board, currentPos, neighborPos)) {
            
            // Gọi AI chấm điểm nước đi này
            const score = evaluateMove(board, currentPos, neighborPos);

            // Nếu nước đi này tạo ra chuỗi (score > 0) và cao điểm hơn kỷ lục cũ
            if (score > 0 && score > maxScore) {
              maxScore = score;
              bestMove = {
                pos1: currentPos,
                pos2: neighborPos,
                score: score
              };
            }
          }
        }
      }
    }
  }

  return bestMove; // Trả về nước đi ngon nhất (hoặc null nếu bàn cờ bị bế tắc / Deadlock)
};