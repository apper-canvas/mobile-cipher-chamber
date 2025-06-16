import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Timer = ({ elapsedTime, onUpdate, isPaused, onTogglePause }) => {
  const [time, setTime] = useState(elapsedTime || 0);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onUpdate?.(newTime);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaused, onUpdate]);

  useEffect(() => {
    setTime(elapsedTime || 0);
  }, [elapsedTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="flex items-center space-x-2 bg-surface/50 rounded-lg px-4 py-2 border border-accent/30"
      whileHover={{ glow: true }}
    >
      <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
      <span className="font-mono text-lg font-semibold text-white">
        {formatTime(time)}
      </span>
      <motion.button
        onClick={onTogglePause}
        className="ml-2 p-1 rounded hover:bg-accent/20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ApperIcon 
          name={isPaused ? "Play" : "Pause"} 
          className="w-4 h-4 text-accent" 
        />
      </motion.button>
    </motion.div>
  );
};

export default Timer;