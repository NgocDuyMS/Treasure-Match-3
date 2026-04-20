// src/store/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Định nghĩa các màn hình trong game
export type ScreenState = 'MENU' | 'PLAY';

interface GameState {
  currentScreen: ScreenState; // Đang ở màn hình nào?
  gold: number;               // Số vàng hiện có
  settings: {                 // Cài đặt âm thanh, hiệu ứng
    music: boolean;
    sfx: boolean;
    vibration: boolean;
  };
  // Các hàm (Actions) để thay đổi dữ liệu
  setScreen: (screen: ScreenState) => void;
  addGold: (amount: number) => void;
  toggleSetting: (key: keyof GameState['settings']) => void;
}

export const useGameStore = create<GameState>()(
  // persist: Middleware siêu xịn giúp tự động lưu Vàng và Cài đặt vào LocalStorage
  persist(
    (set) => ({
      currentScreen: 'MENU', // Mở web lên là vào Menu trước
      gold: 0,               // Khởi đầu với 0 vàng
      settings: { music: true, sfx: true, vibration: true }, // Mặc định bật hết
      
      setScreen: (screen) => set({ currentScreen: screen }),
      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      toggleSetting: (key) => set((state) => ({
        settings: { ...state.settings, [key]: !state.settings[key] }
      })),
    }),
    { 
      name: 'treasure-match-storage', // Tên file lưu trong bộ nhớ trình duyệt
      partialize: (state) => ({ gold: state.gold, settings: state.settings }), // Chỉ lưu Vàng và Setting, không lưu Screen
    }
  )
);