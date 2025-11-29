
import React, { useEffect, useRef } from 'react';
import { CollectedCard } from '../types';

interface SidebarProps {
  collectedCards: CollectedCard[];
  remainingCount: number;
  onCardClick: (card: CollectedCard) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collectedCards, remainingCount, onCardClick }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [collectedCards.length]);

  return (
    <div className="w-80 h-full bg-[#5D4037] border-l-[6px] border-[#3E2723] flex flex-col relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)]">

      {/* Wooden Header */}
      <div className="p-6 bg-[#8B5A2B] border-b-[6px] border-[#3E2723] text-center shadow-md z-10 relative wooden-pattern">
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#3E2723] shadow-inner"></div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3E2723] shadow-inner"></div>
        <h2 className="font-pixel text-[#F4E4BC] text-lg tracking-widest drop-shadow-md">ADVENTURE LOG</h2>
        <div className="mt-2 bg-[#3E2723] text-[#F4E4BC] font-retro text-xl px-4 py-1 rounded inline-block shadow-inner">
          TASKS: <span className="text-[#FFCC80]">{remainingCount}</span>
        </div>
      </div>

      {/* Paper List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#F4E4BC] relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8B5A2B_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {collectedCards.length === 0 ? (
          <div className="text-center mt-10 opacity-50 flex flex-col items-center text-[#5D4037]">
            <span className="text-4xl mb-2">📜</span>
            <p className="font-pixel text-xs">NO ENTRIES YET</p>
          </div>
        ) : (
          collectedCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => onCardClick(card)}
              className={`relative bg-[#E8D5B5] border-2 ${card.type === 'bad' ? 'border-red-500' : 'border-[#8B5A2B]'} p-2 rounded cursor-pointer hover:bg-white hover:border-[#5D4037] hover:-translate-y-1 transition-all shadow-md group transform rotate-1 hover:rotate-0`}
            >
              {idx === 0 && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-pixel px-2 py-1 rounded-full animate-pulse z-10">NEW!</div>}

              <div className="flex gap-3">
                <div className={`w-14 h-14 bg-[#3E2723] shrink-0 border-2 ${card.type === 'bad' ? 'border-red-500' : 'border-[#8B5A2B]'} overflow-hidden rounded-sm`}>
                  <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="font-pixel text-[10px] text-[#5D4037] truncate uppercase">{card.title}</h3>
                  <p className="font-retro text-sm text-[#8B5A2B] mt-1">ENTRY #{card.id.slice(-3)}</p>
                  {card.type === 'bad' && <span className="text-[8px] text-red-600 font-bold uppercase">⚠️ WARNING CARD</span>}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#5D4037] border-t-[6px] border-[#3E2723] text-center wooden-pattern">
        <span className="text-[10px] text-[#C19A6B] font-pixel">JOURNAL v1.0</span>
      </div>
    </div>
  );
};

export default Sidebar;
