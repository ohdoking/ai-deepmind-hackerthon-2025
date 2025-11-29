
import React from 'react';
import { CollectedCard } from '../types';

interface CardDetailModalProps {
  card: CollectedCard;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
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
            <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover border border-[#8B5A2B]" />
          </div>

          <div className="text-center font-retro text-[#5D4037] text-xl">
            <p>"A memory from the village."</p>
            <p className="text-sm mt-2 opacity-75">{new Date(card.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
