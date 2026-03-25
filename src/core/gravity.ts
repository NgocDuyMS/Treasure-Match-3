// src/core/gravity.ts
// trong luc Gravity
import { Board } from "@/types/board";
import { GemType, CellModifier } from "@/types/gem";

const GEM_TYPES = [
  GemType.RED,
  GemType.BLUE,
  GemType.GREEN,
  GemType.YELLOW,
  GemType.PURPLE,
];

const getRandomGem = (): GemType => {
  return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
};

/**
 * Thuật toán Trọng lực: Kéo đá rơi xuống và sinh đá mới ở trên cùng
 */
export const applyGravity = (board: Board): Board => {
  const rows = board.length;
  const cols = board[0].length;

  // Clone mảng để không ảnh hưởng đến state cũ của React
  const newBoard = board.map((row) => [...row]);

  // Quét từng cột một (từ trái sang phải)
  for (let c = 0; c < cols; c++) {
    // 1. Nhặt tất cả các viên đá KHÔNG TRỐNG trong cột hiện tại (giữ nguyên thứ tự từ trên xuống)
    const columnGems = [];
    for (let r = 0; r < rows; r++) {
      if (newBoard[r][c].type !== GemType.EMPTY) {
        columnGems.push(newBoard[r][c]);
      }
    }

    // 2. Tính xem cột này bị khuyết bao nhiêu viên (chính là số ô trống ở trên cùng)
    const missingCount = rows - columnGems.length;

    // 3. Xếp lại cột từ dưới lên trên
    for (let r = rows - 1; r >= 0; r--) {
      if (r >= missingCount) {
        // Dồn các viên đá cũ xuống dưới cùng
        const gem = columnGems[r - missingCount];
        newBoard[r][c] = {
          ...gem,
          position: { row: r, col: c }, // Cập nhật lại tọa độ mới
        };
      } else {
        // Sinh ra các viên đá hoàn toàn mới lấp vào khoảng trống phía trên
        newBoard[r][c] = {
          id: `cell-${Date.now()}-${Math.random()}`, // Sinh ID mới để React tạo hiệu ứng rơi
          type: getRandomGem(),
          modifier: CellModifier.NONE,
          position: { row: r, col: c },
        };
      }
    }
  }

  return newBoard;
};
