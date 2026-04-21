# 💎 Treasure Match AI

**Treasure Match AI** là một tựa game giải đố ghép ngọc (Match-3) được xây dựng hoàn toàn bằng Next.js (App Router) và TypeScript. Điểm đặc biệt của dự án này không chỉ nằm ở giao diện mượt mà mà còn ở **Hệ thống Trí tuệ Nhân tạo (AI)** được tích hợp sâu bên trong Core Logic, cho phép game tự động gợi ý nước đi và thậm chí là **tự động chơi (Auto-Bot)**.

🚀 **Trải nghiệm chơi ngay (Live Demo):** [https://treasure-match-3.vercel.app]

## Cài đặt và chạy thử ( Local Development )

- \*\* clone repo
  git clone [https://github.com/NgocDuyMS/Treasure-Match-3.git]
  cd treasure-match3
- \*\*cài các gói
  npm install
- \*\* khởi động game
  npm run dev

---

## 🎮 Tính năng nổi bật (Features)

### 1. Gameplay Cốt lõi (Core Mechanics)

- **Thuật toán Khởi tạo an toàn:** Sinh bàn cờ 8x8 ngẫu nhiên nhưng đảm bảo không có chuỗi 3 (Match-3) nào được định dạng sẵn gây lỗi game.
- **Hệ thống Vật lý & Trọng lực (Gravity):** Xử lý mảng 2 chiều phức tạp để tạo hiệu ứng đá rơi tự do lấp đầy khoảng trống cực kỳ mượt mà.
- **Phản ứng dây chuyền (Combo System):** Vòng lặp đệ quy bất đồng bộ (Asynchronous Recursion) giúp xử lý các chuỗi vỡ đá liên hoàn để nhân (x2, x3) điểm số.
- **Chướng ngại vật (Obstacles):** - 🔗 **Đá bị xích (Chained):** Khóa cứng vị trí, chỉ vỡ khi tham gia vào chuỗi Match-3.
  - 🧊 **Đá đóng băng (Frozen):** Cố định vị trí, giải cứu bằng cách tạo vụ nổ ở 4 ô xung quanh.

### 2. Trí tuệ Nhân tạo (AI System)

- **Hệ thống Nhận diện (Match Detection):** Thuật toán quét ma trận (Horizontal & Vertical Scanning) theo thời gian thực để tìm chuỗi.
- **Đánh giá Heuristic (Heuristic Evaluation):** Hàm AI tự động chấm điểm các nước đi tiềm năng dựa trên số lượng đá ăn được và mức độ ưu tiên giải cứu chướng ngại vật (ưu tiên phá xích/băng).
- **Hệ thống Gợi ý (Hint System):** Sử dụng thuật toán Tìm kiếm Không gian Trạng thái (State Space Search) để chỉ điểm nước đi tối ưu nhất cho người chơi.
- **Auto-Bot:** Bot tự động chơi dựa trên kết quả của AI Heuristic.
- **Xử lý Bế tắc (Deadlock Resolution):** Thuật toán xáo trộn **Fisher-Yates** tự động can thiệp và làm mới bàn cờ khi AI chẩn đoán không còn nước đi hợp lệ nào.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework:** [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/) (Strict typing cho Core Logic)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** React Hooks (`useState`, `useEffect`)

---

## 📂 Cấu trúc thư mục thuật toán (Architecture)

Dự án tuân thủ nguyên tắc phân tách rõ ràng giữa Giao diện (UI) và Logic (Core/AI):

```text
src/
├── ai/                # Não bộ của game
│   ├── search.ts      # Duyệt không gian trạng thái tìm nước đi
│   ├── heuristic.ts   # Hàm AI chấm điểm nước đi
├── core/              # Động cơ vật lý & Luật chơi
│   ├── board.ts       # Sinh bàn cờ an toàn
│   ├── match.ts       # Nhận diện chuỗi & phá đá/băng
│   ├── gravity.ts     # Trọng lực & rơi tự do
│   ├── swap.ts        # Thuật toán hoán đổi vị trí
│   └── shuffle.ts     # Thuật toán Fisher-Yates xử lý Deadlock
├── components/        # Giao diện (UI)
│   └── game/          # Board, Cell, Animations, MainMenu, Modals.....
└── types/             # Định nghĩa cấu trúc dữ liệu chặt chẽ
```
