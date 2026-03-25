"use client";
import { useState, useEffect } from "react";
import { Board } from "@/components/game/Board";
import { Position, Board as BoardData } from "@/types/board";
import { createInitialBoard } from "@/core/board";
import { canSwap, isAdjacent, swapGems } from "@/core/swap";
import { findMatches, removeMatches } from "@/core/match";
import { applyGravity } from "@/core/gravity";

export default function Home() {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const newBoard = createInitialBoard(8, 8); // Tạo bàn 8x8
    setBoard(newBoard);
  }, []);

  // HÀM MỚI: Đệ quy xử lý các chuỗi Combo liên tiếp
  const processCombos = (currentBoard: BoardData, comboMultiplier: number) => {
    const matches = findMatches(currentBoard);

    // ĐIỀU KIỆN DỪNG ĐỆ QUY: Không còn chuỗi nào nữa
    if (matches.length === 0) {
      setIsProcessing(false); // Mở khóa bàn phím cho người chơi đi lượt tiếp theo
      return;
    }

    // 1. Phá vỡ đá
    setTimeout(() => {
      const boardAfterRemove = removeMatches(currentBoard, matches);
      setBoard(boardAfterRemove);

      // Tính điểm: Cơ bản 100 điểm/viên, nhân với hệ số Combo!
      const pointsEarned = matches.length * 100 * comboMultiplier;
      setScore((prev) => prev + pointsEarned);
      console.log(
        `🔥 COMBO x${comboMultiplier}! Vỡ ${matches.length} viên, cộng ${pointsEarned} điểm!`,
      );

      // 2. Trọng lực kéo đá rơi xuống
      setTimeout(() => {
        const boardAfterGravity = applyGravity(boardAfterRemove);
        setBoard(boardAfterGravity);

        // 3. ĐỆ QUY: Gọi lại chính nó để quét mảng mới xem có vô tình tạo chuỗi không
        setTimeout(() => {
          processCombos(boardAfterGravity, comboMultiplier + 1);
        }, 300); // Đợi 300ms cho đá rơi ổn định rồi mới quét tiếp
      }, 300); // Đợi 300ms cho hiệu ứng đá vỡ xong
    }, 300); // Đợi 300ms lúc vừa hoán đổi xong
  };
  // Xử lý khi người chơi yêu cầu swap (đổi chỗ)
  const handleSwapRequest = (pos1: Position, pos2: Position) => {
    if (!board || isProcessing) return;
    if (!canSwap(board, pos1, pos2)) return;

    setIsProcessing(true);

    const tempBoard = swapGems(board, pos1, pos2);
    const matches = findMatches(tempBoard);

    if (matches.length === 0) {
      setBoard(tempBoard);
      setTimeout(() => {
        setBoard(board); // Phục hồi trạng thái cũ
        setIsProcessing(false); // Mở khóa tương tác
      }, 400);
    } else {
      // TRƯỜNG HỢP 2: CÓ CHUỖI (Nước đi đúng)

      setBoard(tempBoard); // Chốt bàn cờ mới
      setTimeout(() => {
        processCombos(tempBoard, 1); // Bắt đầu chuỗi với hệ số Combo x1
      }, 0);      
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "white",
          marginBottom: "32px",
          letterSpacing: "2px",
        }}
      >
        TREASURE MATCH <span style={{ color: "#22d3ee" }}> 3 </span>
      </h1>

      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(15, 10, 30, 0.9) 100%)",
          padding: "10px 30px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "2px solid rgba(251, 191, 36, 0.6)",
          boxShadow:
            "0 0 20px rgba(251, 191, 36, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            color: "#e2e8f0",
            fontSize: "1rem",
            marginRight: "10px",
            fontFamily: '"Orbitron", "Courier New", monospace',
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
            textShadow: "0 0 8px rgba(255,255,255,0.3)",
          }}
        >
          SCORE:
        </span>
        <span
          style={{
            color: "#fbbf24",
            fontSize: "1.8rem",
            fontWeight: "bold",
            fontFamily: '"Orbitron", "Courier New", monospace',
            textShadow:
              "0 0 12px rgba(251, 191, 36, 0.8), 0 0 24px rgba(251, 191, 36, 0.4)",
            letterSpacing: "0.05em",
          }}
        >
          {score}
        </span>
      </div>

      {board ? (
        <Board boardData={board} onSwapRequest={handleSwapRequest} />
      ) : (
        <div style={{ color: "#22d3ee", fontSize: "1.25rem" }}>
          Đang tải kho báu...
        </div>
      )}
    </main>
  );
}
