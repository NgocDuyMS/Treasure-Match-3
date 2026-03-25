// src/core/match.ts
import { Board, Position } from "@/types/board";
import { CellModifier, GemType } from "@/types/gem";

// Hàm quét toàn bộ bàn chơi để tìm các viên đá tạo thành chuỗi (từ 3 viên trở lên)
export const findMatches = (board: Board): Position[] => {
  const matchedPositions: Set<string> = new Set();
  const rows = board.length;
  const cols = board[0].length;

  // 1. Quét theo chiều Ngang (Horizontal)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      const type = board[r][c].type;
      if (type === GemType.EMPTY) continue;

      // Đếm xem có bao nhiêu viên giống nhau liên tiếp
      let matchLength = 1;
      while (
        c + matchLength < cols &&
        board[r][c + matchLength].type === type
      ) {
        matchLength++;
      }

      // Nếu có từ 3 viên trở lên, lưu tọa độ của chúng lại
      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matchedPositions.add(`${r},${c + i}`);
        }
      }

      // Nhảy cóc qua đoạn đã kiểm tra để tối ưu hiệu suất
      c += matchLength - 1;
    }
  }

  // 2. Quét theo chiều Dọc (Vertical)
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      const type = board[r][c].type;
      if (type === GemType.EMPTY) continue;

      let matchLength = 1;
      while (
        r + matchLength < rows &&
        board[r + matchLength][c].type === type
      ) {
        matchLength++;
      }

      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matchedPositions.add(`${r + i},${c}`);
        }
      }
      r += matchLength - 1;
    }
  }

  // Chuyển đổi Set (chứa các chuỗi 'row,col') về lại mảng các Object Position
  return Array.from(matchedPositions).map((posStr) => {
    const [row, col] = posStr.split(",").map(Number);
    return { row, col };
  });
};

export const removeMatches = (board: Board, matches: Position[]): Board => {
  const newBoard = board.map(row => [...row]);
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  // Set dùng để lưu tọa độ các ô cần phá băng (dùng Set để tránh 1 ô bị phá 2 lần)
  const cellsToUnfreeze: Set<string> = new Set();

  matches.forEach(pos => {
    // 1. Phá vỡ viên đá nằm trong chuỗi (Dù có bị xích thì xích cũng tan tành)
    newBoard[pos.row][pos.col] = {
      ...newBoard[pos.row][pos.col],
      type: GemType.EMPTY,
      modifier: CellModifier.NONE 
    };

    // 2. Tìm 4 ô xung quanh (Trên, Dưới, Trái, Phải) để tìm Băng
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(([dr, dc]) => {
      const r = pos.row + dr;
      const c = pos.col + dc;
      
      // Kiểm tra xem tọa độ có nằm trong bàn cờ không
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        // Nếu ô bên cạnh bị đóng băng, đưa vào danh sách chờ giải cứu
        if (newBoard[r][c].modifier === CellModifier.FROZEN) {
          cellsToUnfreeze.add(`${r},${c}`);
        }
      }
    });
  });

  // 3. Thực hiện giải cứu (Phá băng)
  cellsToUnfreeze.forEach(posStr => {
    const [r, c] = posStr.split(',').map(Number);
    newBoard[r][c] = {
      ...newBoard[r][c],
      modifier: CellModifier.NONE // Mất lớp băng, trở thành đá bình thường
    };
  });

  return newBoard;
};
