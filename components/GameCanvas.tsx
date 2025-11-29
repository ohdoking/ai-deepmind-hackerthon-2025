
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { GameScenario, ScenarioOption, RewardType, AppStatus } from '../types';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, INITIAL_PLAYER_POS, SPRITES, OBSTACLES_SET, TERRAIN_MAP, PALETTE } from '../constants';

interface GameCanvasProps {
  scenarios: GameScenario[];
  completedIds: Set<string>;
  score: number;
  lives: number;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  onFinish: (result: 'success' | 'fail', cardPrompt: string, scenario: GameScenario) => void;
  activeReward: RewardType | null;
  onObstacleRemoved: () => void;
  status: AppStatus;
  setStatus: React.Dispatch<React.SetStateAction<AppStatus>>;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  scenarios,
  completedIds,
  score,
  lives,
  setLives,
  coins,
  setCoins,
  onFinish,
  activeReward,
  onObstacleRemoved,
  status,
  setStatus
}) => {
  const [obstacles, setObstacles] = useState<Set<string>>(OBSTACLES_SET);
  const [playerPos, setPlayerPos] = useState(INITIAL_PLAYER_POS);
  const [activeScenario, setActiveScenario] = useState<GameScenario | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'fail' | null>(null);
  const [playerDirection, setPlayerDirection] = useState<'left' | 'right'>('right');
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Interactive coins
  const [interactiveCoins, setInteractiveCoins] = useState<{ x: number, y: number, id: number }[]>([]);

  useEffect(() => {
    const coinsArr = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * MAP_WIDTH);
      const y = Math.floor(Math.random() * MAP_HEIGHT);
      if (!OBSTACLES_SET.has(`${x},${y},tree`) && !OBSTACLES_SET.has(`${x},${y},building`) && !OBSTACLES_SET.has(`${x},${y},water`) && TERRAIN_MAP[x][y] === 'grass') {
        coinsArr.push({ x, y, id: i });
      }
    }
    setInteractiveCoins(coinsArr);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Add an effect to handle obstacle removal when a reward is active
  useEffect(() => {
    if (!activeReward) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (activeReward === 'axe' || activeReward === 'magic_fire')) {
        e.preventDefault();
        
        const radius = activeReward === 'axe' ? 1 : 2; // Larger radius for magic fire
        const newObstacles = new Set(obstacles);
        let removedAny = false;
        
        // Check all tiles in a square around the player
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            const x = Math.round(playerPos.x + dx);
            const y = Math.round(playerPos.y + dy);
            
            // Skip if out of bounds
            if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) continue;
            
            // Check each obstacle at this position
            for (const obs of obstacles) {
              const [obsX, obsY, obsType] = obs.split(',');
              if (parseInt(obsX) === x && parseInt(obsY) === y) {
                // Don't remove buildings or water with axe/magic_fire
                if (obsType === 'building' || obsType === 'water') continue;
                
                newObstacles.delete(obs);
                removedAny = true;
                break;
              }
            }
          }
        }
        
        if (removedAny) {
          setObstacles(newObstacles);
          onObstacleRemoved();
          
          // Show feedback
          setFeedbackMessage(activeReward === 'axe' ? 'Chopped down obstacles!' : 'Burned through obstacles!');
          setFeedbackType('success');
          setTimeout(() => {
            setFeedbackMessage(null);
            setFeedbackType(null);
          }, 1500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReward, playerPos, obstacles, onObstacleRemoved]);


  // Preload terrain images
  const terrainImages = useMemo(() => {
    const grassImg = new Image();
    grassImg.src = SPRITES.grass_tile;
    const pathImg = new Image();
    pathImg.src = SPRITES.path_tile;
    const waterImg = new Image();
    waterImg.src = SPRITES.water_tile;
    const bridgeImg = new Image();
    bridgeImg.src = SPRITES.bridge_tile;
    return { grass: grassImg, path: pathImg, water: waterImg, bridge: bridgeImg };
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
          } else if (type === 'bridge') {
            ctx.drawImage(terrainImages.bridge, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
      terrainImages.bridge.onload = drawTerrain;
    }

  }, [terrainImages]);

  // --- COLLISION ---
  const isWalkable = useCallback((x: number, y: number) => {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    for (const obs of obstacles) {
      if (obs.startsWith(`${x},${y},`)) {
        return false;
      }
    }
    return true;
  }, [obstacles]);

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
          if (showPrompt && activeScenario && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
              setIsTransitioning(false);
              setShowDialogue(true);
            }, 1500);
          }
          return;
        default: return;
      }

      const nextX = playerPos.x + dx;
      const nextY = playerPos.y + dy;
      if (isWalkable(nextX, nextY)) setPlayerPos({ x: nextX, y: nextY });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDialogue, showPrompt, feedbackMessage, activeScenario, playerPos, isTransitioning]);

  // Check Coin Collection
  useEffect(() => {
    const coinIndex = interactiveCoins.findIndex(c => c.x === playerPos.x && c.y === playerPos.y);
    if (coinIndex !== -1) {
      const newCoins = [...interactiveCoins];
      newCoins.splice(coinIndex, 1);
      setInteractiveCoins(newCoins);
      setCoins(prev => {
        const next = prev + 1;
        if (next % 10 === 0) {
          setLives(l => l + 1);
        }
        return next;
      });
    }
  }, [playerPos, interactiveCoins, setCoins, setLives]);

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
    setFeedbackType(isWin ? 'success' : 'fail');
    setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackType(null);
      setShowDialogue(false);
      onFinish(isWin ? 'success' : 'fail', option.reward_card_prompt, activeScenario);
    }, 1500);
  };

  // --- TRANSITION EFFECT ---
  const transitionOverlay = isTransitioning ? (
    <div className="absolute inset-0 z-[200] animate-flash pointer-events-none"></div>
  ) : null;

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
    {!(showDialogue || feedbackMessage) && !activeScenario && (
      <div className="absolute top-4 left-4 right-4 h-16 bg-[#8B5A2B] border-4 border-[#5D4037] rounded-lg shadow-lg z-[100] flex justify-between px-6 py-2 font-pixel text-[#F4E4BC] items-center wooden-pattern">
          <div className="flex gap-8 items-center">
            <div className="flex flex-col">
              <span className="text-[#C19A6B] text-[10px]">LIVES</span>
              <span className="text-xl drop-shadow-md">
                {Array(Math.max(0, lives)).fill('❤️').join('')}
                {Array(Math.max(0, 3 - lives)).fill('🖤').join('')}
              </span>
            </div>
            {/* <div className="flex flex-col">
              <span className="text-[#C19A6B] text-[10px]">SCORE</span>
              <span className="text-xl drop-shadow-md">{score.toString().padStart(6, '0')}</span>
            </div> */}
          </div>
          <div className="flex gap-2 items-center bg-[#5D4037] px-4 py-1 rounded shadow-inner">
            <img src={SPRITES.coin} className="w-4 h-4" alt="coin" />
            <span className="text-xl">{coins}</span>
          </div>
        </div>
    )}

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

        {interactiveCoins.map(c => (
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

        {/* --- EFFECTS --- */}
        {isTransitioning && (
          <div className="absolute z-40 animate-ping" style={{ left: playerPos.x * TILE_SIZE, top: playerPos.y * TILE_SIZE - 24, width: TILE_SIZE, height: TILE_SIZE }}>
            <img src={SPRITES.effect_sparkle} alt="sparkle" className="w-full h-full object-contain" />
          </div>
        )}

        {feedbackType && activeScenario && (
          <div className="absolute z-50 animate-bounce" style={{
            left: (activeScenario.position?.x ?? 0) * TILE_SIZE,
            top: (activeScenario.position?.y ?? 0) * TILE_SIZE - 32,
            width: TILE_SIZE, height: TILE_SIZE
          }}>
            <img src={feedbackType === 'success' ? SPRITES.effect_heart : SPRITES.effect_shock} alt="effect" className="w-full h-full object-contain" />
          </div>
        )}

      </div>

      {/* --- BATTLE INTERFACE --- */}
      {(showDialogue || feedbackMessage) && activeScenario && (
        <div className="absolute inset-0 z-50 flex flex-col font-pixel animate-fade-in">

          {/* BATTLE SCENE (Top 65%) */}
          <div className="h-[65%] relative bg-gradient-to-b from-[#A2D9E8] to-[#8CD6A3] overflow-hidden border-b-4 border-[#333]">

            {/* OPPONENT (Top Right) */}
            <div className="absolute top-8 right-8 flex flex-col items-end animate-slide-in-right">
              <div className="bg-[#F4E4BC] border-2 border-[#333] p-2 rounded shadow-md mb-2 w-48">
                <div className="flex justify-between text-xs font-bold text-[#333]">
                  <span>{activeScenario.npc_type}</span>
                  {/* <span>Lv5</span> */}
                </div>
                <div className="w-full h-2 bg-[#333] rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-green-500 w-full"></div>
                </div>
              </div>
              <img
                // @ts-ignore
                src={SPRITES[((activeScenario.skin && activeScenario.skin in SPRITES) ? activeScenario.skin : 'fox')]}
                className="w-32 h-32 object-contain drop-shadow-lg"
                alt="Opponent"
              />
            </div>

            {/* PLAYER (Bottom Left) */}
            <div className="absolute bottom-4 left-8 flex flex-col items-start animate-slide-in-left">
              <img src={SPRITES.witch} className="w-32 h-32 object-contain drop-shadow-lg mb-2 transform scale-x-[-1]" alt="Player" />
              <div className="bg-[#F4E4BC] border-2 border-[#333] p-2 rounded shadow-md w-48">
                <div className="flex justify-between text-xs font-bold text-[#333]">
                  <span>Witch</span>
                  <span>Lv{lives}</span>
                </div>
                <div className="w-full h-2 bg-[#333] rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(lives / 3) * 100}%` }}></div>
                </div>
                <div className="text-[10px] text-right mt-1">{lives}/3 HP</div>
              </div>
            </div>

            {/* Effects Layer */}
            {feedbackType && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <img
                  src={feedbackType === 'success' ? SPRITES.effect_heart : SPRITES.effect_shock}
                  alt="feedback"
                  className="w-32 h-32 animate-bounce"
                />
              </div>
            )}
          </div>

          {/* DIALOGUE BOX (Bottom 35%) */}
          <div className="h-[35%] bg-[#2C3E50] border-t-4 border-[#F1C40F] p-4 flex gap-4 relative">
            <div className="flex-1 bg-white border-4 border-[#5D4037] rounded p-4 relative shadow-inner">
              <p className="font-retro text-lg leading-relaxed text-[#333]">
                {feedbackMessage || activeScenario.question}
              </p>
              {/* Continue Arrow */}
              <div className="absolute bottom-2 right-2 text-[#E91E63] animate-bounce">▼</div>
            </div>

            {/* OPTIONS */}
            {!feedbackMessage && (
              <div className="w-1/3 bg-white border-4 border-[#5D4037] rounded p-2 flex flex-col gap-2 shadow-inner">
                {activeScenario.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className="text-left px-3 py-2 hover:bg-[#F1C40F] hover:text-[#333] transition-colors text-xs font-bold border border-transparent hover:border-[#333] rounded group"
                  >
                    <span className="group-hover:visible invisible mr-1">▶</span>
                    {opt.text}
                  </button>
                ))}
                <button
                  onClick={() => setShowDialogue(false)}
                  className="mt-auto text-center text-[10px] text-red-500 hover:underline py-1"
                >
                  RUN AWAY
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {transitionOverlay}

      <style>{`
        @keyframes flash {
            0% { background-color: transparent; }
            10% { background-color: black; }
            20% { background-color: white; }
            30% { background-color: black; }
            40% { background-color: white; }
            50% { background-color: black; }
            60% { background-color: white; }
            70% { background-color: black; }
            80% { background-color: white; }
            90% { background-color: black; }
            100% { background-color: transparent; }
        }
        .animate-flash {
            animation: flash 1.5s steps(10, end);
        }
      `}</style>
    </div>
  );
};

export default GameCanvas;
