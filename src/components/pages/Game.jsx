import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Timer from "@/components/atoms/Timer";
import GameRoom from "@/components/organisms/GameRoom";
import GameInventory from "@/components/organisms/GameInventory";
import PuzzleModal from "@/components/organisms/PuzzleModal";
import VictoryModal from "@/components/organisms/VictoryModal";
import { gameStateService, itemService, puzzleService, roomService } from "@/services";

const Game = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [gameState, setGameState] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomPuzzles, setRoomPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const gameStarted = useRef(false);
  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState?.isComplete && !showVictory) {
      setShowVictory(true);
      setIsPaused(true);
    }
  }, [gameState?.isComplete, showVictory]);

const initializeGame = async () => {
    try {
      setLoading(true);
      
      // Get room ID from URL parameters
      const roomId = parseInt(searchParams.get('room'), 10);
      if (!roomId) {
        toast.error('No room selected');
        navigate('/');
        return;
      }

      // Load room data
      const room = await roomService.getById(roomId);
      if (!room) {
        toast.error('Room not found');
        navigate('/');
        return;
      }

      // Set current room in game state
      await gameStateService.setCurrentRoom(roomId, room.difficulty);
      const state = await gameStateService.getGameState();
      setGameState(state);
      setCurrentRoom(room);
      setHintsUsed(state.hintsUsed || 0);

      // Load room-specific puzzles
      const allPuzzles = await puzzleService.getAll();
      const filteredPuzzles = allPuzzles.filter(puzzle => 
        room.puzzleIds.includes(puzzle.Id)
      );
      setRoomPuzzles(filteredPuzzles);
      
      if (!gameStarted.current) {
        gameStarted.current = true;
        toast.success(`Welcome to ${room.name}! Click on glowing objects to solve puzzles.`);
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
      toast.error('Failed to load game');
    } finally {
      setLoading(false);
    }
  };
// Check if all room puzzles are solved
    if (roomPuzzles.length > 0 && gameState.solvedPuzzles.length >= roomPuzzles.length) {
      gameState.isComplete = true;
    }

  const handlePuzzleClick = (puzzle) => {
    if (gameState?.solvedPuzzles.includes(puzzle.Id)) {
      toast.info('This puzzle has already been solved!');
      return;
    }
    
    setSelectedPuzzle(puzzle);
    setIsPaused(true);
  };

  const handlePuzzleSolve = async (puzzle) => {
    try {
      const updatedState = await gameStateService.solvePuzzle(puzzle.Id);
      setGameState(updatedState);
      
      // Add reward item if applicable
      if (puzzle.rewardItem) {
        await gameStateService.addToInventory(puzzle.rewardItem);
        const finalState = await gameStateService.getGameState();
        setGameState(finalState);
        
        const item = await itemService.getById(puzzle.rewardItem);
        if (item) {
          toast.success(`You found: ${item.name}!`);
        }
      }
      
      setSelectedPuzzle(null);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to solve puzzle:', error);
      toast.error('Failed to save puzzle progress');
    }
  };

  const handleUseHint = async () => {
    try {
      const updatedState = await gameStateService.useHint();
      setGameState(updatedState);
      setHintsUsed(updatedState.hintsUsed);
    } catch (error) {
      console.error('Failed to use hint:', error);
    }
  };

  const handleTimerUpdate = async (seconds) => {
    try {
      await gameStateService.updateTimer(seconds);
    } catch (error) {
      console.error('Failed to update timer:', error);
    }
  };

const handleRestartGame = async () => {
    try {
      setLoading(true);
      setShowVictory(false);
      setSelectedPuzzle(null);
      setSelectedItem(null);
      setIsPaused(false);
      setHintsUsed(0);
      gameStarted.current = false;
      
      const newState = await gameStateService.resetGame(currentRoom?.Id);
      setGameState(newState);
      
      toast.success('Game restarted! Good luck!');
    } catch (error) {
      console.error('Failed to restart game:', error);
      toast.error('Failed to restart game');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRooms = () => {
    navigate('/');
  };

  const handleItemSelect = (item) => {
    setSelectedItem(selectedItem?.Id === item.Id ? null : item);
  };

  const handleHotspotClick = (hotspot) => {
    // Handle item usage on hotspots
    if (selectedItem && selectedItem.usableOn?.includes(hotspot.id)) {
      toast.success(`Used ${selectedItem.name} on ${hotspot.id}!`);
      setSelectedItem(null);
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleClosePuzzle = () => {
    setSelectedPuzzle(null);
    setIsPaused(false);
  };

  const handleCloseVictory = () => {
    setShowVictory(false);
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary to-secondary flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon name="Loader" className="w-16 h-16 text-accent mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-display text-accent">Loading Cipher Chamber...</h2>
          <p className="text-surface-300">Preparing your escape room experience</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
    className="min-h-screen bg-gradient-to-br from-background via-primary to-secondary">
    {/* Game Header */}
    <motion.header
        className="bg-surface/20 border-b border-accent/30 p-4 backdrop-blur-sm"
        initial={{
            opacity: 0,
            y: -20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            duration: 0.5
        }}>
        <div
            className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
                <motion.div
                    className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center"
                    whileHover={{
                        scale: 1.05
                    }}>
                    <ApperIcon name="Lock" className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                    <h1 className="text-2xl font-display font-bold text-accent">
                        {currentRoom?.name || "Cipher Chamber"}
                    </h1>
                    <p className="text-sm text-surface-300">
                        {currentRoom?.difficulty || "Unknown"}Difficulty
                                      </p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Timer
                    elapsedTime={gameState?.elapsedTime || 0}
                    onUpdate={handleTimerUpdate}
                    isPaused={isPaused}
                    onTogglePause={handlePauseToggle} />
                <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center space-x-2 text-sm">
                        <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                        <span className="text-surface-300">
                            {gameState?.solvedPuzzles?.length || 0}/{roomPuzzles.length}Solved
                                          </span>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackToRooms}
                                className="flex items-center">
                                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />Rooms
                                              </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRestartGame}
                                className="flex items-center">
                                <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />Restart
                                              </Button>
                        </div>
                    </div>
                </div></div></div></motion.header>
    {/* Main Game Area */}
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)]">
        {/* Game Room */}
        <motion.div
            className="flex-1 p-4"
            initial={{
                opacity: 0,
                x: -20
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            transition={{
                duration: 0.5,
                delay: 0.2
            }}>
            <div className="h-full rounded-lg border border-accent/30 overflow-hidden">
                <div className="h-full rounded-lg border border-accent/30 overflow-hidden">
                    <GameRoom
                        gameState={gameState}
                        room={currentRoom}
                        puzzles={roomPuzzles}
                        onPuzzleClick={handlePuzzleClick}
                        onHotspotClick={handleHotspotClick} />
                </div></div></motion.div>
        {/* Inventory Sidebar */}
        <motion.div
            className="w-full lg:w-80 p-4"
            initial={{
                opacity: 0,
                x: 20
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            transition={{
                duration: 0.5,
                delay: 0.3
            }}>
            <GameInventory
                inventory={gameState?.inventory || []}
                onItemSelect={handleItemSelect}
                selectedItem={selectedItem}
                className="h-full" />
        </motion.div>
    </div>
    {/* Puzzle Modal */}
    <PuzzleModal
        puzzle={selectedPuzzle}
        isOpen={!!selectedPuzzle}
        onClose={handleClosePuzzle}
        onSolve={handlePuzzleSolve}
        onUseHint={handleUseHint}
        hintsUsed={hintsUsed} />
    {/* Victory Modal */}
    <VictoryModal
        isOpen={showVictory}
        onClose={handleCloseVictory}
        onRestart={handleRestartGame}
        onBackToRooms={handleBackToRooms}
        gameStats={gameState} />
    {/* Completion Indicator */}
    <AnimatePresence>
        {gameState?.isComplete && <motion.div
            className="fixed top-4 right-4 bg-success/20 border border-success rounded-lg p-4 z-30"
            initial={{
                opacity: 0,
                scale: 0.8,
                x: 100
            }}
            animate={{
                opacity: 1,
                scale: 1,
                x: 0
            }}
            exit={{
                opacity: 0,
                scale: 0.8,
                x: 100
            }}
            transition={{
                duration: 0.5
            }}>
            <div className="flex items-center space-x-2">
                <ApperIcon name="Trophy" className="w-6 h-6 text-success" />
                <span className="text-success font-semibold">All puzzles solved!
                                  </span>
            </div>
        </motion.div>}
    </AnimatePresence>
</div>
  );
};

export default Game;