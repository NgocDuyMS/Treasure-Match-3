// src/store/gameStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ScreenState = "MENU" | "PLAY";

interface GameState {
  currentScreen: ScreenState;
  gold: number;
  isPaused: boolean;
  settings: { music: boolean; sfx: boolean; vibration: boolean };
  inventory: { hammers: number; freeSwaps: number };
  lastDailyChest: number;
  spins: { count: number; lastReset: number };
  hasNoAds: boolean; // MỚI: Trạng thái đã mua No Ads
  lastTimeChest: number;

  buyNoAds: () => void; // MỚI: Hàm mua No Ads
  claimTimeChest: () => boolean;
  setScreen: (screen: ScreenState) => void;
  setPaused: (paused: boolean) => void;
  addGold: (amount: number) => void;
  toggleSetting: (key: keyof GameState["settings"]) => void;
  buyItem: (item: keyof GameState["inventory"], cost: number) => boolean;
  claimDailyChest: () => boolean;

  // MỚI: Hàm thực hiện quay thưởng
  playSpin: () => { rewardType: string; amount: number; label: string } | null;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: "MENU",
      gold: 1000,
      isPaused: false,
      settings: { music: true, sfx: true, vibration: true },
      inventory: { hammers: 0, freeSwaps: 0 },
      lastDailyChest: 0,
      spins: { count: 5, lastReset: 0 }, // Bắt đầu với 5 lượt quay
      hasNoAds: false, // Mặc định chưa mua
      lastTimeChest: 0,

      buyNoAds: () => set({ hasNoAds: true }),
      setScreen: (screen) => set({ currentScreen: screen, isPaused: false }),
      setPaused: (paused) => set({ isPaused: paused }),
      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      toggleSetting: (key) =>
        set((state) => ({
          settings: { ...state.settings, [key]: !state.settings[key] },
        })),

      buyItem: (item, cost) => {
        const { gold, inventory } = get();
        if (gold >= cost) {
          set({
            gold: gold - cost,
            inventory: { ...inventory, [item]: inventory[item] + 1 },
          });
          return true;
        }
        return false;
      },
      claimTimeChest: () => {
        set((state) => ({
          gold: state.gold + 50, // Rương nhỏ cho 50 vàng
          lastTimeChest: Date.now(),
        }));
        return true;
      },
      claimDailyChest: () => {
        set((state) => ({
          gold: state.gold + 500,
          lastDailyChest: Date.now(),
        }));
        return true;
      },

      // LOGIC VÒNG QUAY MAY MẮN
      playSpin: () => {
        const { spins, gold, inventory } = get();
        const now = Date.now();

        let currentSpins = spins.count;
        let lastReset = spins.lastReset;

        // Nếu đã qua 24h kể từ lần reset cuối, hồi lại 5 lượt quay
        if (now - lastReset > 24 * 60 * 60 * 1000) {
          currentSpins = 5;
          lastReset = now;
        }

        if (currentSpins <= 0) return null; // Hết lượt

        // Danh sách phần thưởng và Tỉ lệ trúng
        const rewards = [
          { type: "gold", amount: 50, label: "50 VÀNG", weight: 40 }, // 40%
          { type: "gold", amount: 200, label: "200 VÀNG", weight: 20 }, // 20%
          { type: "hammer", amount: 1, label: "1 BÚA", weight: 15 }, // 15%
          { type: "freeSwaps", amount: 1, label: "1 ĐỔI CHỖ", weight: 15 }, // 15%
          { type: "none", amount: 0, label: "CHÚC MAY MẮN", weight: 10 }, // 10%
        ];

        // Thuật toán quay Random theo tỉ lệ (Weighted Random)
        const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
        let randomNum = Math.random() * totalWeight;
        let selectedReward = rewards[0];

        for (const reward of rewards) {
          if (randomNum < reward.weight) {
            selectedReward = reward;
            break;
          }
          randomNum -= reward.weight;
        }

        // Cấp phát phần thưởng
        let newGold = gold;
        const newInv = { ...inventory };

        if (selectedReward.type === "gold") newGold += selectedReward.amount;
        if (selectedReward.type === "hammer")
          newInv.hammers += selectedReward.amount;
        if (selectedReward.type === "freeSwaps")
          newInv.freeSwaps += selectedReward.amount;

        set({
          gold: newGold,
          inventory: newInv,
          spins: { count: currentSpins - 1, lastReset },
        });

        return {
          rewardType: selectedReward.type,
          amount: selectedReward.amount,
          label: selectedReward.label,
        };
      },
    }),
    {
      name: "treasure-match-storage",
      partialize: (state) => ({
        gold: state.gold,
        settings: state.settings,
        inventory: state.inventory,
        lastDailyChest: state.lastDailyChest,
        spins: state.spins, // Nhớ lưu cả số lượt quay
      }),
    },
  ),
);
