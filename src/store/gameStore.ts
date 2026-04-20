// src/store/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ScreenState = 'MENU' | 'PLAY';

interface GameState {
  currentScreen: ScreenState;
  gold: number;
  isPaused: boolean;
  settings: { music: boolean; sfx: boolean; vibration: boolean };
  
  // MỚI: Túi đồ và Bộ đếm thời gian
  inventory: { hammers: number; freeSwaps: number };
  lastDailyChest: number; // Lưu timestamp (mili-giây) lần cuối mở rương

  setScreen: (screen: ScreenState) => void;
  setPaused: (paused: boolean) => void;
  addGold: (amount: number) => void;
  toggleSetting: (key: keyof GameState['settings']) => void;
  
  // MỚI: Các hành động trong Shop và Rương
  buyItem: (item: keyof GameState['inventory'], cost: number) => boolean;
  claimDailyChest: () => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: 'MENU',
      gold: 1000, // Cho sẵn 1000 vàng để test Shop
      isPaused: false,
      settings: { music: true, sfx: true, vibration: true },
      inventory: { hammers: 0, freeSwaps: 0 },
      lastDailyChest: 0,

      setScreen: (screen) => set({ currentScreen: screen, isPaused: false }),
      setPaused: (paused) => set({ isPaused: paused }),
      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      toggleSetting: (key) => set((state) => ({ settings: { ...state.settings, [key]: !state.settings[key] } })),
      
      // Hàm mua đồ: Kiểm tra xem đủ tiền không, đủ thì trừ tiền, cộng đồ
      buyItem: (item, cost) => {
        const { gold, inventory } = get();
        if (gold >= cost) {
          set({ gold: gold - cost, inventory: { ...inventory, [item]: inventory[item] + 1 } });
          return true; // Mua thành công
        }
        return false; // Không đủ tiền
      },

      // Hàm nhận rương: Cấp vàng và lưu lại thời gian hiện tại
      claimDailyChest: () => {
        set((state) => ({ gold: state.gold + 500, lastDailyChest: Date.now() }));
        return true;
      }
    }),
    {name: 'treasure-match-storage',
      partialize: (state) => ({ gold: state.gold, settings: state.settings, inventory: state.inventory, lastDailyChest: state.lastDailyChest }), 
    }
  )
);