
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { analyzeSafetyScenario, generateRewardCard } from './services/geminiService';
import { GameScenario, AppStatus, CollectedCard, RewardType } from './types';
import { PREBUILT_SCENARIOS, MAP_WIDTH, MAP_HEIGHT } from './constants';
import GameCanvas from './components/GameCanvas';
import RewardCard from './components/RewardCard';
import Sidebar from './components/Sidebar';
import CardDetailModal from './components/CardDetailModal';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [scenarios, setScenarios] = useState<GameScenario[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [collectedCards, setCollectedCards] = useState<CollectedCard[]>([]);
  const [lives, setLives] = useState(2);
  const [coins, setCoins] = useState(0);

  // Modal states
  const [activeCardData, setActiveCardData] = useState<{ 
    imageUrl: string; 
    result: 'success' | 'fail'; 
    rewardType?: string;
  } | null>(null);
  const [viewingCard, setViewingCard] = useState<CollectedCard | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeReward, setActiveReward] = useState<RewardType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle using a reward from a card
  const handleUseReward = (cardId: string) => {
    console.log('handleUseReward called with cardId:', cardId);
    
    setCollectedCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === cardId && card.reward) {
          console.log('Found card with reward:', card);
          
          // For all rewards, set it as active first
          setActiveReward(card.reward.type);
          console.log('Set active reward to:', card.reward.type);
          
          // Close the card detail modal
          setViewingCard(null);
          
          // Mark the reward as used
          const updatedCard = {
            ...card,
            reward: {
              ...card.reward,
              used: true,
              uses: card.reward.uses !== undefined ? Math.max(0, card.reward.uses - 1) : undefined
            }
          };
          
          console.log('Marked reward as used:', updatedCard);
          return updatedCard;
        }
        return card;
      });
    });
  };

  // Function to remove obstacles around the player
  const removeObstaclesAroundPlayer = (radius: number) => {
    // This will be called from GameCanvas to remove obstacles
    return (playerX: number, playerY: number, obstacles: Set<string>) => {
      const newObstacles = new Set(obstacles);
      let removedAny = false;
      
      // Check all tiles in a square around the player
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const x = playerX + dx;
          const y = playerY + dy;
          
          // Skip if out of bounds
          if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) continue;
          
          // Check each obstacle at this position
          for (const obs of obstacles) {
            const [obsX, obsY] = obs.split(',').map(Number);
            if (obsX === x && obsY === y) {
              // Don't remove buildings or water with axe/magic_fire
              const obsType = obs.split(',')[2];
              if (obsType === 'building' || obsType === 'water') continue;
              
              newObstacles.delete(obs);
              removedAny = true;
              break;
            }
          }
        }
      }
      
      return { newObstacles, removedAny };
    };
  };

  // Handle keyboard events for using active items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeReward) {
        e.preventDefault(); // Prevent scrolling the page
        
        // Apply reward effects based on the reward type
        switch(activeReward) {
          case 'heart':
            setLives(prev => Math.min(5, prev + 1)); // Max 5 lives
            alert('Used Heart! Gained 1 extra life!');
            break;
            
          case 'coin':
            setCoins(prev => prev + 5);
            alert('Used Coin Bag! Gained 5 coins!');
            break;
            
          case 'axe':
            // Axe can remove trees and rocks in a small radius
            const axeRemover = removeObstaclesAroundPlayer(1); // 1 tile radius
            // This will be handled by the GameCanvas component
            setActiveReward('axe'); // Keep it active for the GameCanvas to handle
            return; // Don't clear the active reward yet
            
          case 'magic_fire':
            // Magic fire can remove more obstacles in a larger radius
            const fireRemover = removeObstaclesAroundPlayer(2); // 2 tile radius
            // This will be handled by the GameCanvas component
            setActiveReward('magic_fire'); // Keep it active for the GameCanvas to handle
            return; // Don't clear the active reward yet
            
          case 'ship':
            // Ship can be used to cross water
            alert('Used Ship! You can now cross water tiles!');
            // This could be implemented by temporarily allowing water walking
            break;
        }
        
        // Clear the active reward after use (except for tools that need targeting)
        setActiveReward(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReward]);

  // Score Calculation
  const score = useMemo(() => {
    return collectedCards.length * 5000;
  }, [collectedCards.length]);

  const handleStartCampaign = () => {
    setScenarios(PREBUILT_SCENARIOS);
    setCompletedIds(new Set());
    setCollectedCards([]);
    setLives(2);
    setCoins(0);
    setStatus(AppStatus.PLAYING);
  };

  const handleScenarioFinish = async (result: 'success' | 'fail', cardPrompt: string, scenario: GameScenario) => {
    // 1. Mark as completed immediately to hide from map
    const newCompleted = new Set(completedIds);
    newCompleted.add(scenario.scenario_id);
    setCompletedIds(newCompleted);

    // 2. Generate reward card
    setStatus(AppStatus.GENERATING_REWARD);
    try {
      const fullPrompt = `${cardPrompt}. ${result === 'success' ? 'Warm, golden lighting, harmonious composition' : 'Slightly ominous, warning symbols, darker tones'}. Art Nouveau style, Alphonse Mucha inspired.`;
      const imageUrl = await generateRewardCard(fullPrompt);

      // 3. Show Result Modal
      // Get the reward type from the scenario if available
      const rewardType = scenario.reward?.type;
      setActiveCardData({ 
        imageUrl, 
        result,
        rewardType
      });
      setStatus(AppStatus.SHOW_RESULT);

      // 4. Add to collection (Success or Fail)
      const newCard: CollectedCard = {
        id: Date.now().toString(),
        scenarioId: scenario.scenario_id,
        title: scenario.npc_type, // Use object name as title
        imageUrl: imageUrl,
        timestamp: Date.now(),
        type: result === 'success' ? 'good' : 'bad',
        selectedAnswer: scenario.selectedAnswer, // Get the selected answer from the scenario
        explanation: result === 'fail' ? scenario.dialogue_fail : undefined,
        reward: result === 'success' && scenario.reward ? {
          type: scenario.reward.type,
          description: scenario.reward.description || `A ${scenario.reward.type.replace('_', ' ')} reward`,
          uses: scenario.reward.uses ?? 1
        } : undefined
      };
      
      console.log('Creating new card with reward:', newCard.reward);
      setCollectedCards(prev => {
        const newCards = [newCard, ...prev];
        console.log('Updated cards:', newCards);
        return newCards;
      });

      if (result === 'fail') {
        setLives(prev => Math.max(0, prev - 1));
      }

    } catch (err) {
      console.error(err);
      setErrorMsg("Could not generate reward card.");
      setStatus(AppStatus.ERROR);
    }
  };

  // Continues the game without resetting
  const handleCollectAndContinue = () => {
    setActiveCardData(null);
    setActiveReward(null);
    // Add a small delay to ensure the modal is fully closed before re-enabling controls
    setTimeout(() => {
      setStatus(AppStatus.PLAYING);
    }, 50);
  };

  const quitToMenu = () => {
    setStatus(AppStatus.IDLE);
    setScenarios([]);
    setCompletedIds(new Set());
    setCollectedCards([]);
    setLives(2);
    setCoins(0);
    setActiveReward(null);
    setActiveCardData(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-screen w-screen bg-[#111] text-stone-100 font-sans overflow-hidden flex">

      {(status === AppStatus.IDLE || status === AppStatus.ANALYZING || status === AppStatus.ERROR) ? (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#111] to-black">
          {/* IDLE: Selection UI */}
          {status === AppStatus.IDLE && (
            <>
              <header className="p-8 text-center animate-fade-in-down">
                <h1 className="font-pixel text-5xl text-yellow-400 mb-2 leading-relaxed tracking-wider drop-shadow-[4px_4px_0_#000]">
                  SAFEGUARD<br />
                  <span className="text-white text-3xl">CARD COLLECTION</span>
                </h1>
                <p className="font-retro text-2xl text-blue-300 max-w-lg mx-auto mb-10 tracking-widest">
                  PRESS START TO BEGIN
                </p>
              </header>
              <div className="flex flex-col gap-6 w-full max-w-md">
                <button
                  onClick={handleStartCampaign}
                  className="group relative p-6 bg-blue-900 rounded border-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-800 hover:scale-105 transition-all text-left"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 text-4xl animate-pulse">⚔️</div>
                  <h3 className="font-pixel text-yellow-400 text-lg mb-2">START ADVENTURE</h3>
                  <p className="font-retro text-blue-200">Play campaign mode with Wizards, Robots & Archers.</p>
                </button>
              </div>
            </>
          )}

          {/* ANALYZING */}
          {status === AppStatus.ANALYZING && (
            <div className="text-center">
              <div className="inline-block w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="font-retro text-3xl animate-pulse text-blue-400">ANALYZING DATA...</p>
            </div>
          )}

          {/* ERROR */}
          {status === AppStatus.ERROR && (
            <div className="text-center p-8 bg-red-900/50 border-4 border-red-500 rounded max-w-md backdrop-blur">
              <h3 className="font-pixel text-red-400 mb-4 text-xl">SYSTEM FAILURE</h3>
              <p className="font-retro text-2xl mb-8">{errorMsg}</p>
              <button onClick={quitToMenu} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-pixel text-sm rounded shadow border-2 border-white">
                RETRY
              </button>
            </div>
          )}
        </div>
      ) : (
        // --- GAME PLAY SPLIT VIEW ---
        <>
          {/* LEFT: GAME CANVAS */}
          <div className="flex-1 relative h-full min-w-0">

            // In App.tsx, update the GameCanvas component to pass setStatus
            <GameCanvas
              scenarios={scenarios}
              completedIds={completedIds}
              score={score}
              lives={lives}
              setLives={setLives}
              coins={coins}
              setCoins={setCoins}
              onFinish={handleScenarioFinish}
              activeReward={activeReward}
              onObstacleRemoved={() => {
                // Clear the active reward after obstacle is removed
                setActiveReward(null);
              }}
              status={status}
              setStatus={setStatus}
            />

            {/* OVERLAY: GENERATING */}
            {status === AppStatus.GENERATING_REWARD && (
              <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center pointer-events-none">
                <div className="font-retro text-4xl text-yellow-400 mb-8 animate-bounce">
                  CRAFTING REWARD CARD...
                </div>
                <div className="w-96 h-4 bg-stone-800 rounded border-2 border-stone-600 overflow-hidden">
                  <div className="h-full bg-yellow-500 animate-progress"></div>
                </div>
                <style>{`
                  @keyframes progress { 0% { width: 0% } 100% { width: 100% } }
                  .animate-progress { animation: progress 3s ease-in-out infinite; }
                `}</style>
              </div>
            )}

            {/* OVERLAY: REWARD CARD MODAL */}
            {status === AppStatus.SHOW_RESULT && activeCardData && (
              <div className="absolute inset-0 z-[70]">
                {activeCardData && (
                  <RewardCard
                    imageUrl={activeCardData.imageUrl}
                    result={activeCardData.result}
                    rewardType={activeCardData.rewardType}
                    onCollect={handleCollectAndContinue}
                    onDontCollect={handleCollectAndContinue} // Same handler for now, but you can customize this
                    onUseReward={activeCardData.rewardType ? () => {
                      setActiveReward(activeCardData.rewardType as RewardType);
                      handleCollectAndContinue();
                    } : undefined}
                  />
                )}
                {activeReward && (
                  <div className="fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    Active Item: {activeReward.replace('_', ' ')} (Press SPACE to use)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: SIDEBAR */}
          <Sidebar
            collectedCards={collectedCards}
            remainingCount={scenarios.length - completedIds.size}
            onCardClick={(card) => setViewingCard(card)}
          />

          {/* GLOBAL MODAL: CARD DETAIL */}
          {viewingCard && (
            <CardDetailModal
              card={viewingCard}
              onClose={() => setViewingCard(null)}
              onUseReward={handleUseReward}
            />
          )}

          {/* Active Reward Indicator */}
          {activeReward && (
            <div className="fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
              <span className="text-xl">
                {activeReward === 'heart' && '❤️'}
                {activeReward === 'coin' && '🪙'}
                {activeReward === 'axe' && '🪓'}
                {activeReward === 'ship' && '⛵'}
                {activeReward === 'magic_fire' && '🔥'}
              </span>
              <span>Active: {activeReward.replace('_', ' ')}</span>
              <span className="text-xs">(Press SPACE to use)</span>
              <button 
                onClick={() => setActiveReward(null)}
                className="ml-2 text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              >
                Clear
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
