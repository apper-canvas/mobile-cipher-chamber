import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const VictoryModal = ({ 
  isOpen, 
  onClose, 
  onRestart, 
  gameStats,
  className = '' 
}) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = (time, hints) => {
    if (hints === 0 && time < 600) return 'Master Detective';
    if (hints <= 2 && time < 900) return 'Skilled Investigator';
    if (hints <= 5 && time < 1200) return 'Competent Solver';
    return 'Persistent Explorer';
  };

  const getStarRating = (time, hints) => {
    if (hints === 0 && time < 600) return 3;
    if (hints <= 2 && time < 900) return 2;
    return 1;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary via-secondary to-surface border-2 border-success rounded-lg shadow-2xl max-w-lg w-full p-8 text-center"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {/* Victory Animation */}
              <motion.div
                className="mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <ApperIcon name="Trophy" className="w-12 h-12 text-white" />
                  {/* Sparkle effects */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-warning rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        rotate: `${i * 45}deg`,
                        transformOrigin: '0 0'
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        x: [0, 30, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl font-display font-bold text-success mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                ESCAPED!
              </motion.h1>

              <motion.p
                className="text-xl text-surface-200 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                You successfully escaped the Cipher Chamber!
              </motion.p>

              {/* Star Rating */}
              <motion.div
                className="flex justify-center space-x-1 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ 
                      opacity: i < getStarRating(gameStats?.elapsedTime || 0, gameStats?.hintsUsed || 0) ? 1 : 0.3,
                      rotate: 0 
                    }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <ApperIcon name="Star" className="w-8 h-8 text-warning fill-current" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="text-lg font-semibold text-accent mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {getPerformanceRating(gameStats?.elapsedTime || 0, gameStats?.hintsUsed || 0)}
              </motion.div>

              {/* Game Statistics */}
              <motion.div
                className="bg-surface/20 rounded-lg p-4 mb-6 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-surface-300">Completion Time:</span>
                  <span className="text-white font-mono font-semibold">
                    {formatTime(gameStats?.elapsedTime || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-300">Puzzles Solved:</span>
                  <span className="text-success font-semibold">
                    {gameStats?.solvedPuzzles?.length || 0}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-300">Hints Used:</span>
                  <span className="text-warning font-semibold">
                    {gameStats?.hintsUsed || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-300">Items Collected:</span>
                  <span className="text-info font-semibold">
                    {gameStats?.inventory?.length || 0}
                  </span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Button
                  variant="primary"
                  onClick={onRestart}
                  className="flex items-center justify-center"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="flex items-center justify-center"
                >
                  <ApperIcon name="X" className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VictoryModal;