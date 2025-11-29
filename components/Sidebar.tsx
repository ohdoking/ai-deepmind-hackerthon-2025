
import React, { useEffect, useRef, useMemo } from 'react';
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

  // Separate cards into good and bad choices
  const { goodChoices, badChoices } = useMemo(() => {
    return collectedCards.reduce((acc, card) => {
      if (card.type === 'good') {
        acc.goodChoices.push(card);
      } else {
        acc.badChoices.push(card);
      }
      return acc;
    }, { goodChoices: [] as CollectedCard[], badChoices: [] as CollectedCard[] });
  }, [collectedCards]);

  const renderCard = (card: CollectedCard, isNew: boolean) => (
    <div
      key={card.id}
      onClick={() => onCardClick(card)}
      className={`relative bg-[#E8D5B5] border-2 ${card.type === 'bad' ? 'border-red-500' : 'border-[#8B5A2B]'} p-2 rounded cursor-pointer hover:bg-white hover:border-[#5D4037] hover:-translate-y-1 transition-all shadow-md group transform rotate-1 hover:rotate-0`}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-pixel px-2 py-1 rounded-full animate-pulse z-10">
          NEW!
        </div>
      )}
      <div className="flex gap-3">
        <div className={`w-14 h-14 bg-[#3E2723] shrink-0 border-2 ${card.type === 'bad' ? 'border-red-500' : 'border-[#8B5A2B]'} overflow-hidden rounded-sm`}>
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M4%204H20V20H4V4ZM6%206V18H18V6H6Z%22%20fill%3D%22%23D3D3D3%22%2F%3E%3Cpath%20d%3D%22M8%208H16V13.5L12%2010.5L8%2013.5V8Z%22%20fill%3D%22%23A9A9A9%22%2F%3E%3C%2Fsvg%3E';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xs">
              {card.type === 'bad' ? '⚠️' : '✅'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-pixel text-sm font-bold text-[#3E2723] truncate">
            {card.title || `Card #${card.id.slice(-4)}`}
          </h3>
          <p className="text-xs text-[#5D4037] opacity-80 line-clamp-2">
            {card.description || (card.type === 'bad' ? 'Learning moment' : 'Good choice!')}
          </p>
          <div className="text-[10px] text-[#8B5A2B] mt-1">
            {new Date(card.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-80 h-full bg-[#5D4037] border-l-[6px] border-[#3E2723] flex flex-col relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)]">
      {/* Wooden Header */}
      <div className="p-4 bg-[#8B5A2B] border-b-[6px] border-[#3E2723] text-center shadow-md z-10 relative wooden-pattern">
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#3E2723] shadow-inner"></div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3E2723] shadow-inner"></div>
        <h2 className="font-pixel text-[#F4E4BC] text-lg tracking-widest drop-shadow-md">CARD COLLECTION</h2>
        <div className="mt-1 bg-[#3E2723] text-[#F4E4BC] font-retro text-lg px-3 py-1 rounded inline-block shadow-inner">
          TASKS LEFT: <span className="text-[#FFCC80]">{remainingCount}</span>
        </div>
      </div>

      {/* Paper List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[#F4E4BC] relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8B5A2B_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {collectedCards.length === 0 ? (
          <div className="text-center mt-10 opacity-50 flex flex-col items-center text-[#5D4037]">
            <span className="text-4xl mb-2">📜</span>
            <p className="font-pixel text-xs">NO CARDS COLLECTED YET</p>
          </div>
        ) : (
          <>
            {/* Good Choices Section */}
            {goodChoices.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <h3 className="font-pixel text-sm font-bold text-[#3E2723]">GOOD CHOICES</h3>
                  <div className="flex-1 h-px bg-[#8B5A2B] opacity-30 ml-2"></div>
                  <span className="text-xs text-[#5D4037] bg-[#E8D5B5] px-2 py-0.5 rounded-full">
                    {goodChoices.length} {goodChoices.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>
                <div className="space-y-3 pl-2 border-l-2 border-green-500 border-opacity-30">
                  {goodChoices.map((card, idx) => 
                    renderCard(card, idx === 0 && card.id === collectedCards[0]?.id)
                  )}
                </div>
              </div>
            )}

            {/* Bad Choices Section */}
            {badChoices.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <h3 className="font-pixel text-sm font-bold text-[#3E2723]">LEARNING MOMENTS</h3>
                  <div className="flex-1 h-px bg-[#8B5A2B] opacity-30 ml-2"></div>
                  <span className="text-xs text-[#5D4037] bg-[#E8D5B5] px-2 py-0.5 rounded-full">
                    {badChoices.length} {badChoices.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>
                <div className="space-y-3 pl-2 border-l-2 border-red-500 border-opacity-30">
                  {badChoices.map((card, idx) => 
                    renderCard(card, idx === 0 && card.id === collectedCards[0]?.id)
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={endRef} />
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#5D4037] border-t-[6px] border-[#3E2723] text-center wooden-pattern">
        <span className="text-[10px] text-[#C19A6B] font-pixel">SAFEGUARD CARD COLLECTION v1.0</span>
      </div>
    </div>
  );
};

export default Sidebar;
