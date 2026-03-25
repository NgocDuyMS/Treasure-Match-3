import React from 'react';
import Image from 'next/image';
import { Cell as CellType } from '@/types/board';
import { GemType, CellModifier } from '@/types/gem';

export const Cell: React.FC<{ data: CellType; onClick: () => void; isSelected?: boolean }> = ({ data, onClick, isSelected }) => {
  const getGemImagePath = (type: GemType) => {
    if (type === GemType.EMPTY) return null;
    return `/assets/gems/${type.toLowerCase()}.png`;
  };

  const imgSrc = getGemImagePath(data.type);

  return (
    <div
      onClick={onClick}
      style={{
        width: '50px',
        height: '50px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Màu nền mờ mờ cho ô
        border: isSelected ? '3px solid white' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        boxSizing: 'border-box',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.2s',
      }}
    >
      {imgSrc && (
        <Image 
          src={imgSrc} 
          alt={data.type} 
          width={40}  // Kích thước cứng cho ảnh
          height={40} // Kích thước cứng cho ảnh
          style={{ objectFit: 'contain' }}
          priority={data.position.row < 3}
        />
      )}

      {/* Hiệu ứng xích */}
      {data.modifier === CellModifier.CHAINED && (
        <div style={{ position: 'absolute', fontSize: '24px', pointerEvents: 'none' }}>🔗</div>
      )}
    </div>
  );
};