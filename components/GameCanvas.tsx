
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
  
  const [coins, setCoins] = useState(10);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Decorative coins
  const decoCoins = useMemo(() => {
    const coinsArr = [];
    for(let i=0; i<20; i++) {
        const x = Math.floor(Math.random() * MAP_WIDTH);
        const y = Math.floor(Math.random() * MAP_HEIGHT);
        if(!OBSTACLES_SET.has(`${x},${y},tree`) && !OBSTACLES_SET.has(`${x},${y},building`) && TERRAIN_MAP[x][y] === 'grass') {
            coinsArr.push({x, y, id: i});
        }
    }
    return coinsArr;
  }, []);

  // Preload terrain images
  const terrainImages = useMemo(() => {
    const grassImg = new Image();
    grassImg.src = SPRITES.grass_tile;
    const pathImg = new Image();
    pathImg.src = SPRITES.path_tile;
    const waterImg = new Image();
    waterImg.src = SPRITES.water_tile;
    return { grass: grassImg, path: pathImg, water: waterImg };
  }, []);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Wait for images to load (basic check)
    const drawTerrain = () => {
      // --- DRAW VILLAGE TERRAIN WITH TEXTURES ---
      for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          const type = TERRAIN_MAP[x][y];
          
          if (type === 'path') {
            ctx.drawImage(terrainImages.path, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else if (type === 'water') {
            ctx.drawImage(terrainImages.water, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else {
            // Grass
            ctx.drawImage(terrainImages.grass, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    };

    if (terrainImages.grass.complete && terrainImages.path.complete) {
        drawTerrain();
    } else {
        terrainImages.grass.onload = drawTerrain;
        terrainImages.path.onload = drawTerrain;
    }

  }, [terrainImages]);

  // --- COLLISION ---
  const isWalkable = (x: number, y: number) => {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    for (const obs of OBSTACLES_SET) {
      if (obs.startsWith(`${x},${y},`)) {
        return false;
      }
    }
    return true;
  };

  // --- INTERACTION ---
  const getClosestScenario = useCallback((px: number, py: number) => {
    let closest: GameScenario | null = null;
    let minDistance = Infinity;

    scenarios.forEach(sc => {
      if (completedIds.has(sc.scenario_id)) return;
      const npcX = sc.position?.x ?? 8;
      const npcY = sc.position?.y ?? 6;
      const distPx = Math.hypot((px - npcX) * TILE_SIZE, (py - npcY) * TILE_SIZE);
      
      if (distPx < 100 && distPx < minDistance) {
        minDistance = distPx;
        closest = sc;
      }
    });

    return closest;
  }, [scenarios, completedIds]);

  // --- RESIZE ---
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

  // --- CAMERA ---
  useEffect(() => {
    if (containerRef.current) {
      const vW = containerRef.current.clientWidth;
      const vH = containerRef.current.clientHeight;

      let tX = -playerPos.x * TILE_SIZE + vW / 2 - TILE_SIZE / 2;
      let tY = -playerPos.y * TILE_SIZE + vH / 2 - TILE_SIZE / 2;

      const mapW = MAP_WIDTH * TILE_SIZE;
      const mapH = MAP_HEIGHT * TILE_SIZE;

      if (mapW <= vW) tX = (vW - mapW) / 2;
      else tX = Math.min(0, Math.max(vW - mapW, tX));

      if (mapH <= vH) tY = (vH - mapH) / 2;
      else tY = Math.min(0, Math.max(vH - mapH, tY));

      setCameraOffset({ x: tX, y: tY });
    }
  }, [playerPos, viewportSize]);

  // --- CONTROLS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedbackMessage) return;
      if (showDialogue) {
        if (e.key === 'Escape') setShowDialogue(false);
        return;
      }

      let dx = 0, dy = 0;
      switch (e.key) {
        case 'w': case 'ArrowUp': dy = -1; break;
        case 's': case 'ArrowDown': dy = 1; break;
        case 'a': case 'ArrowLeft': dx = -1; setPlayerDirection('left'); break;
        case 'd': case 'ArrowRight': dx = 1; setPlayerDirection('right'); break;
        case 'e': case 'Enter':
          if (showPrompt && activeScenario) setShowDialogue(true);
          return;
        default: return;
      }

      const nextX = playerPos.x + dx;
      const nextY = playerPos.y + dy;
      if (isWalkable(nextX, nextY)) setPlayerPos({ x: nextX, y: nextY });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDialogue, showPrompt, feedbackMessage, activeScenario, playerPos]);

  useEffect(() => {
    const closest = getClosestScenario(playerPos.x, playerPos.y);
    setActiveScenario(closest);
    setShowPrompt(!!closest);
    if (!closest && showDialogue) setShowDialogue(false);
  }, [playerPos, getClosestScenario, showDialogue]);

  const handleOptionSelect = (option: ScenarioOption) => {
    if (!activeScenario) return;
    const isWin = option.is_correct;
    setFeedbackMessage(isWin ? activeScenario.dialogue_success : activeScenario.dialogue_fail);
    setTimeout(() => {
      setFeedbackMessage(null);
      setShowDialogue(false);
      onFinish(isWin ? 'success' : 'fail', option.reward_card_prompt, activeScenario);
    }, 1500);
  };

  const renderObstacles = useMemo(() => {
    return Array.from(OBSTACLES_SET).map((s, idx) => {
      const [x, y, type] = s.split(',');
      
      let sprite: string | undefined;
      // Map 'building' to 'cottage'
      if (type === 'building') {
        sprite = SPRITES.cottage;
      } else if (type === 'tree') {
        sprite = SPRITES.pine_tree;
      } else if (type in SPRITES) {
        // @ts-ignore
        sprite = SPRITES[type];
      }

      if (!sprite) return null;

      return (
        <div
          key={`obs-${idx}`}
          className="absolute"
          style={{ width: TILE_SIZE, height: TILE_SIZE, left: parseInt(x) * TILE_SIZE, top: parseInt(y) * TILE_SIZE }}
        >
          <img src={sprite} alt={type} className="w-full h-full object-contain drop-shadow-sm" />
        </div>
      );
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-[#3E2723] overflow-hidden" ref={containerRef}>
      
      {/* --- WOODEN HUD --- */}
      <div className="absolute top-4 left-4 right-4 h-16 bg-[#8B5A2B] border-4 border-[#5D4037] rounded-lg shadow-lg z-[100] flex justify-between px-6 py-2 font-pixel text-[#F4E4BC] items-center wooden-pattern">
         <div className="flex gap-8 items-center">
            <div className="flex flex-col">
               <span className="text-[#C19A6B] text-[10px]">LIVES</span>
               <span className="text-xl drop-shadow-md">❤️❤️❤️</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[#C19A6B] text-[10px]">SCORE</span>
               <span className="text-xl drop-shadow-md">{score.toString().padStart(6, '0')}</span>
            </div>
         </div>
         <div className="flex gap-2 items-center bg-[#5D4037] px-4 py-1 rounded shadow-inner">
             <img src={SPRITES.coin} className="w-4 h-4" alt="coin" />
             <span className="text-xl">{coins}</span>
         </div>
      </div>

      {/* --- WORLD --- */}
      <div 
        className="relative transition-transform duration-100 ease-linear"
        style={{ 
          width: MAP_WIDTH * TILE_SIZE, height: MAP_HEIGHT * TILE_SIZE,
          transform: `translate(${Math.round(cameraOffset.x)}px, ${Math.round(cameraOffset.y)}px)`,
        }}
      >
        <canvas ref={bgCanvasRef} width={MAP_WIDTH * TILE_SIZE} height={MAP_HEIGHT * TILE_SIZE} className="absolute inset-0 z-0 pixel-art" />
        {renderObstacles}

        {decoCoins.map(c => (
             <div key={`coin-${c.id}`} className="absolute w-6 h-6 animate-bounce z-5" style={{ left: c.x * TILE_SIZE + 12, top: c.y * TILE_SIZE + 12 }}>
                <img src={SPRITES.coin} alt="coin" />
             </div>
        ))}

        {scenarios.map((sc) => {
          if (completedIds.has(sc.scenario_id)) return null;
          const x = sc.position?.x ?? 8;
          const y = sc.position?.y ?? 6;
          // @ts-ignore
          const skinKey = (sc.skin && sc.skin in SPRITES) ? sc.skin : 'fox';
          // @ts-ignore
          const skin = SPRITES[skinKey];
          return (
            <div key={sc.scenario_id} className="absolute transition-all duration-300 z-10 hover:scale-110"
                style={{ width: TILE_SIZE, height: TILE_SIZE, left: x * TILE_SIZE, top: y * TILE_SIZE }}>
                <img src={skin} alt="NPC" className="w-full h-full object-contain drop-shadow-md" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 animate-bounce">!</div>
            </div>
          );
        })}

        {/* PLAYER (WITCH) */}
        <div className="absolute transition-all duration-200 z-20"
          style={{ width: TILE_SIZE, height: TILE_SIZE, left: playerPos.x * TILE_SIZE, top: playerPos.y * TILE_SIZE, transform: playerDirection === 'left' ? 'scaleX(-1)' : 'none' }}>
          <img src={SPRITES.witch} alt="Player" className="w-full h-full object-contain drop-shadow-xl" />
        </div>

        {showPrompt && !showDialogue && !feedbackMessage && activeScenario && (
          <div className="absolute bg-[#5D4037] text-[#F4E4BC] font-pixel text-[10px] px-2 py-1 border border-[#C19A6B] rounded z-30 shadow-lg"
            style={{ left: playerPos.x * TILE_SIZE + 8, top: playerPos.y * TILE_SIZE - 20 }}>
            PRESS E
          </div>
        )}
      </div>

      {/* --- WOODEN DIALOGUE --- */}
      {(showDialogue || feedbackMessage) && activeScenario && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl z-50 animate-fade-in-up">
           <div className="bg-[#F4E4BC] border-[6px] border-[#8B5A2B] p-6 shadow-2xl rounded-sm relative text-[#3E2723] wooden-pattern">
             <div className="absolute -top-10 -left-6 w-20 h-20 bg-[#F4E4BC] border-4 border-[#8B5A2B] rounded-full overflow-hidden flex items-center justify-center shadow-lg">
                <img 
                  // @ts-ignore
                  src={SPRITES[((activeScenario.skin && activeScenario.skin in SPRITES) ? activeScenario.skin : 'fox')]} 
                  className="w-14 h-14" 
                  alt="Speaker" 
                />
             </div>
             <div className="ml-16 mb-2 flex justify-between items-center border-b-2 border-[#8B5A2B]/20 pb-1">
                <span className="font-pixel text-[#8B5A2B] text-sm">{activeScenario.npc_type}</span>
                {!feedbackMessage && <button onClick={() => setShowDialogue(false)} className="text-xs font-pixel text-red-500 hover:text-red-700">[CLOSE]</button>}
             </div>
             <div className="font-retro text-2xl leading-tight min-h-[60px] drop-shadow-sm">{feedbackMessage || activeScenario.question}</div>
             {!feedbackMessage && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {activeScenario.options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleOptionSelect(opt)}
                      className="text-left px-4 py-2 bg-[#E8D5B5] border border-[#C19A6B] hover:bg-[#8B5A2B] hover:text-[#F4E4BC] transition-all font-pixel text-xs rounded shadow-sm">
                      ▶ {opt.text}
                    </button>
                  ))}
                </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
