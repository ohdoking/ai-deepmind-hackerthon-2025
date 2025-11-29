
import React from 'react';
import { CollectedCard } from '../types';

interface CardDetailModalProps {
  card: CollectedCard;
  onClose: () => void;
  onUseReward?: (cardId: string) => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose, onUseReward }) => {
  // Debug log to check props
  React.useEffect(() => {
    console.log('CardDetailModal mounted with props:', {
      hasReward: !!card.reward,
      reward: card.reward,
      hasOnUseReward: !!onUseReward,
      cardId: card.id
    });
  }, [card, onUseReward]);

  const handleUseReward = () => {
    console.log('Use reward button clicked for card:', card.id);
    if (onUseReward) {
      console.log('Calling onUseReward with card id:', card.id);
      onUseReward(card.id);
    } else {
      console.warn('onUseReward handler is not defined');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#8B5A2B] border-[8px] border-[#5D4037] p-2 max-w-lg w-full relative shadow-2xl rounded-sm">

        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 w-10 h-10 bg-[#C0392B] text-white font-pixel border-2 border-white rounded-full hover:bg-red-500 shadow-lg z-50 flex items-center justify-center"
        >
          X
        </button>

        <div className="bg-[#F4E4BC] p-4 border-2 border-[#C19A6B] flex flex-col gap-4">
          <h2 className="font-pixel text-center text-[#5D4037] text-lg border-b-2 border-[#8B5A2B] pb-2 uppercase">{card.title}</h2>

          <div className="aspect-[4/3] bg-[#3E2723] p-1 shadow-inner">
            <img 
              src={card.imageUrl} 
              alt={card.title} 
              className="w-full h-full object-cover border border-[#8B5A2B]" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M4%204H20V20H4V4ZM6%206V18H18V6H6Z%22%20fill%3D%22%23D3D3D3%22%2F%3E%3Cpath%20d%3D%22M8%208H16V13.5L12%2010.5L8%2013.5V8Z%22%20fill%3D%22%23A9A9A9%22%2F%3E%3C%2Fsvg%3E';
              }}
            />
          </div>

          <div className="text-center font-retro text-[#5D4037] text-lg">
            {card.type === 'bad' ? (
              <div className="space-y-3">
                <p className="text-red-600 font-bold text-xl">⚠️ LEARNING MOMENT ⚠️</p>
                {card.selectedAnswer && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 text-left">
                    <p className="font-bold">Your choice:</p>
                    <p className="italic">"{card.selectedAnswer}"</p>
                  </div>
                )}
                {card.explanation && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-left">
                    <p className="font-bold">Why it's important:</p>
                    <p>{card.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-green-600 font-bold text-xl">✨ GOOD CHOICE! ✨</p>
                {card.reward && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 text-left">
                    <p className="font-bold">Reward Obtained:</p>
                    <div className="flex items-center mt-1">
                      <span className="text-2xl mr-2">
                        {card.reward.type === 'ship' && '⛵'}
                        {card.reward.type === 'axe' && '🪓'}
                        {card.reward.type === 'magic_fire' && '🔥'}
                        {card.reward.type === 'heart' && '❤️'}
                        {card.reward.type === 'coin' && '🪙'}
                      </span>
                      <span className="capitalize">{card.reward.type.replace('_', ' ')}</span>
                      {card.reward.uses && <span className="ml-2 text-sm text-gray-600">(Uses: {card.reward.uses})</span>}
                    </div>
                    {card.reward.description && (
                      <p className="mt-2 text-sm italic">{card.reward.description}</p>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-700">"A memory from the village."</p>
              </div>
            )}
            <p className="text-sm mt-4 opacity-75">{new Date(card.timestamp).toLocaleString()}</p>
            
            {card.reward && onUseReward && (
              <div className="mt-4">
                <button
                  onClick={handleUseReward}
                  disabled={!card.reward || (card.reward.uses !== undefined && card.reward.uses <= 0)}
                  className={`px-6 py-2 font-pixel text-white rounded-sm border-2 border-white shadow-md
                    ${!card.reward || (card.reward.uses !== undefined && card.reward.uses <= 0) 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
                >
                  {card.reward.uses !== undefined && card.reward.uses <= 0 
                    ? 'No Uses Remaining' 
                    : `Use ${card.reward.type.replace('_', ' ')}`}
                </button>
                {card.reward.uses !== undefined && card.reward.uses > 0 && (
                  <p className="text-xs mt-1 text-gray-600">Uses left: {card.reward.uses}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
