import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import InventoryItem from '@/components/molecules/InventoryItem';
import { itemService } from '@/services';

const GameInventory = ({ 
  inventory, 
  onItemSelect, 
  selectedItem,
  className = '' 
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      if (inventory.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const itemData = await itemService.getByIds(inventory);
        setItems(itemData);
      } catch (error) {
        console.error('Failed to load inventory items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [inventory]);

  if (loading) {
    return (
      <div className={`bg-surface/30 rounded-lg border border-accent/30 p-4 ${className}`}>
        <div className="flex items-center space-x-2 mb-3">
          <ApperIcon name="Package" className="w-5 h-5 text-accent" />
          <span className="text-white font-semibold">Inventory</span>
        </div>
        <div className="animate-pulse">
          <div className="h-16 bg-surface/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-surface/30 rounded-lg border border-accent/30 p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <ApperIcon name="Package" className="w-5 h-5 text-accent" />
        <span className="text-white font-semibold">Inventory</span>
        <span className="text-sm text-surface-300">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Package" className="w-12 h-12 text-surface-600 mx-auto mb-2" />
          <p className="text-surface-400 text-sm">No items collected yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item, index) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <InventoryItem
                item={item}
                onClick={onItemSelect}
                isSelected={selectedItem?.Id === item.Id}
              />
            </motion.div>
          ))}
        </div>
      )}

      {selectedItem && (
        <motion.div
          className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/30"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-semibold text-accent mb-1">{selectedItem.name}</h4>
          <p className="text-sm text-surface-300">{selectedItem.description}</p>
          {selectedItem.usableOn && selectedItem.usableOn.length > 0 && (
            <p className="text-xs text-surface-400 mt-2">
              Can be used on: {selectedItem.usableOn.join(', ')}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameInventory;