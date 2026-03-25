// src/core/board.ts
import { Board, Cell } from '@/types/board';
import { GemType, CellModifier } from '@/types/gem';

// Khai báo danh sách các loại đá quý
const GEM_TYPES = [
  GemType.RED,
  GemType.BLUE,
  GemType.GREEN,
  GemType.YELLOW,
  GemType.PURPLE,
];

// Hàm tiện ích: Bốc ngẫu nhiên 1 loại đá
const getRandomGem = (): GemType => {
  return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
};

/**
 * Thuật toán khởi tạo bàn chơi an toàn
 * Đảm bảo KHÔNG CÓ chuỗi 3 viên nào (ngang hoặc dọc) được tạo sẵn
 */
export const createInitialBoard = (rows: number = 8, cols: number = 8): Board => {
  const board: Board = [];

  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    
    for (let c = 0; c < cols; c++) {
      let type: GemType;
      let isMatch = true;

      // Vòng lặp kiểm tra: Cứ random, nếu phát hiện trùng 3 thì random lại màu khác
      while (isMatch) {
        type = getRandomGem();
        
        // Kiểm tra 2 ô liền kề bên trái (chỉ xét khi đang ở cột thứ 2 trở đi)
        const matchLeft = c >= 2 && row[c - 1].type === type && row[c - 2].type === type;
        
        // Kiểm tra 2 ô liền kề phía trên (chỉ xét khi đang ở hàng thứ 2 trở đi)
        // board[r-1] là hàng ngay trên, row[c] tương đương với phần tử ở cột c của hàng hiện tại
        const matchUp = r >= 2 && board[r - 1][c].type === type && board[r - 2][c].type === type;

        // Nếu viên đá vừa bốc ra không tạo thành chuỗi 3 ở cả 2 hướng -> An toàn!
        if (!matchLeft && !matchUp) {
          isMatch = false; 
        }
      }
      const randomMod = Math.random();
      let cellModifier = CellModifier.NONE;
      
      if (r > 2) { // Không thả chướng ngại vật ở 3 hàng đầu để tránh kẹt game sớm
        if (randomMod > 0.92) {
          cellModifier = CellModifier.FROZEN;   // 8% cơ hội Đóng băng
        } else if (randomMod > 0.85) {
          cellModifier = CellModifier.CHAINED;  // 7% cơ hội Bị xích
        }
      }
      // Đưa viên đá hợp lệ vào hàng
      row.push({
        id: `cell-${Date.now()}-${r}-${c}`,
        type: type!,
        modifier: cellModifier, // Gán modifier vào đây
        position: { row: r, col: c },
      });
    }
    board.push(row);
  }

  return board;
};