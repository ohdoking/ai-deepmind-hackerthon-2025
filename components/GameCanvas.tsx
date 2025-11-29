
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { GameScenario, ScenarioOption } from '../types';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, INITIAL_PLAYER_POS, SPRITES, OBSTACLES_SET, TERRAIN_MAP, PALETTE } from '../constants';

interface GameCanvasProps {
  scenarios: GameScenario[];
  completedIds: Set<string>;
  score: number;
  onFinish: (result: 'success' | 'fail', cardPrompt: string, scenario: GameScenario) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ scenarios, completedIds, score, onFinish }) => {
  const [playerPos, setPlayerPos] = useState(INITIAL_PLAYER_POS);
  const [activeScenario, setActiveScenario] = useState<GameScenario | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [playerDirection, setPlayerDirection] = useState<'left' | 'right'>('right');
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  
  // HUD Animation states
  const [coins, setCoins] = useState(10);
  const [lives, setLives] = useState(3);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- BACKGROUND GENERATION (Canvas for performance) ---
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random coins for decoration
  const decoCoins = useMemo(() => {
    const coinsArr = [];
    for(let i=0; i<30; i++) {
        const x = Math.floor(Math.random() * MAP_WIDTH);
        const y = Math.floor(Math.random() * MAP_HEIGHT);
        if(!OBSTACLES_SET.has(`${x},${y},tree`) && !OBSTACLES_SET.has(`${x},${y},building`)) {
            coinsArr.push({x, y, id: i});
        }
    }
    return coinsArr;
  }, []);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Map Terrain with 16-bit Checkerboard Texture
    for (let x = 0; x < MAP_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const type = TERRAIN_MAP[x][y];
        
        if (type === 'pavement') {
          // City Checkerboard
          ctx.fillStyle = (x + y) % 2 === 0 ? PALETTE.PAVE_LIGHT : PALETTE.PAVE_DARK; 
        } else {
          // Nature Checkerboard
          ctx.fillStyle = (x + y) % 2 === 0 ? PALETTE.GRASS_LIGHT : PALETTE.GRASS_DARK;
        }
        
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        
        // Add road markings in city
        if (type === 'pavement' && x % 5 === 2) {
           ctx.fillStyle = '#f1c40f';
           ctx.fillRect(x * TILE_SIZE + (TILE_SIZE/2) - 2, y * TILE_SIZE + 4, 4, TILE_SIZE - 8);
        }
        // Add flower dots in nature
        if (type === 'grass' && Math.random() > 0.95) {
            ctx.fillStyle = Math.random() > 0.5 ? '#ffeb3b' : '#ff9800';
            ctx.fillRect(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, 4, 4);
        }
      }
    }
  }, []);

  // --- COLLISION DETECTION ---
  const isWalkable = (x: number, y: number) => {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    
    for (const obs of OBSTACLES_SET) {
      if (obs.startsWith(`${x},${y},`)) {
        return false;
      }
    }
    return true;
  };

  // --- INTERACTION LOGIC ---
  const getClosestScenario = useCallback((px: number, py: number) => {
    let closest: GameScenario | null = null;
    let minDistance = Infinity;

    scenarios.forEach(sc => {
      if (completedIds.has(sc.scenario_id)) return;

      const npcX = sc.position?.x ?? 8;
      const npcY = sc.position?.y ?? 6;

      const dx = px - npcX;
      const dy = py - npcY;
      const distPx = Math.hypot(dx * TILE_SIZE, dy * TILE_SIZE);
      const triggerDist = sc.trigger_area_px > 0 ? sc.trigger_area_px : 100;

      if (distPx < triggerDist && distPx < minDistance) {
        minDistance = distPx;
        closest = sc;
      }
    });

    return closest;
  }, [scenarios, completedIds]);

  // --- HANDLE RESIZE ---
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- CAMERA LOGIC ---
  useEffect(() => {
    if (containerRef.current) {
      const viewportWidth = containerRef.current.clientWidth;
      const viewportHeight = containerRef.current.clientHeight;

      let targetX = -playerPos.x * TILE_SIZE + viewportWidth / 2 - TILE_SIZE / 2;
      let targetY = -playerPos.y * TILE_SIZE + viewportHeight / 2 - TILE_SIZE / 2;

      const mapPixelWidth = MAP_WIDTH * TILE_SIZE;
      const mapPixelHeight = MAP_HEIGHT * TILE_SIZE;

      if (mapPixelWidth <= viewportWidth) {
         targetX = (viewportWidth - mapPixelWidth) / 2;
      } else {
         const minX = viewportWidth - mapPixelWidth;
         targetX = Math.min(0, Math.max(minX, targetX));
      }

      if (mapPixelHeight <= viewportHeight) {
        targetY = (viewportHeight - mapPixelHeight) / 2;
      } else {
        const minY = viewportHeight - mapPixelHeight;
        targetY = Math.min(0, Math.max(minY, targetY));
      }

      setCameraOffset({ x: targetX, y: targetY });
    }
  }, [playerPos, viewportSize]);

  // --- INPUT HANDLING ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedbackMessage) return;

      if (showDialogue) {
        if (e.key === 'Escape') {
          setShowDialogue(false);
        }
        return;
      }

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'w':
        case 'ArrowUp': dy = -1; break;
        case 's':
        case 'ArrowDown': dy = 1; break;
        case 'a':
        case 'ArrowLeft': 
          dx = -1; 
          setPlayerDirection('left');
          break;
        case 'd':
        case 'ArrowRight': 
          dx = 1; 
          setPlayerDirection('right');
          break;
        case 'e':
        case 'Enter':
          if (showPrompt && activeScenario) {
            setShowDialogue(true);
          }
          return;
        default: return;
      }

      const nextX = playerPos.x + dx;
      const nextY = playerPos.y + dy;

      if (isWalkable(nextX, nextY)) {
        setPlayerPos({ x: nextX, y: nextY });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDialogue, showPrompt, feedbackMessage, activeScenario, playerPos]);

  useEffect(() => {
    const closest = getClosestScenario(playerPos.x, playerPos.y);
    setActiveScenario(closest);
    setShowPrompt(!!closest);
    
    if (!closest && showDialogue) {
      setShowDialogue(false);
    }
  }, [playerPos, getClosestScenario, showDialogue]);

  const handleOptionSelect = (option: ScenarioOption) => {
    if (!activeScenario) return;

    if (option.is_correct) {
      setFeedbackMessage(activeScenario.dialogue_success);
      setTimeout(() => {
        setFeedbackMessage(null);
        setShowDialogue(false);
        onFinish('success', option.reward_card_prompt, activeScenario);
      }, 1500);
    } else {
      setFeedbackMessage(activeScenario.dialogue_fail);
      setTimeout(() => {
        setFeedbackMessage(null);
        setShowDialogue(false);
        onFinish('fail', option.reward_card_prompt, activeScenario);
      }, 1500);
    }
  };

  const renderObstacles = useMemo(() => {
    const obstacleList = Array.from(OBSTACLES_SET).map(s => {
      const [x, y, type] = s.split(',');
      return { x: parseInt(x), y: parseInt(y), type };
    });

    return obstacleList.map((obs, idx) => (
      <div
        key={`obs-${idx}`}
        className="absolute"
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          left: obs.x * TILE_SIZE,
          top: obs.y * TILE_SIZE,
        }}
      >
        <img 
          src={SPRITES[obs.type as keyof typeof SPRITES]} 
          alt={obs.type} 
          className="w-full h-full object-contain" 
        />
      </div>
    ));
  }, []);

  return (
    <div className="relative w-full h-full bg-[#111] overflow-hidden" ref={containerRef}>
      
      {/* --- HUD (HEADS UP DISPLAY) --- */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-[100] flex justify-between px-6 py-2 font-pixel text-white drop-shadow-[2px_2px_0_#000]">
         <div className="flex gap-8">
            <div className="flex flex-col">
               <span className="text-yellow-400 text-[10px] mb-1">LIVES</span>
               <span className="text-xl">{'❤️'.repeat(lives)}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-yellow-400 text-[10px] mb-1">SCORE</span>
               <span className="text-xl">{score.toString().padStart(6, '0')}</span>
            </div>
         </div>
         <div className="flex flex-col items-end">
             <span className="text-yellow-400 text-[10px] mb-1">COINS</span>
             <div className="flex items-center gap-2">
                <img src={SPRITES.coin} className="w-4 h-4 animate-bounce" alt="coin" />
                <span className="text-xl">{coins}</span>
             </div>
         </div>
      </div>

      {/* --- WORLD CAMERA CONTAINER --- */}
      <div 
        className="relative transition-transform duration-100 ease-linear will-change-transform"
        style={{ 
          width: MAP_WIDTH * TILE_SIZE, 
          height: MAP_HEIGHT * TILE_SIZE,
          transform: `translate(${Math.round(cameraOffset.x)}px, ${Math.round(cameraOffset.y)}px)`,
        }}
      >
        {/* Render Background via Canvas */}
        <canvas 
          ref={bgCanvasRef}
          width={MAP_WIDTH * TILE_SIZE}
          height={MAP_HEIGHT * TILE_SIZE}
          className="absolute inset-0 z-0 pixel-art"
        />

        {/* --- TERRAIN & OBSTACLES --- */}
        {renderObstacles}

        {/* --- DECORATIVE COINS --- */}
        {decoCoins.map(c => (
             <div 
                key={`coin-${c.id}`}
                className="absolute w-6 h-6 animate-pulse z-5"
                style={{ left: c.x * TILE_SIZE + 12, top: c.y * TILE_SIZE + 12 }}
             >
                <img src={SPRITES.coin} alt="coin" className="w-full h-full object-contain" />
             </div>
        ))}

        {/* --- NPCs --- */}
        {scenarios.map((sc) => {
          if (completedIds.has(sc.scenario_id)) return null;
          
          const x = sc.position?.x ?? 8;
          const y = sc.position?.y ?? 6;
          const skin = sc.skin && SPRITES[sc.skin] ? SPRITES[sc.skin] : SPRITES['wolf'];

          return (
            <div key={sc.scenario_id}>
               <div 
                className="absolute transition-all duration-300 z-10 hover:scale-110"
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  left: x * TILE_SIZE,
                  top: y * TILE_SIZE,
                }}
              >
                <img src={skin} alt="NPC" className="w-full h-full object-contain drop-shadow-md" />
                {/* Interaction indicator */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 animate-bounce">!</div>
              </div>
            </div>
          );
        })}

        {/* --- PLAYER (KID) --- */}
        <div 
          className="absolute transition-all duration-200 z-20"
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            left: playerPos.x * TILE_SIZE,
            top: playerPos.y * TILE_SIZE,
            transform: playerDirection === 'left' ? 'scaleX(-1)' : 'none'
          }}
        >
          <img src={SPRITES.kid} alt="Player" className="w-full h-full object-contain drop-shadow-xl" />
        </div>

        {/* Interaction Prompt (Integrated Style) */}
        {showPrompt && !showDialogue && !feedbackMessage && activeScenario && (
          <div 
            className="absolute bg-blue-600 text-white font-pixel text-[10px] px-2 py-1 border-2 border-white rounded z-30 pointer-events-none"
            style={{
              left: playerPos.x * TILE_SIZE + 8,
              top: playerPos.y * TILE_SIZE - 20,
            }}
          >
            PRESS E
          </div>
        )}

      </div>

      {/* --- HUD: MINI MAP (Retro Style) --- */}
      <div className="absolute bottom-4 right-4 w-40 h-32 bg-black/90 border-[3px] border-stone-500 z-40 p-1 rounded-sm shadow-xl">
        <div className="relative w-full h-full bg-[#111]">
           {/* Mini Map Terrain Colors */}
           <div className="absolute inset-0 opacity-50 flex">
              <div className="w-[44%] h-full bg-blue-500/30"></div> 
              <div className="flex-1 h-full bg-green-500/30"></div> 
           </div>

           {/* Grid Overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>

           {/* Mini Player */}
           <div 
             className="absolute w-2 h-2 bg-white rounded-sm z-10 border border-black animate-pulse"
             style={{
                left: `${(playerPos.x / MAP_WIDTH) * 100}%`,
                top: `${(playerPos.y / MAP_HEIGHT) * 100}%`
             }}
           />
           {/* Mini NPCs */}
           {scenarios.map(sc => !completedIds.has(sc.scenario_id) && (
              <div 
                key={sc.scenario_id}
                className="absolute w-2 h-2 bg-red-500 rounded-sm"
                style={{
                  left: `${((sc.position?.x || 0) / MAP_WIDTH) * 100}%`,
                  top: `${((sc.position?.y || 0) / MAP_HEIGHT) * 100}%`
                }}
              />
           ))}
        </div>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-700 px-2 text-[8px] text-white font-pixel border border-stone-500">RADAR</div>
      </div>

      {/* --- HUD: CONTROLS --- */}
      <div className="absolute bottom-4 left-4 text-white/50 font-pixel text-[10px] z-40 bg-black/40 p-2 rounded border border-white/10">
        <p>ARROWS / WASD = MOVE</p>
        <p>E = INTERACT</p>
        <p>ESC = CANCEL</p>
      </div>

      {/* --- DIALOGUE MODAL (RPG Style) --- */}
      {(showDialogue || feedbackMessage) && activeScenario && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-3xl z-50 animate-fade-in-up">
           <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-[4px] border-white text-white p-6 shadow-[0_10px_20px_rgba(0,0,0,0.5)] rounded-lg relative">
             
             {/* Character Portrait */}
             <div className="absolute -top-12 -left-4 w-24 h-24 bg-black border-4 border-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-700 to-slate-900">
                <img 
                  src={activeScenario.skin && SPRITES[activeScenario.skin] ? SPRITES[activeScenario.skin] : SPRITES['wolf']} 
                  className="w-20 h-20 object-contain"
                  alt="Speaker" 
                />
             </div>

             {/* Header */}
             <div className="ml-24 mb-4 flex justify-between items-center border-b border-blue-500 pb-2">
                <span className="font-pixel text-yellow-400 text-sm tracking-widest">{activeScenario.npc_type}</span>
                {!feedbackMessage && (
                  <button 
                    onClick={() => setShowDialogue(false)}
                    className="text-xs font-pixel text-red-300 hover:text-white"
                  >
                    [CLOSE]
                  </button>
                )}
             </div>
             
             {/* Message Body */}
             <div className="font-retro text-2xl leading-tight min-h-[80px]">
                {feedbackMessage ? feedbackMessage : activeScenario.question}
             </div>

             {/* Options */}
             {!feedbackMessage && (
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {activeScenario.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(opt)}
                      className="text-left px-4 py-3 bg-blue-800/50 border-2 border-transparent hover:border-yellow-400 hover:bg-blue-800 transition-all font-pixel text-xs group"
                    >
                      <span className="text-yellow-400 mr-2 opacity-0 group-hover:opacity-100">▶</span>
                      {opt.text}
                    </button>
                  ))}
                </div>
             )}
             
             {/* Saving Indicator */}
             {feedbackMessage && (
                <div className="absolute bottom-2 right-4 text-[10px] font-pixel text-yellow-400 animate-pulse">
                   SAVING...
                </div>
             )}
           </div>
        </div>
      )}

    </div>
  );
};

export default GameCanvas;
