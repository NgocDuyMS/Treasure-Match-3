import React, { useState } from "react";
import { Cell } from "./Cell";
import { Board as BoardData, Position } from "@/types/board";
import { MoveSuggestion } from "@/ai/search";
interface BoardProps {
  boardData: BoardData;
  onSwapRequest: (pos1: Position, pos2: Position) => void;
  hintMove?: MoveSuggestion | null;
}

export const Board: React.FC<BoardProps> = ({
  boardData,
  onSwapRequest,
  hintMove,
}) => {
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);

  const handleCellClick = (row: number, col: number) => {
    const clickedPos = { row, col };
    if (!selectedPos) {
      setSelectedPos(clickedPos);
    } else {
      if (
        selectedPos.row !== clickedPos.row ||
        selectedPos.col !== clickedPos.col
      ) {
        onSwapRequest(selectedPos, clickedPos);
      }
      setSelectedPos(null);
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#1e293b", // Nền bảng màu xanh đen
        borderRadius: "16px",
        display: "inline-block",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 50px)", // Ép cứng 8 cột, mỗi cột 50px
          gap: "4px",
        }}
      >
        {boardData.map((row, rowIndex) =>
          row.map((cellData, colIndex) => {
            const isSelected =
              selectedPos?.row === rowIndex && selectedPos?.col === colIndex;
            const isHinted =
              hintMove &&
              ((hintMove.pos1.row === rowIndex &&
                hintMove.pos1.col === colIndex) ||
                (hintMove.pos2.row === rowIndex &&
                  hintMove.pos2.col === colIndex));

            return (
              <Cell
                key={cellData.id}
                data={cellData}
                isSelected={isSelected || !!isHinted}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};
