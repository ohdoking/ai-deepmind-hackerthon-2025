
import React from 'react';
import { CollectedCard } from '../types';

interface CardDetailModalProps {
  card: CollectedCard;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#2C1E1A] border-[6px] border-mucha-gold shadow-[0_0_0_4px_#2C1E1A] p-2 max-w-2xl w-full relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-6 -right-6 w-12 h-12 bg-red-600 text-white font-pixel border-4 border-white rounded-full hover:bg-red-500 hover:scale-110 transition-transform shadow-lg z-50 flex items-center justify-center"
        >
          X
        </button>

        <div className="flex flex-col md:flex-row gap-4 bg-[#3E2723] p-4 border-2 border-[#8B5A2B]">
          
          {/* Left: Image */}
          <div className="flex-1 aspect-[4/3] bg-black border-4 border-mucha-gold relative group overflow-hidden shadow-inner">
            <img 
              src={card.imageUrl} 
              alt={card.title} 
              className="w-full h-full object-cover" 
            />
            {/* Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Right: Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-2xl">🌟</span>
                 <h2 className="font-pixel text-xl text-mucha-gold leading-relaxed">{card.title}</h2>
              </div>
              
              <div className="w-full h-1 bg-[#8B5A2B] mb-4"></div>

              <div className="font-retro text-[#F5E6CA] text-xl space-y-2">
                <p><span className="text-[#8B5A2B]">ID:</span> #{card.id.slice(-4)}</p>
                <p><span className="text-[#8B5A2B]">DATE:</span> {new Date(card.timestamp).toLocaleDateString()}</p>
                <p><span className="text-[#8B5A2B]">STATUS:</span> <span className="text-green-400">COLLECTED</span></p>
              </div>
            </div>

            <div className="mt-6 p-3 bg-black/30 border border-[#8B5A2B] rounded">
              <p className="font-pixel text-[10px] text-center text-stone-400">
                "Safety First, Adventure Second."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
