import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PuzzleCard = ({ puzzle, onClick, isSolved, className = '' }) => {
  return (
    <motion.div
      className={`relative p-6 bg-surface/30 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
        isSolved 
          ? 'border-success bg-success/10' 
          : 'border-accent/50 hover:border-accent hotspot-pulse'
      } ${className}`}
      onClick={() => onClick?.(puzzle)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <ApperIcon 
            name={getPuzzleIcon(puzzle.type)} 
            className={`w-12 h-12 ${isSolved ? 'text-success' : 'text-accent'}`} 
          />
          {isSolved && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            {puzzle.title}
          </h3>
          <p className="text-sm text-surface-300 leading-relaxed">
            {puzzle.description}
          </p>
        </div>
        
        {!isSolved && (
          <motion.div
            className="mt-4 px-4 py-2 bg-accent/20 rounded-full text-accent text-sm font-medium"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to Solve
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const getPuzzleIcon = (type) => {
  const icons = {
    cipher: 'Lock',
    pattern: 'Puzzle',
    logic: 'Brain',
    hidden: 'Search',
    riddle: 'MessageSquare'
  };
  return icons[type] || 'HelpCircle';
};

export default PuzzleCard;