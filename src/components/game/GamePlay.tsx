"use client";
import { useState, useEffect } from "react";
import { Board } from "@/components/game/Board";
import { Position, Board as BoardData } from "@/types/board";
import { createInitialBoard } from "@/core/board";
import { canSwap, isAdjacent, swapGems } from "@/core/swap";
import { findMatches, removeMatches } from "@/core/match";
import { applyGravity } from "@/core/gravity";
import { findBestMove, MoveSuggestion } from '@/ai/search';
import { shuffleBoard } from '@/core/shuffle';


export default function GamePlay() {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [hintMove, setHintMove] = useState<MoveSuggestion | null>(null);
  const [isAutoBotEnabled, setIsAutoBotEnabled] = useState<boolean>(false); // cong tac bat tat auto bot 

  // Hàm xử lý xin gợi ý
  const handleGetHint = () => {
    if (!board || isProcessing) return;
    
    const bestMove = findBestMove(board);
    if (bestMove) {
      console.log(`AI Gợi ý: Đổi (${bestMove.pos1.row}, ${bestMove.pos1.col}) với (${bestMove.pos2.row}, ${bestMove.pos2.col}) - Điểm kì vọng: ${bestMove.score}`);
      setHintMove(bestMove);
      
      // Tự động tắt hiệu ứng gợi ý sau 3 giây
      setTimeout(() => setHintMove(null), 3000);
    } else {
      alert("AI bó tay! Bàn cờ này đã rơi vào trạng thái bế tắc (Deadlock).");
    }
  };

  useEffect(() => {
    const newBoard = createInitialBoard(8, 8); // Tạo bàn 8x8
    setBoard(newBoard);
  }, []);

  // theo doi trang thai ban co 
  useEffect(() => {
    // Nếu Bot đang được Bật, và hệ thống ĐANG RẢNH (không vỡ đá, rơi đá), và đã có bàn cờ
    if (isAutoBotEnabled && !isProcessing && board) {
      
      // Cho bot đợi 1 giây trước khi đi nước tiếp theo (Để thầy cô/người chơi kịp nhìn)
      const botTimer = setTimeout(() => {
        const bestMove = findBestMove(board);
        
        if (bestMove) {
          console.log(`🤖 BOT ĐANG CHƠI: Đổi (${bestMove.pos1.row}, ${bestMove.pos1.col}) với (${bestMove.pos2.row}, ${bestMove.pos2.col})`);
          
          // Tự động kích hoạt hàm hoán đổi y hệt như người chơi click chuột
          handleSwapRequest(bestMove.pos1, bestMove.pos2);
        } else {
          // Bế tắc (Deadlock)
          console.log("🤖 BOT BÓ TAY: Đã hết nước đi hợp lệ trên bàn cờ!");
          setIsAutoBotEnabled(false); // Tự động tắt Bot
          alert("Bàn cờ đã bế tắc (Deadlock)! Cần thuật toán Xáo trộn (Shuffle) ở bước sau.");
        }
      }, 1000); // 1000ms = 1 giây delay

      // Cleanup function để tránh việc Bot đi lung tung nếu component render lại
      return () => clearTimeout(botTimer);
    }
  }, [isAutoBotEnabled, isProcessing, board]);

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
    setHintMove(null);
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
 
      {/* KHU VỰC ĐIỂM SỐ VÀ NÚT BẤM */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(15, 10, 30, 0.9) 100%)",
            padding: "10px 30px",
            borderRadius: "12px",
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
 
        {/* Nút bấm AI */}
        <button
          onClick={handleGetHint}
          disabled={isProcessing}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '20px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)',
            transition: 'all 0.2s',
            opacity: isProcessing ? 0.6 : 1,
          }}
        >
          💡 GỢI Ý (AI)
        </button>

        {/* NÚT MỚI: BẬT/TẮT AUTO-BOT */}
        <button 
          onClick={() => setIsAutoBotEnabled(!isAutoBotEnabled)}
          style={{
            // Nếu Bot đang bật thì nút màu Đỏ (để tắt), nếu đang tắt thì nút màu Xanh lá
            backgroundColor: isAutoBotEnabled ? '#ef4444' : '#10b981', 
            color: 'white', border: 'none', padding: '12px 20px',
            borderRadius: '20px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: `0 4px 6px -1px ${isAutoBotEnabled ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`, 
            transition: 'all 0.2s'
          }}
        >
          {isAutoBotEnabled ? '🛑 DỪNG BOT' : '🤖 BẬT AUTO-BOT'}
        </button>

      </div>
 
      {board ? (
        <Board boardData={board} onSwapRequest={handleSwapRequest} hintMove={hintMove} />
      ) : (
        <div style={{ color: "#22d3ee", fontSize: "1.25rem" }}>
          Đang tải kho báu...
        </div>
      )}
    </main>
  );
}
