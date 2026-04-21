// src/components/ui/Modals.tsx
import React, { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
const StoneBoardWrapper = ({
  title,
  onClose,
  children,
  bottomButtons,
}: {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  bottomButtons?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999, // Z-index cực cao để không bị game đè lên
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "320px",
          minHeight: "350px",
          background: "linear-gradient(to bottom, #8f939c, #5f636b)", // Màu xám đá
          borderRadius: "35px",
          border: "6px solid #4a4f58",
          boxShadow:
            "inset 0 0 15px rgba(0,0,0,0.5), 0 15px 30px rgba(0,0,0,0.8)",
          padding: "50px 25px 30px 25px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Nút X Đóng (Nếu có truyền hàm onClose mới hiện) */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              zIndex: 20,
              background: "linear-gradient(to bottom, #ef4444, #b91c1c)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              border: "3px solid white",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
              transition: "transform 0.1s",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.9)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            X
          </button>
        )}

        {/* Ruy-băng Tiêu đề (Màu vàng/cam) */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(to bottom, #fbbf24, #d97706)",
            padding: "12px 40px",
            borderRadius: "15px",
            color: "#713f12",
            fontWeight: "900",
            fontSize: "26px",
            fontFamily: '"Impact", sans-serif',
            boxShadow: "0 5px 10px rgba(0,0,0,0.4)",
            border: "3px solid #b45309",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          {title}
        </div>

        {/* Nội dung chính của từng Bảng */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
          }}
        >
          {children}
        </div>

        {/* Cụm nút tròn ở dưới cùng (như nút Setting/Shop ở đáy bảng Pause) */}
        {bottomButtons && (
          <div
            style={{
              position: "absolute",
              bottom: "-25px",
              left: "0",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {bottomButtons}
          </div>
        )}
      </div>
    </div>
  );
};
const darkPillBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "25px",
  background: "linear-gradient(to bottom, #4b5563, #374151)",
  border: "3px solid #1f2937",
  color: "white",
  fontFamily: '"Impact", sans-serif',
  fontSize: "22px",
  letterSpacing: "2px",
  cursor: "pointer",
  boxShadow:
    "inset 0 2px 4px rgba(255,255,255,0.2), 0 6px 10px rgba(0,0,0,0.5)",
  transition: "all 0.1s",
};
// Style dùng chung cho bảng đá (Stone Board) giống trong ảnh 2
const stoneBoardStyle: React.CSSProperties = {
  background: "linear-gradient(to bottom, #8f939c, #5f636b)", // Màu xám đá
  border: "10px solid #374151",
  borderRadius: "40px",
  width: "320px",
  padding: "40px 20px 20px 20px",
  position: "relative",
  boxShadow: "inset 0 0 20px rgba(0,0,0,0.5), 0px 15px 30px rgba(0,0,0,0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const titleRibbonStyle: React.CSSProperties = {
  position: "absolute",
  top: "-25px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "linear-gradient(to bottom, #fde047, #ca8a04)",
  padding: "10px 40px",
  borderRadius: "10px",
  color: "#713f12",
  fontWeight: "900",
  fontSize: "24px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
  border: "2px solid #a16207",
  whiteSpace: "nowrap",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "-15px",
  right: "-15px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#ef4444",
  color: "white",
  fontWeight: "bold",
  fontSize: "20px",
  border: "4px solid white",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
};

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { settings, toggleSetting } = useGameStore();

  const ToggleSwitch = ({
    label,
    settingKey,
  }: {
    label: string;
    settingKey: keyof typeof settings;
  }) => {
    const isActive = settings[settingKey];
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "15px",
        }}
      >
        <span
          style={{
            color: "white",
            fontFamily: '"Impact", sans-serif',
            fontSize: "22px",
            letterSpacing: "1px",
            textShadow: "2px 2px 0 #000",
          }}
        >
          {label}
        </span>
        <div
          onClick={() => toggleSetting(settingKey)}
          style={{
            width: "64px",
            height: "32px",
            borderRadius: "16px",
            background: "#374151",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8)",
            position: "relative",
            cursor: "pointer",
            border: "2px solid #1f2937",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1px",
              left: isActive ? "33px" : "1px",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              background: isActive
                ? "linear-gradient(to bottom, #fbbf24, #d97706)"
                : "linear-gradient(to bottom, #9ca3af, #4b5563)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <StoneBoardWrapper
      title="OPTIONS"
      onClose={onClose} // Bảng Option có nút X góc trên
      bottomButtons={
        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(to bottom, #f97316, #c2410c)",
            border: "4px solid #fff",
            padding: "10px 40px",
            borderRadius: "30px",
            color: "white",
            fontWeight: "900",
            fontSize: "22px",
            cursor: "pointer",
            boxShadow: "0 6px 10px rgba(0,0,0,0.5)",
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "translateY(4px)")
          }
          onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          OK
        </button>
      }
    >
      <div style={{ marginTop: "20px" }}>
        <ToggleSwitch label="MUSIC" settingKey="music" />
        <ToggleSwitch label="SOUND" settingKey="sfx" />
        <ToggleSwitch label="VIBRATIONS" settingKey="vibration" />
      </div>
    </StoneBoardWrapper>
  );
};

export const ShopModal = ({ onClose }: { onClose: () => void }) => {
  const { gold, inventory, buyItem } = useGameStore();

  const handleBuy = (item: "hammers" | "freeSwaps", cost: number) => {
    if (buyItem(item, cost)) alert(`Đã mua thành công!`);
    else alert("Bạn không đủ Vàng!");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>SHOP</div>
        <button onClick={onClose} style={closeBtnStyle}>
          X
        </button>
        <div
          style={{
            color: "#fbbf24",
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "20px",
            textShadow: "2px 2px 0 #000",
          }}
        >
          Vàng của bạn: {gold} 💰
        </div>

        {/* Item 1: Búa phá đá */}
        <div
          style={{
            background: "#374151",
            padding: "10px",
            borderRadius: "15px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <div style={{ color: "white" }}>
            <div style={{ fontWeight: "bold" }}>🔨 Búa đập đá</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              Đang có: {inventory.hammers}
            </div>
          </div>
          <button
            onClick={() => handleBuy("hammers", 200)}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            200 💰
          </button>
        </div>

        {/* Item 2: Đổi chỗ miễn phí */}
        <div
          style={{
            background: "#374151",
            padding: "10px",
            borderRadius: "15px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "white" }}>
            <div style={{ fontWeight: "bold" }}>🔄 Hoán đổi Free</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              Đang có: {inventory.freeSwaps}
            </div>
          </div>
          <button
            onClick={() => handleBuy("freeSwaps", 300)}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            300 💰
          </button>
        </div>
      </div>
    </div>
  );
};

export const DailyModal = ({ onClose }: { onClose: () => void }) => {
  const { lastDailyChest, claimDailyChest } = useGameStore();
  const [timeLeft, setTimeLeft] = useState("");
  const [canClaim, setCanClaim] = useState(false);

  // Logic đếm ngược 24 giờ
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const timePassed = now - lastDailyChest;
      const cooldown = 24 * 60 * 60 * 1000; // 24 tiếng

      if (timePassed >= cooldown) {
        setCanClaim(true);
        setTimeLeft("SẴN SÀNG!");
      } else {
        setCanClaim(false);
        const diff = new Date(cooldown - timePassed);
        setTimeLeft(
          `${diff.getUTCHours()}h ${diff.getUTCMinutes()}m ${diff.getUTCSeconds()}s`,
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastDailyChest]);

  const handleClaim = () => {
    if (canClaim) {
      claimDailyChest();
      alert("Bạn nhận được 500 Vàng!");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>DAILY GIFT</div>
        <button onClick={onClose} style={closeBtnStyle}>
          X
        </button>
        <div style={{ fontSize: "60px", margin: "20px 0" }}>🎁</div>
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "20px",
          }}
        >
          Thời gian chờ:{" "}
          <span style={{ color: canClaim ? "#22c55e" : "#fbbf24" }}>
            {timeLeft}
          </span>
        </div>
        <button
          onClick={handleClaim}
          disabled={!canClaim}
          style={{
            background: canClaim
              ? "linear-gradient(to bottom, #22c55e, #16a34a)"
              : "gray",
            color: "white",
            border: "none",
            padding: "15px 40px",
            borderRadius: "20px",
            fontWeight: "900",
            fontSize: "20px",
            cursor: canClaim ? "pointer" : "not-allowed",
            boxShadow: "0 5px 0 rgba(0,0,0,0.3)",
          }}
        >
          {canClaim ? "MỞ RƯƠNG" : "CHỜ ĐỢI..."}
        </button>
      </div>
    </div>
  );
};

export const PauseModal = ({
  onResume,
  onRestart,
  onQuit,
  onOpenSettings,
  onOpenShop,
}: any) => {
  // Component nhỏ cho nút Cam hình tròn
  const RoundOrangeBtn = ({ icon, onClick }: any) => (
    <button
      onClick={onClick}
      style={{
        background: "linear-gradient(to bottom, #f97316, #c2410c)",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        border: "4px solid #fff",
        color: "white",
        fontSize: "24px",
        cursor: "pointer",
        boxShadow: "0 6px 10px rgba(0,0,0,0.5)",
        transition: "transform 0.1s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(4px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {icon}
    </button>
  );

  return (
    <StoneBoardWrapper
      title="PAUSED"
      // Không truyền onClose vào đây vì trong ảnh của bạn bảng Pause không có nút X
      bottomButtons={
        <>
          <RoundOrangeBtn icon="⚙️" onClick={onOpenSettings} />
          <RoundOrangeBtn icon="🛒" onClick={onOpenShop} />
        </>
      }
    >
      <button
        style={darkPillBtnStyle}
        onClick={onResume}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        RESUME
      </button>
      <button
        style={darkPillBtnStyle}
        onClick={onRestart}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        RESTART
      </button>
      <button
        style={darkPillBtnStyle}
        onClick={onQuit}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        QUIT
      </button>
    </StoneBoardWrapper>
  );
};

export const SpinModal = ({ onClose }: { onClose: () => void }) => {
  const { spins, playSpin } = useGameStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultMsg, setResultMsg] = useState("NHẤN ĐỂ QUAY!");

  // Tính xem còn bao nhiêu lượt dựa trên time
  const now = Date.now();
  const actualSpins =
    now - spins.lastReset > 24 * 60 * 60 * 1000 ? 5 : spins.count;

  const handleSpin = () => {
    if (actualSpins <= 0 || isSpinning) return;

    setIsSpinning(true);
    setResultMsg("ĐANG QUAY...");

    // Hiệu ứng delay giả lập vòng quay chạy
    setTimeout(() => {
      const result = playSpin();
      if (result) {
        if (result.rewardType === "none") {
          setResultMsg("Ôi không! " + result.label);
        } else {
          setResultMsg("🎉 TRÚNG " + result.label + "!");
        }
      }
      setIsSpinning(false);
    }, 1500); // Quay trong 1.5 giây
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>LUCKY SPIN</div>
        <button onClick={onClose} style={closeBtnStyle} disabled={isSpinning}>
          X
        </button>

        <div
          style={{
            fontSize: "80px",
            margin: "10px 0",
            animation: isSpinning ? "spin 0.2s linear infinite" : "none",
          }}
        >
          🎡
        </div>

        <div
          style={{
            background: "#1f2937",
            padding: "15px",
            borderRadius: "15px",
            width: "100%",
            textAlign: "center",
            marginBottom: "20px",
            border: "2px solid #fbbf24",
          }}
        >
          <div
            style={{
              color: isSpinning ? "#fcd34d" : "#fbbf24",
              fontWeight: "bold",
              fontSize: "20px",
              minHeight: "30px",
            }}
          >
            {resultMsg}
          </div>
        </div>

        <div
          style={{ color: "white", fontWeight: "bold", marginBottom: "15px" }}
        >
          Lượt quay còn lại:{" "}
          <span
            style={{
              color: actualSpins > 0 ? "#22c55e" : "#ef4444",
              fontSize: "20px",
            }}
          >
            {actualSpins}/5
          </span>
        </div>

        <button
          onClick={handleSpin}
          disabled={actualSpins <= 0 || isSpinning}
          style={{
            background:
              actualSpins <= 0 || isSpinning
                ? "gray"
                : "linear-gradient(to bottom, #3b82f6, #1d4ed8)",
            color: "white",
            border: "none",
            padding: "15px 40px",
            borderRadius: "20px",
            fontWeight: "900",
            fontSize: "20px",
            cursor: actualSpins <= 0 || isSpinning ? "not-allowed" : "pointer",
            boxShadow: "0 5px 0 rgba(0,0,0,0.3)",
            width: "100%",
          }}
        >
          {actualSpins <= 0 ? "HẾT LƯỢT" : "QUAY NGAY"}
        </button>

        {/* Thêm CSS quay vòng tròn */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `,
          }}
        />
      </div>
    </div>
  );
};

export const NoAdsModal = ({ onClose }: { onClose: () => void }) => {
  const { hasNoAds, buyNoAds } = useGameStore();

  const handleBuy = () => {
    // Trong game thật, chỗ này sẽ gọi API thanh toán của Google/Apple
    buyNoAds();
    alert("Thanh toán thành công! Bạn đã loại bỏ hoàn toàn quảng cáo.");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>REMOVE ADS</div>
        <button onClick={onClose} style={closeBtnStyle}>
          X
        </button>

        <div style={{ fontSize: "60px", margin: "20px 0" }}>🚫📺</div>
        <div
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          {hasNoAds
            ? "Bạn đã sở hữu gói Không Quảng Cáo!"
            : "Tận hưởng game mượt mà, không bị làm phiền!"}
        </div>

        {!hasNoAds && (
          <button
            onClick={handleBuy}
            style={{
              background: "linear-gradient(to bottom, #3b82f6, #1d4ed8)",
              color: "white",
              border: "none",
              padding: "15px 40px",
              borderRadius: "20px",
              fontWeight: "900",
              fontSize: "20px",
              cursor: "pointer",
              boxShadow: "0 5px 0 rgba(0,0,0,0.3)",
              width: "100%",
            }}
          >
            MUA CHỈ VỚI 49.000đ
          </button>
        )}
      </div>
    </div>
  );
};

export const TimeChestModal = ({ onClose }: { onClose: () => void }) => {
  const { lastTimeChest, claimTimeChest } = useGameStore();
  const [timeLeft, setTimeLeft] = useState("");
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const timePassed = Date.now() - lastTimeChest;
      const cooldown = 15 * 60 * 1000; // 15 phút

      if (timePassed >= cooldown) {
        setCanClaim(true);
        setTimeLeft("SẴN SÀNG!");
      } else {
        setCanClaim(false);
        const diff = new Date(cooldown - timePassed);
        setTimeLeft(`${diff.getUTCMinutes()}m ${diff.getUTCSeconds()}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastTimeChest]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>MINI GIFT</div>
        <button onClick={onClose} style={closeBtnStyle}>
          X
        </button>
        <div style={{ fontSize: "60px", margin: "20px 0" }}>📦</div>
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "20px",
          }}
        >
          Chờ đợi:{" "}
          <span style={{ color: canClaim ? "#22c55e" : "#fbbf24" }}>
            {timeLeft}
          </span>
        </div>
        <button
          onClick={() => {
            if (canClaim) {
              claimTimeChest();
              alert("Bạn nhận được 50 Vàng!");
            }
          }}
          disabled={!canClaim}
          style={{
            background: canClaim
              ? "linear-gradient(to bottom, #22c55e, #16a34a)"
              : "gray",
            color: "white",
            border: "none",
            padding: "15px 40px",
            borderRadius: "20px",
            fontWeight: "900",
            fontSize: "20px",
            cursor: canClaim ? "pointer" : "not-allowed",
            boxShadow: "0 5px 0 rgba(0,0,0,0.3)",
            width: "100%",
          }}
        >
          {canClaim ? "MỞ (50 VÀNG)" : "ĐANG KHÓA"}
        </button>
      </div>
    </div>
  );
};
