
import React from 'react';

interface RewardCardProps {
  imageUrl: string;
  result: 'success' | 'fail';
  onCollect: () => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ imageUrl, result, onCollect }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-mucha-cream border-4 border-mucha-gold p-2 shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-fade-in relative overflow-hidden">
        
        {/* Holographic Sheen Animation */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 animate-shimmer"></div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateX(100%) translateY(100%); opacity: 0; }
          }
          .animate-shimmer {
            animation: shimmer 2.5s infinite;
          }
        `}</style>
        
        {/* Card Header */}
        <div className="text-center font-retro text-4xl text-[#3E2723] mb-4 border-b-2 border-mucha-gold pb-2 uppercase tracking-widest relative z-20">
          {result === 'success' ? 'Harmony Achieved' : 'Lesson Learned'}
        </div>

        {/* The Art */}
        <div className="w-full aspect-[3/4] bg-[#333] border-2 border-[#3E2723] mb-4 relative overflow-hidden group z-20">
          <img 
            src={imageUrl} 
            alt="Result Card" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
          <div className="absolute inset-0 ring-inset ring-8 ring-mucha-gold/20 pointer-events-none"></div>
          
          {/* Shiny overlay on image specifically */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none mix-blend-overlay"></div>
        </div>

        {/* Decorative Text */}
        <p className="font-serif italic text-center text-[#5D4037] mb-6 text-lg relative z-20">
          {result === 'success' 
            ? "A bond of trust is built on safety and respect." 
            : "Caution is the guardian of safety."}
        </p>

        {/* Action */}
        <button
          onClick={onCollect}
          className="w-full py-4 bg-mucha-gold text-[#3E2723] font-pixel text-sm uppercase hover:bg-yellow-500 transition-colors border-t-2 border-[#3E2723] relative z-20 shadow-md active:translate-y-1"
        >
          Collect Card & Continue
        </button>

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-mucha-gold z-20"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-mucha-gold z-20"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-mucha-gold z-20"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-mucha-gold z-20"></div>

      </div>
    </div>
  );
};

export default RewardCard;
