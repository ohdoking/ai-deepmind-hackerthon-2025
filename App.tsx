
import React, { useState, useRef, useMemo } from 'react';
import { analyzeSafetyScenario, generateRewardCard } from './services/geminiService';
import { GameScenario, AppStatus, CollectedCard } from './types';
import { PREBUILT_SCENARIOS } from './constants';
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
  const [activeCardData, setActiveCardData] = useState<{ imageUrl: string; result: 'success' | 'fail' } | null>(null);
  const [viewingCard, setViewingCard] = useState<CollectedCard | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus(AppStatus.ANALYZING);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const generatedScenario = await analyzeSafetyScenario(base64String, file.type);

        const scenarioWithPos = {
          ...generatedScenario,
          position: { x: 25, y: 15 }, // Center
          skin: 'wolf' as const
        };

        setScenarios([scenarioWithPos]);
        setScenarios([scenarioWithPos]);
        setCompletedIds(new Set());
        setCollectedCards([]);
        setScenarios([scenarioWithPos]);
        setCompletedIds(new Set());
        setCollectedCards([]);
        setLives(2);
        setCoins(0);
        setStatus(AppStatus.PLAYING);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to analyze image. Please try a clear photo of a child and animal.");
        setStatus(AppStatus.ERROR);
      }
    };
    reader.readAsDataURL(file);
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
      setActiveCardData({ imageUrl, result });
      setStatus(AppStatus.SHOW_RESULT);

      // 4. Add to collection (Success or Fail)
      const newCard: CollectedCard = {
        id: Date.now().toString(),
        scenarioId: scenario.scenario_id,
        title: scenario.npc_type, // Use object name as title
        imageUrl: imageUrl,
        timestamp: Date.now(),
        type: result === 'success' ? 'good' : 'bad'
      };
      setCollectedCards(prev => [newCard, ...prev]);

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
    setStatus(AppStatus.PLAYING);
  };

  const quitToMenu = () => {
    setStatus(AppStatus.IDLE);
    setScenarios([]);
    setCompletedIds(new Set());
    setCollectedCards([]);
    setLives(2);
    setCoins(0);
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
                  ANTIGRAVITY<br />
                  <span className="text-white text-3xl">SAFETY AGENT</span>
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
                <div className="relative group p-6 bg-stone-800 rounded border-4 border-stone-600 shadow-xl hover:bg-stone-700 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 text-4xl">📷</div>
                  <h3 className="font-pixel text-white text-lg mb-2">SCAN PHOTO</h3>
                  <p className="font-retro text-stone-400 mb-4">Analyze a real photo to generate a level.</p>
                  <label className="block w-full cursor-pointer">
                    <div className="py-3 px-4 bg-black border-2 border-dashed border-stone-500 rounded text-center font-pixel text-xs text-stone-400 hover:text-white hover:border-white transition-colors">
                      [SELECT IMAGE FILE]
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} ref={fileInputRef} />
                  </label>
                </div>
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
            <button
              onClick={quitToMenu}
              className="absolute top-20 right-4 z-50 px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white font-pixel text-[10px] border border-red-500 rounded shadow-lg"
            >
              QUIT
            </button>

            <GameCanvas
              scenarios={scenarios}
              completedIds={completedIds}
              onFinish={handleScenarioFinish}
              score={score}
              lives={lives}
              setLives={setLives}
              coins={coins}
              setCoins={setCoins}
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
                <RewardCard
                  imageUrl={activeCardData.imageUrl}
                  result={activeCardData.result}
                  onCollect={handleCollectAndContinue}
                />
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
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
