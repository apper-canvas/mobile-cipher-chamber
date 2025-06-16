import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HintSystem = ({ hints, onUseHint, hintsUsed, className = '' }) => {
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);

  const handleRequestHint = () => {
    const nextIndex = currentHintIndex + 1;
    if (nextIndex < hints.length) {
      setCurrentHintIndex(nextIndex);
      onUseHint?.();
    }
  };

  const canRequestHint = currentHintIndex < hints.length - 1;
  const currentHint = currentHintIndex >= 0 ? hints[currentHintIndex] : null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Lightbulb" className="w-5 h-5 text-warning" />
          <span className="text-sm text-surface-300">
            Hints Used: {hintsUsed}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRequestHint}
          disabled={!canRequestHint}
        >
          <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
          {currentHintIndex < 0 ? 'Get Hint' : 'Next Hint'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {currentHint && (
          <motion.div
            key={currentHintIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-warning/10 border border-warning/30 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-background">
                  {currentHintIndex + 1}
                </span>
              </div>
              <p className="text-sm text-surface-200 leading-relaxed">
                {currentHint}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!canRequestHint && hints.length > 0 && (
        <p className="text-xs text-surface-400 text-center">
          No more hints available for this puzzle
        </p>
      )}
    </div>
  );
};

export default HintSystem;