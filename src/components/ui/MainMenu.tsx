// src/components/ui/MainMenu.tsx
import React, { useState } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/gameStore";
import {
  SettingsModal,
  ShopModal,
  DailyModal,
  SpinModal,
  NoAdsModal,
  TimeChestModal,
} from "./Modals";

export default function MainMenu() {
  const { setScreen, gold, hasNoAds, lastTimeChest } = useGameStore();
  const [activeModal, setActiveModal] = useState<
    "NONE" | "SETTINGS" | "SHOP" | "DAILY" | "SPIN" | "NO_ADS" | "TIME_CHEST"
  >("NONE");
  const cleanBtnStyle: React.CSSProperties = {
    background: "transparent",
    backgroundColor: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    outline: "none",
    WebkitAppearance: "none",
    appearance: "none",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s",
  };
  const closeModal = () => setActiveModal("NONE");
  const [timeChestStr, setTimeChestStr] = React.useState("15:00");

  React.useEffect(() => {
    const timer = setInterval(() => {
      const timePassed = Date.now() - lastTimeChest;
      const cooldown = 15 * 60 * 1000;
      if (timePassed >= cooldown) setTimeChestStr("READY");
      else {
        const diff = new Date(cooldown - timePassed);
        setTimeChestStr(
          `${diff.getUTCMinutes()}:${diff.getUTCSeconds().toString().padStart(2, "0")}`,
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastTimeChest]);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 1. LỚP BACKGROUND */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <Image
          src="/assets/ui/Background.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* FIX #4: BACKDROP — click ra ngoài modal để đóng */}
      {activeModal !== "NONE" && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* 2. TOP BAR (Profile - Shop - Settings) */}
      {/* FIX #1: Bỏ onClick khỏi div bao ngoài, chuyển vào đúng từng button */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 10,
        }}
      >
        {/* Góc trái: Profile — không mở modal, chỉ hover effect : nút profile */}
        <button
          style={cleanBtnStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src="/assets/ui/profile.png"
            alt="Profile"
            width={80}
            height={80}
            style={{ objectFit: "contain", background: "transparent" }}
          />
        </button>

        {/* Ở giữa: Shop & Vàng */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {/* FIX #1: onClick đặt đúng vào button Shop */}
          <button
            // nút shop sẽ mở modal shop, không phải cả vùng hiển thị vàng, tránh nhầm lẫn khi người dùng muốn click vào vàng để xem số dư mà lại mở shop
            onClick={() => setActiveModal("SHOP")}
            style={cleanBtnStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image
              src="/assets/ui/shop-icon.png"
              alt="Shop"
              width={70}
              height={70}
              style={{ objectFit: "contain", background: "transparent" }}
            />
          </button>

          {/* Thanh hiển thị Vàng */}
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "2px solid #fbbf24",
              borderRadius: "20px",
              padding: "4px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <Image
              src="/assets/ui/coin.png"
              alt="Coin"
              width={20}
              height={20}
              style={{ background: "transparent" }}
            />
            <span>{gold}</span>
          </div>
        </div>

        {/* Góc phải: Settings */}
        {/* FIX #3: onClick + onMouseOut đồng thời reset transform để tránh kẹt rotate */}
        <button
          // nút setting
          onClick={() => setActiveModal("SETTINGS")}
          style={cleanBtnStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "rotate(90deg)")
          }
          onMouseOut={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
        >
          <Image
            src="/assets/ui/settings-icon.png"
            alt="Settings"
            width={60}
            height={60}
            style={{ objectFit: "contain", background: "transparent" }}
          />
        </button>
      </div>

      {/* 3. LEFT PANEL (No Ads, Time Chest) */}
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "45%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          zIndex: 10,
        }}
      >
        {!hasNoAds && (
          <button
            onClick={() => setActiveModal("NO_ADS")}
            style={cleanBtnStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image
              src="/assets/ui/no-ads.png"
              alt="No Ads"
              width={70}
              height={70}
              style={{ objectFit: "contain" }}
            />
          </button>
        )}

        <button
          onClick={() => setActiveModal("TIME_CHEST")}
          style={cleanBtnStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src="/assets/ui/GoldenChess.png"
            alt="Time Chest"
            width={70}
            height={70}
            style={{ objectFit: "contain" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "-15px",
              backgroundColor: timeChestStr === "READY" ? "#16a34a" : "#ea580c", // Nếu Ready thì màu xanh
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              padding: "2px 6px",
              borderRadius: "5px",
              border: "1px solid #fdba74",
            }}
          >
            {timeChestStr}
          </span>
        </button>
      </div>

      {/* 4. RIGHT PANEL (Lucky Spin, Daily Chest) */}
      <div
        style={{
          position: "absolute",
          right: "20px",
          top: "45%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setActiveModal("SPIN")}
          style={cleanBtnStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src="/assets/ui/lucky-spin.png"
            alt="Lucky Spin"
            width={70}
            height={70}
            style={{ objectFit: "contain", background: "transparent" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "-15px",
              backgroundColor: "#ea580c",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              padding: "2px 6px",
              borderRadius: "5px",
              border: "1px solid #fdba74",
            }}
          >
            {useGameStore((state) => state.spins.count)}/5
          </span>
        </button>

        {/* FIX #2: onClick chuyển lên button thay vì span FREE */}
        <button
          onClick={() => setActiveModal("DAILY")}
          style={cleanBtnStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src="/assets/ui/daily-chess.png"
            alt="Daily Chest"
            width={70}
            height={70}
            style={{ objectFit: "contain", background: "transparent" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "-15px",
              backgroundColor: "#16a34a",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              padding: "2px 6px",
              borderRadius: "5px",
              border: "1px solid #86efac",
            }}
          >
            FREE
          </span>
        </button>
      </div>

      {/* 5. CENTER — Nút Play */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setScreen("PLAY")}
          style={{ ...cleanBtnStyle, animation: "heartbeat 2s infinite" }}
        >
          <Image
            src="/assets/ui/play-btn.png"
            alt="Play Game"
            width={220}
            height={100}
            style={{ objectFit: "contain", background: "transparent" }}
          />
        </button>
      </div>

      {/* CSS Animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes heartbeat {
          0%  { transform: scale(1); }
          15% { transform: scale(1.08); filter: brightness(1.1); }
          30% { transform: scale(1); }
          45% { transform: scale(1.08); filter: brightness(1.1); }
          60% { transform: scale(1); }
          100%{ transform: scale(1); }
        }
        img {
          background: transparent !important;
        }
      `,
        }}
      />

      {/* FIX #5: zIndex modal phải cao hơn backdrop (50) và cao hơn mọi panel (10) */}
      {activeModal === "SETTINGS" && <SettingsModal onClose={closeModal} />}
      {activeModal === "SHOP" && <ShopModal onClose={closeModal} />}
      {activeModal === "DAILY" && <DailyModal onClose={closeModal} />}
      {activeModal === "SPIN" && (
        <SpinModal onClose={() => setActiveModal("NONE")} />
      )}
      {activeModal === "NO_ADS" && (
        <NoAdsModal onClose={() => setActiveModal("NONE")} />
      )}
      {activeModal === "TIME_CHEST" && (
        <TimeChestModal onClose={() => setActiveModal("NONE")} />
      )}
    </div>
  );
}
