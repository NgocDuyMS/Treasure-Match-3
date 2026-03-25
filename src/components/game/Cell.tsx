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

      {/* HIỆU ỨNG OVERLAY: Đóng băng (Frozen) */}
      {data.modifier === CellModifier.FROZEN && (
        <div className="absolute inset-0 z-20 pointer-events-none w-full h-full">
          <Image 
            src="/assets/gems/frozen.png" // Đổi lại đúng đường dẫn ảnh của bạn
            alt="Frozen" 
            fill 
            className="object-contain opacity-80 drop-shadow-md" 
          />
        </div>
      )}

      {/* HIỆU ỨNG OVERLAY: Bị xích (Chained) */}
      {data.modifier === CellModifier.CHAINED && (
        <div className="absolute inset-0 z-20 pointer-events-none w-full h-full">
          <Image 
            src="/assets/gems/chained.png" // Đổi lại đúng đường dẫn ảnh của bạn
            alt="Chained" 
            fill 
            className="object-contain opacity-80 drop-shadow-xl" 
            
          />
        </div>
      )}
    </div>
  );
};