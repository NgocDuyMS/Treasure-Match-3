// src/components/ui/Modals.tsx
import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

// Style dùng chung cho bảng đá (Stone Board) giống trong ảnh 2
const stoneBoardStyle: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #8f939c, #5f636b)', // Màu xám đá
  border: '10px solid #374151',
  borderRadius: '40px',
  width: '320px',
  padding: '40px 20px 20px 20px',
  position: 'relative',
  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0px 15px 30px rgba(0,0,0,0.8)',
  display: 'flex', flexDirection: 'column', alignItems: 'center'
};

const titleRibbonStyle: React.CSSProperties = {
  position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
  background: 'linear-gradient(to bottom, #fde047, #ca8a04)',
  padding: '10px 40px', borderRadius: '10px',
  color: '#713f12', fontWeight: '900', fontSize: '24px',
  boxShadow: '0 5px 10px rgba(0,0,0,0.3)', border: '2px solid #a16207',
  whiteSpace: 'nowrap'
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute', top: '-15px', right: '-15px',
  width: '40px', height: '40px', borderRadius: '50%',
  background: '#ef4444', color: 'white', fontWeight: 'bold', fontSize: '20px',
  border: '4px solid white', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
};

// --- BẢNG CÀI ĐẶT (SETTINGS) ---
export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { settings, toggleSetting } = useGameStore();

  const renderToggle = (label: string, key: keyof typeof settings) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'center' }}>
      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', textShadow: '2px 2px 0 #000' }}>{label}</span>
      <button 
        onClick={() => toggleSetting(key)}
        style={{
          width: '60px', height: '30px', borderRadius: '15px', position: 'relative', cursor: 'pointer',
          background: settings[key] ? '#22c55e' : '#4b5563', border: '3px solid #1f2937', transition: 'all 0.2s'
        }}
      >
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(to bottom, #fde047, #eab308)',
          position: 'absolute', top: '0', left: settings[key] ? '30px' : '0', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>OPTIONS</div>
        <button onClick={onClose} style={closeBtnStyle}>X</button>
        <div style={{ width: '100%', marginTop: '20px' }}>
          {renderToggle('MUSIC', 'music')}
          {renderToggle('SOUND', 'sfx')}
          {renderToggle('VIBRATIONS', 'vibration')}
        </div>
      </div>
    </div>
  );
};

// --- BẢNG CỬA HÀNG (SHOP) ---
export const ShopModal = ({ onClose }: { onClose: () => void }) => {
  const { gold, inventory, buyItem } = useGameStore();

  const handleBuy = (item: 'hammers' | 'freeSwaps', cost: number) => {
    if (buyItem(item, cost)) alert(`Đã mua thành công!`);
    else alert("Bạn không đủ Vàng!");
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>SHOP</div>
        <button onClick={onClose} style={closeBtnStyle}>X</button>
        <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px', textShadow: '2px 2px 0 #000' }}>
          Vàng của bạn: {gold} 💰
        </div>
        
        {/* Item 1: Búa phá đá */}
        <div style={{ background: '#374151', padding: '10px', borderRadius: '15px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontWeight: 'bold' }}>🔨 Búa đập đá</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Đang có: {inventory.hammers}</div>
          </div>
          <button onClick={() => handleBuy('hammers', 200)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>200 💰</button>
        </div>

        {/* Item 2: Đổi chỗ miễn phí */}
        <div style={{ background: '#374151', padding: '10px', borderRadius: '15px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontWeight: 'bold' }}>🔄 Hoán đổi Free</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Đang có: {inventory.freeSwaps}</div>
          </div>
          <button onClick={() => handleBuy('freeSwaps', 300)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>300 💰</button>
        </div>
      </div>
    </div>
  );
};

// --- BẢNG RƯƠNG HÀNG NGÀY ---
export const DailyModal = ({ onClose }: { onClose: () => void }) => {
  const { lastDailyChest, claimDailyChest } = useGameStore();
  const [timeLeft, setTimeLeft] = useState('');
  const [canClaim, setCanClaim] = useState(false);

  // Logic đếm ngược 24 giờ
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const timePassed = now - lastDailyChest;
      const cooldown = 24 * 60 * 60 * 1000; // 24 tiếng

      if (timePassed >= cooldown) {
        setCanClaim(true);
        setTimeLeft('SẴN SÀNG!');
      } else {
        setCanClaim(false);
        const diff = new Date(cooldown - timePassed);
        setTimeLeft(`${diff.getUTCHours()}h ${diff.getUTCMinutes()}m ${diff.getUTCSeconds()}s`);
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>DAILY GIFT</div>
        <button onClick={onClose} style={closeBtnStyle}>X</button>
        <div style={{ fontSize: '60px', margin: '20px 0' }}>🎁</div>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>
          Thời gian chờ: <span style={{ color: canClaim ? '#22c55e' : '#fbbf24' }}>{timeLeft}</span>
        </div>
        <button 
          onClick={handleClaim}
          disabled={!canClaim}
          style={{ 
            background: canClaim ? 'linear-gradient(to bottom, #22c55e, #16a34a)' : 'gray', 
            color: 'white', border: 'none', padding: '15px 40px', borderRadius: '20px', 
            fontWeight: '900', fontSize: '20px', cursor: canClaim ? 'pointer' : 'not-allowed',
            boxShadow: '0 5px 0 rgba(0,0,0,0.3)'
          }}
        >
          {canClaim ? 'MỞ RƯƠNG' : 'CHỜ ĐỢI...'}
        </button>
      </div>
    </div>
  );
};


export const PauseModal = ({ 
  onResume, 
  onRestart, 
  onQuit 
}: { 
  onResume: () => void, 
  onRestart: () => void, 
  onQuit: () => void 
}) => {
  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '12px', marginBottom: '15px',
    borderRadius: '20px', border: 'none', color: 'white',
    fontWeight: '900', fontSize: '18px', cursor: 'pointer',
    boxShadow: '0 5px 0 rgba(0,0,0,0.3)', transition: 'transform 0.1s'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={stoneBoardStyle}>
        <div style={titleRibbonStyle}>PAUSED</div>
        
        <div style={{ width: '100%', marginTop: '30px' }}>
          {/* Nút Tiếp tục */}
          <button 
            onClick={onResume} 
            style={{ ...btnStyle, background: 'linear-gradient(to bottom, #4b5563, #1f2937)' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(3px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >RESUME</button>

          {/* Nút Chơi lại */}
          <button 
            onClick={onRestart} 
            style={{ ...btnStyle, background: 'linear-gradient(to bottom, #4b5563, #1f2937)' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(3px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >RESTART</button>

          {/* Nút Thoát */}
          <button 
            onClick={onQuit} 
            style={{ ...btnStyle, background: 'linear-gradient(to bottom, #ef4444, #b91c1c)' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(3px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >QUIT</button>
        </div>

        {/* Hai icon nhỏ ở dưới cùng: Settings và Shop */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <div style={{ cursor: 'pointer' }}>⚙️</div>
            <div style={{ cursor: 'pointer' }}>🛒</div>
        </div>
      </div>
    </div>
  );
};