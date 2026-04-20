// src/components/ui/MainMenu.tsx
import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';

export default function MainMenu() {
  const { setScreen, gold } = useGameStore();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-sky-200">
      
      {/* 1. LỚP BACKGROUND - Fix style cứng để đảm bảo phủ kín màn hình */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <Image 
          src="/assets/ui/Background.png" // Đã khớp với ảnh trong VS Code của bạn
          alt="Background" 
          fill 
          style={{ objectFit: 'cover' }} 
          priority 
        />
      </div>

      {/* 2. TOP BAR */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-start p-4 z-10">
        
        {/* Góc trái: Profile */}
        <div className="cursor-pointer hover:scale-105 transition-transform drop-shadow-lg relative">
          <Image src="/assets/ui/profile.png" alt="Profile" width={80} height={80} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">!</span>
        </div>

        {/* Ở giữa: Shop & Vàng */}
        <div className="flex flex-col items-center gap-2 mt-2 cursor-pointer hover:scale-105 transition-transform">
          <div className="drop-shadow-lg">
            <Image src="/assets/ui/shop-icon.png" alt="Shop" width={64} height={64} />
          </div>
          <div className="bg-black/40 backdrop-blur-sm border-2 border-yellow-400 rounded-full px-4 py-1 flex items-center gap-2 shadow-inner">
            <Image src="/assets/ui/coin.png" alt="Coin" width={24} height={24} />
            <span className="text-yellow-400 font-black text-lg drop-shadow-md">{gold}</span>
          </div>
        </div>

        {/* Góc phải: Nút Settings */}
        <div className="cursor-pointer hover:rotate-90 transition-transform duration-300 drop-shadow-lg">
          <Image src="/assets/ui/settings-icon.png" alt="Settings" width={64} height={64} />
        </div>

      </div>

      {/* 3. LEFT PANEL */}
      <div className="absolute left-4 top-1/3 flex flex-col gap-6 z-10">
        <button className="hover:scale-110 transition-transform drop-shadow-lg animate-bounce">
          <Image src="/assets/ui/no-ads.png" alt="No Ads" width={64} height={64} />
        </button>
        <button className="hover:scale-110 transition-transform drop-shadow-lg flex flex-col items-center relative">
          <Image src="/assets/ui/GoldenChess.png" alt="Time Chest" width={64} height={64} />
          <span className="absolute -bottom-4 bg-orange-600 text-white text-xs font-bold px-2 rounded-md border border-orange-300 shadow-md whitespace-nowrap">
            15:00
          </span>
        </button>
      </div>

      {/* 4. RIGHT PANEL */}
      <div className="absolute right-4 top-1/3 flex flex-col gap-6 z-10 items-end">
        <button className="hover:scale-110 transition-transform drop-shadow-lg">
          <Image src="/assets/ui/lucky-spin.png" alt="Lucky Spin" width={64} height={64} />
        </button>
        <button className="hover:scale-110 transition-transform drop-shadow-lg flex flex-col items-center relative">
          <Image src="/assets/ui/daily-chess.png" alt="Daily Chest" width={64} height={64} />
          <span className="absolute -bottom-4 bg-green-600 text-white text-xs font-bold px-2 rounded-md border border-green-300 shadow-md whitespace-nowrap">
            FREE
          </span>
        </button>
      </div>

      {/* 5. CENTER (Nút Play) */}
      <div className="absolute inset-0 flex items-center justify-center mt-32 z-10">
        <button 
          onClick={() => setScreen('PLAY')}
          className="relative drop-shadow-2xl hover:brightness-110 active:scale-95 transition-all heart-beat"
        >
          <Image src="/assets/ui/play-btn.png" alt="Play Game" width={220} height={100} />
        </button>
      </div>

      {/* CSS Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.08); }
          30% { transform: scale(1); }
          45% { transform: scale(1.08); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .heart-beat {
          animation: heartbeat 2s infinite;
        }
      `}} />

    </div>
  );
}