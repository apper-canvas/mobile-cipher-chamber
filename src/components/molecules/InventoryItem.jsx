import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const InventoryItem = ({ item, onClick, isSelected, className = '' }) => {
  return (
    <motion.div
      className={`relative p-3 bg-surface/50 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-accent glow-accent' 
          : 'border-surface-600 hover:border-accent/50'
      } ${className}`}
      onClick={() => onClick?.(item)}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="flex flex-col items-center space-y-2">
        <ApperIcon 
          name={item.icon} 
          className="w-8 h-8 text-accent" 
        />
        <span className="text-xs text-center text-surface-200 font-medium">
          {item.name}
        </span>
      </div>
      
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default InventoryItem;