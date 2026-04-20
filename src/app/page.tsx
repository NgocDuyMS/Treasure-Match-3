// src/app/page.tsx
'use client';

import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/ui/MainMenu';
import GamePlay from '@/components/game/GamePlay';

export default function App() {
  // Lấy trạng thái màn hình hiện tại từ kho lưu trữ
  const currentScreen = useGameStore((state) => state.currentScreen);

  // Bộ định tuyến (Router) đơn giản
  return (
    <>
      {currentScreen === 'MENU' && <MainMenu />}
      {currentScreen === 'PLAY' && <GamePlay />}
    </>
  );
}