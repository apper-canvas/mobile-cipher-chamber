import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PuzzleCard from '@/components/molecules/PuzzleCard';
import { puzzleService } from '@/services';

const GameRoom = ({ 
  gameState, 
  onPuzzleClick, 
  onHotspotClick,
  className = '' 
}) => {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        const puzzleData = await puzzleService.getAll();
        setPuzzles(puzzleData);
      } catch (error) {
        console.error('Failed to load puzzles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzles();
  }, []);

  const hotspots = [
    { id: 'door', x: 85, y: 45, size: 'large', icon: 'DoorOpen' },
    { id: 'desk', x: 20, y: 65, size: 'medium', icon: 'Desk' },
    { id: 'bookshelf', x: 10, y: 25, size: 'medium', icon: 'BookOpen' },
    { id: 'painting', x: 50, y: 15, size: 'small', icon: 'Image' },
    { id: 'chest', x: 75, y: 80, size: 'medium', icon: 'Box' }
  ];

  const handleHotspotClick = (hotspot) => {
    // Find associated puzzle
    const associatedPuzzles = {
      'door': 5, // Final riddle
      'desk': 1, // Cipher
      'bookshelf': 2, // Pattern
      'painting': 4, // Hidden numbers
      'chest': 3  // Logic grid
    };

    const puzzleId = associatedPuzzles[hotspot.id];
    const puzzle = puzzles.find(p => p.Id === puzzleId);
    
    if (puzzle) {
      onPuzzleClick?.(puzzle);
    }
    
    onHotspotClick?.(hotspot);
  };

  const isPuzzleSolved = (puzzleId) => {
    return gameState.solvedPuzzles.includes(puzzleId);
  };

  const getHotspotSize = (size) => {
    const sizes = {
      small: 'w-8 h-8',
      medium: 'w-12 h-12',
      large: 'w-16 h-16'
    };
    return sizes[size] || sizes.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-accent">
          <ApperIcon name="Loader" className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full bg-gradient-to-br from-primary via-secondary to-surface overflow-hidden ${className}`}>
      {/* Room Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdG9uZSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj4KICAgICAgPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMGYzNDYwIiBvcGFjaXR5PSIwLjMiLz4KICAgICAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMWExYTJlIiBvcGFjaXR5PSIwLjIiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdG9uZSkiLz4KPC9zdmc+')] opacity-30"></div>
      
      {/* Atmospheric Lighting */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-surface/20 rounded-full blur-2xl"></div>
      
      {/* Interactive Hotspots */}
      {hotspots.map((hotspot) => {
        const associatedPuzzleId = {
          'door': 5, 'desk': 1, 'bookshelf': 2, 'painting': 4, 'chest': 3
        }[hotspot.id];
        
        const isSolved = isPuzzleSolved(associatedPuzzleId);
        
        return (
          <motion.div
            key={hotspot.id}
            className={`absolute cursor-pointer transition-all duration-200 ${getHotspotSize(hotspot.size)}`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleHotspotClick(hotspot)}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
              isSolved 
                ? 'bg-success/30 border-2 border-success shadow-success/50' 
                : 'bg-accent/20 border-2 border-accent/50 hotspot-pulse'
            }`}>
              <ApperIcon 
                name={hotspot.icon} 
                className={`w-6 h-6 ${isSolved ? 'text-success' : 'text-accent'}`} 
              />
              
              {isSolved && (
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-success rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ApperIcon name="Check" className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
            
            {/* Tooltip */}
            {hoveredHotspot === hotspot.id && (
              <motion.div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-background/90 text-white text-sm rounded-md whitespace-nowrap border border-accent/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {hotspot.id.charAt(0).toUpperCase() + hotspot.id.slice(1)}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/90"></div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
      
      {/* Room Exit Door */}
      {gameState.isComplete && (
        <motion.div
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-32 bg-gradient-to-b from-warning to-success rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name="DoorOpen" className="w-12 h-12 text-white" />
          </div>
          <p className="text-center text-success text-sm mt-2 font-semibold">
            ESCAPE!
          </p>
        </motion.div>
      )}
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default GameRoom;