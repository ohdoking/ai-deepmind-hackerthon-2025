
import React from 'react';
import { CollectedCard } from '../types';

interface SidebarProps {
  collectedCards: CollectedCard[];
  remainingCount: number;
  onCardClick: (card: CollectedCard) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collectedCards, remainingCount, onCardClick }) => {
  return (
    <div className="w-80 h-full bg-[#222] border-l-4 border-stone-700 flex flex-col overflow-hidden shadow-2xl relative">
      
      {/* 16-bit Header */}
      <div className="p-4 bg-blue-900 border-b-4 border-blue-700 shadow-md z-10">
        <h2 className="font-pixel text-yellow-400 text-sm mb-1 text-center tracking-widest drop-shadow-md">INVENTORY</h2>
        <div className="flex justify-between font-retro text-white text-lg px-2 mt-2 bg-blue-950/50 rounded border border-blue-500/30">
           <span>TARGETS:</span>
           <span className="text-red-400">{remainingCount}</span>
        </div>
      </div>

      {/* Collection List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-stone-900">
        {collectedCards.length === 0 ? (
          <div className="text-center mt-10 opacity-50 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-stone-700 rounded-lg flex items-center justify-center mb-2 bg-stone-800">
               <span className="text-2xl grayscale">🔒</span>
            </div>
            <p className="font-pixel text-[10px] text-stone-500">EMPTY SLOT</p>
          </div>
        ) : (
          collectedCards.map((card) => (
            <div 
              key={card.id} 
              onClick={() => onCardClick(card)}
              className="relative bg-stone-800 border-2 border-stone-600 p-2 rounded cursor-pointer hover:bg-stone-700 hover:border-yellow-500 hover:-translate-y-1 transition-all group shadow-lg"
            >
              <div className="flex gap-3">
                <div className="w-16 h-12 bg-black shrink-0 border border-stone-500 overflow-hidden">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="font-pixel text-[10px] text-yellow-500 truncate">{card.title}</h3>
                  <p className="font-mono text-[9px] text-stone-400 mt-1">
                    ITEM #{card.id.slice(-3)}
                  </p>
                </div>
              </div>
              {/* Selection Indicator */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-yellow-400 font-bold text-xs">
                ▶
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Decoration */}
      <div className="p-2 bg-stone-800 border-t-4 border-stone-600">
        <div className="flex justify-center gap-4 text-[8px] text-stone-500 font-pixel">
          <span>PRESS E TO SELECT</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
