// src/components/ui/MainMenu.tsx
import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';

export default function MainMenu() {
  const { setScreen, gold } = useGameStore();

  return (
    // Container bao bọc toàn màn hình, chống cuộn
    <div className="relative w-full h-screen overflow-hidden bg-sky-200">
      
      {/* 1. LỚP BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Đổi tên file 'background.png' thành tên ảnh nền của bạn */}
        <Image src="/assets/ui/background.png" alt="Background" fill className="object-cover" priority />
      </div>

      {/* 2. TOP BAR (Hồ sơ - Cửa hàng & Vàng - Cài đặt) */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-start p-4 z-10">
        
        {/* Góc trái: Profile */}
        <div className="cursor-pointer hover:scale-105 transition-transform drop-shadow-lg">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <Image src="/assets/ui/profile.png" alt="Profile" fill className="object-contain" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">!</span>
          </div>
        </div>

        {/* Ở giữa: Shop & Vàng */}
        <div className="flex flex-col items-center gap-2 mt-2 cursor-pointer hover:scale-105 transition-transform">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg">
            <Image src="/assets/ui/shop-icon.png" alt="Shop" fill className="object-contain" />
          </div>
          {/* Thanh hiển thị Vàng */}
          <div className="bg-black/40 backdrop-blur-sm border-2 border-yellow-400 rounded-full px-4 py-1 flex items-center gap-2 shadow-inner">
            <div className="relative w-6 h-6">
              <Image src="/assets/ui/coin.png" alt="Coin" fill className="object-contain" />
            </div>
            <span className="text-yellow-400 font-black text-lg drop-shadow-md">{gold}</span>
          </div>
        </div>

        {/* Góc phải: Nút Settings */}
        <div className="cursor-pointer hover:rotate-90 transition-transform duration-300 drop-shadow-lg">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16">
            <Image src="/assets/ui/settings-icon.png" alt="Settings" fill className="object-contain" />
          </div>
        </div>

      </div>

      {/* 3. LEFT PANEL (No Ads, Rương đếm ngược) */}
      <div className="absolute left-4 top-1/3 flex flex-col gap-6 z-10">
        <button className="relative w-14 h-14 sm:w-16 sm:h-16 hover:scale-110 transition-transform drop-shadow-lg animate-bounce">
          <Image src="/assets/ui/no-ads.png" alt="No Ads" fill className="object-contain" />
        </button>
        <button className="relative w-14 h-14 sm:w-16 sm:h-16 hover:scale-110 transition-transform drop-shadow-lg flex flex-col items-center">
          <Image src="/assets/ui/time-chest.png" alt="Time Chest" fill className="object-contain" />
          {/* Chữ hiển thị đếm ngược (Tạm thời fix cứng) */}
          <span className="absolute -bottom-4 bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-2 rounded-md border border-orange-300 shadow-md">
            15:00
          </span>
        </button>
      </div>

      {/* 4. RIGHT PANEL (Vòng quay, Rương hàng ngày) */}
      <div className="absolute right-4 top-1/3 flex flex-col gap-6 z-10 items-end">
        <button className="relative w-14 h-14 sm:w-16 sm:h-16 hover:scale-110 transition-transform drop-shadow-lg">
          <Image src="/assets/ui/lucky-spin.png" alt="Lucky Spin" fill className="object-contain" />
        </button>
        <button className="relative w-14 h-14 sm:w-16 sm:h-16 hover:scale-110 transition-transform drop-shadow-lg flex flex-col items-center">
          <Image src="/assets/ui/daily-chest.png" alt="Daily Chest" fill className="object-contain" />
          <span className="absolute -bottom-4 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2 rounded-md border border-green-300 shadow-md">
            FREE
          </span>
        </button>
      </div>

      {/* 5. CENTER (Nút Play to đùng với hiệu ứng Nhịp tim) */}
      <div className="absolute inset-0 flex items-center justify-center mt-32 pointer-events-none z-10">
        <button 
          onClick={() => setScreen('PLAY')}
          className="pointer-events-auto relative w-48 h-20 sm:w-64 sm:h-28 drop-shadow-2xl hover:brightness-110 active:scale-95 transition-all heart-beat"
        >
          <Image src="/assets/ui/play-btn.png" alt="Play Game" fill className="object-contain" />
        </button>
      </div>

      {/* Định nghĩa CSS keyframes ngay trong Component cho hiệu ứng nhịp tim */}
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