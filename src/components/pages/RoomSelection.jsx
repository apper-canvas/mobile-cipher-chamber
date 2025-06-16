import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { roomService, gameStateService } from '@/services';

const RoomSelection = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomData = await roomService.getAll();
      setRooms(roomData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = selectedDifficulty === 'All' 
    ? rooms 
    : rooms.filter(room => room.difficulty === selectedDifficulty);

  const handleRoomSelect = async (room) => {
    try {
      // Reset game state for new room
      await gameStateService.resetGame(room.Id);
      
      toast.success(`Entering ${room.name}...`);
      navigate(`/game?room=${room.Id}`);
    } catch (error) {
      console.error('Failed to start game:', error);
      toast.error('Failed to start game');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'text-success border-success bg-success/10',
      Medium: 'text-warning border-warning bg-warning/10',
      Hard: 'text-error border-error bg-error/10'
    };
    return colors[difficulty] || 'text-surface-300 border-surface-300 bg-surface/10';
  };

  const getDifficultyIcon = (difficulty) => {
    const icons = {
      Easy: 'Smile',
      Medium: 'Meh',
      Hard: 'Frown'
    };
    return icons[difficulty] || 'Help';
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
          <h2 className="text-2xl font-display text-accent">Loading Rooms...</h2>
          <p className="text-surface-300">Preparing your escape room experience</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary to-secondary">
      {/* Header */}
      <motion.header
        className="bg-surface/20 border-b border-accent/30 p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <ApperIcon name="Lock" className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-accent mb-2">
            Cipher Chamber
          </h1>
          <p className="text-lg text-surface-300 mb-6">
            Choose your escape room challenge
          </p>
          
          {/* Difficulty Filter */}
          <div className="flex justify-center space-x-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className="flex items-center"
              >
                {difficulty !== 'All' && (
                  <ApperIcon 
                    name={getDifficultyIcon(difficulty)} 
                    className="w-4 h-4 mr-2" 
                  />
                )}
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Room Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDifficulty}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.Id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredRoom(room.Id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => handleRoomSelect(room)}
              >
                <div className="bg-surface/30 backdrop-blur-sm border border-accent/30 rounded-lg p-6 h-full transition-all duration-300 group-hover:border-accent/60 group-hover:bg-surface/40">
                  {/* Room Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold text-accent mb-2">
                        {room.name}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(room.difficulty)}`}>
                        <ApperIcon 
                          name={getDifficultyIcon(room.difficulty)} 
                          className="w-3 h-3 mr-1" 
                        />
                        {room.difficulty}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="DoorOpen" className="w-6 h-6 text-accent" />
                    </div>
                  </div>

                  {/* Room Description */}
                  <p className="text-surface-300 text-sm mb-4 line-clamp-3">
                    {room.description}
                  </p>

                  {/* Room Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-400 flex items-center">
                        <ApperIcon name="Puzzle" className="w-4 h-4 mr-2" />
                        Puzzles
                      </span>
                      <span className="text-accent font-semibold">
                        {room.puzzleIds.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-400 flex items-center">
                        <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                        Duration
                      </span>
                      <span className="text-accent font-semibold">
                        {room.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors"
                  >
                    <ApperIcon name="Play" className="w-4 h-4 mr-2" />
                    Enter Room
                  </Button>

                  {/* Hover Effect */}
                  <AnimatePresence>
                    {hoveredRoom === room.Id && (
                      <motion.div
                        className="absolute inset-0 bg-accent/5 rounded-lg pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredRooms.length === 0 && !loading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ApperIcon name="Search" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-xl font-display text-surface-300 mb-2">
              No rooms found
            </h3>
            <p className="text-surface-400">
              Try selecting a different difficulty level
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 bg-accent/20 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default RoomSelection;