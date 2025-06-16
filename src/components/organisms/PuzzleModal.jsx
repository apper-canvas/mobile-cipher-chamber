import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import HintSystem from '@/components/molecules/HintSystem';
import { puzzleService } from '@/services';

const PuzzleModal = ({ 
  puzzle, 
  isOpen, 
  onClose, 
  onSolve, 
  onUseHint,
  hintsUsed,
  className = '' 
}) => {
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [shakeAnimation, setShakeAnimation] = useState(false);

  // Puzzle-specific states
  const [selectedOption, setSelectedOption] = useState(null);
  const [logicGrid, setLogicGrid] = useState({});
  const [foundNumbers, setFoundNumbers] = useState([]);
  const [hiddenLocations, setHiddenLocations] = useState([]);

  useEffect(() => {
    if (puzzle) {
      resetPuzzleState();
    }
  }, [puzzle]);

  const resetPuzzleState = () => {
    setSolution('');
    setSelectedOption(null);
    setLogicGrid({});
    setFoundNumbers([]);
    setError('');
    
    // Initialize hidden numbers puzzle
    if (puzzle?.type === 'hidden') {
      setHiddenLocations(puzzle.locations?.map(loc => ({ ...loc })) || []);
    }
  };

  const handleSubmit = async () => {
    if (!puzzle) return;

    setIsSubmitting(true);
    setError('');

    try {
      let submittedSolution = solution;
      
      // Handle different puzzle types
      switch (puzzle.type) {
        case 'pattern':
          submittedSolution = selectedOption;
          break;
        case 'logic':
          submittedSolution = logicGrid;
          break;
        case 'hidden':
          submittedSolution = foundNumbers.sort((a, b) => a - b).join('');
          break;
        default:
          submittedSolution = solution;
      }

      const isCorrect = await puzzleService.validateSolution(puzzle.Id, submittedSolution);

      if (isCorrect) {
        toast.success('Puzzle solved! Well done!');
        onSolve?.(puzzle);
        onClose?.();
      } else {
        setError('Incorrect solution. Try again!');
        setShakeAnimation(true);
        setTimeout(() => setShakeAnimation(false), 500);
        toast.error('Incorrect solution');
      }
    } catch (error) {
      setError('Failed to validate solution');
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHintRequest = () => {
    onUseHint?.();
  };

  const handleNumberClick = (location, index) => {
    if (location.found) return;
    
    const newLocations = [...hiddenLocations];
    newLocations[index] = { ...location, found: true };
    setHiddenLocations(newLocations);
    
    const newFoundNumbers = [...foundNumbers, location.number];
    setFoundNumbers(newFoundNumbers);
    
    if (newFoundNumbers.length === 4) {
      setSolution(newFoundNumbers.sort((a, b) => a - b).join(''));
    }
  };

  const renderPuzzleInterface = () => {
    if (!puzzle) return null;

    switch (puzzle.type) {
      case 'cipher':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-accent mb-2">Encrypted Message</h4>
              <div className="bg-surface/30 rounded-lg p-4 font-mono text-xl tracking-wider text-accent">
                {puzzle.cipherText}
              </div>
            </div>
            <Input
              label="Enter the decoded message"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Enter your answer..."
              className="text-center"
            />
          </div>
        );

      case 'pattern':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-accent mb-4">Complete the Sequence</h4>
              <div className="flex items-center justify-center space-x-2 mb-6">
                {puzzle.sequence?.map((symbolIndex, i) => (
                  <div key={i} className="w-12 h-12 bg-surface/30 rounded-lg flex items-center justify-center text-2xl text-accent">
                    {puzzle.symbols?.[symbolIndex]}
                  </div>
                ))}
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-2xl text-white border-2 border-accent border-dashed">
                  ?
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {puzzle.options?.map((optionIndex, i) => (
                <motion.button
                  key={i}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl transition-all duration-200 ${
                    selectedOption === optionIndex 
                      ? 'bg-accent text-white' 
                      : 'bg-surface/30 text-accent hover:bg-accent/20'
                  }`}
                  onClick={() => setSelectedOption(optionIndex)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {puzzle.symbols?.[optionIndex]}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'logic':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-accent">Clues:</h4>
              {puzzle.clues?.map((clue, i) => (
                <div key={i} className="bg-surface/20 rounded-lg p-3 text-sm text-surface-200">
                  {i + 1}. {clue}
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-accent">Match Keys to Locks:</h4>
              {puzzle.keys?.map((key, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <span className="w-20 text-surface-200 capitalize">{key}:</span>
                  <select
                    value={logicGrid[`key${i + 1}`] || ''}
                    onChange={(e) => setLogicGrid({...logicGrid, [`key${i + 1}`]: e.target.value})}
                    className="flex-1 bg-surface/50 border border-surface-600 rounded-md px-3 py-2 text-white focus:border-accent focus:outline-none"
                  >
                    <option value="">Select a lock...</option>
                    {puzzle.locks?.map((lock, j) => (
                      <option key={j} value={lock}>{lock}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hidden':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-accent mb-2">Find the Hidden Numbers</h4>
              <p className="text-sm text-surface-300">Click on the numbers when you spot them</p>
            </div>
            
            <div className="relative w-full h-64 bg-gradient-to-br from-surface/20 to-surface/40 rounded-lg border border-surface-600">
              {hiddenLocations.map((location, i) => (
                <motion.button
                  key={i}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    location.found 
                      ? 'bg-success text-white' 
                      : 'bg-accent/30 text-accent hover:bg-accent/50 hotspot-pulse'
                  }`}
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleNumberClick(location, i)}
                  disabled={location.found}
                  whileHover={location.found ? {} : { scale: 1.2 }}
                  whileTap={location.found ? {} : { scale: 0.9 }}
                >
                  {location.found ? '✓' : location.number}
                </motion.button>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-surface-300">
                Found: {foundNumbers.length}/4 numbers
              </p>
              {foundNumbers.length > 0 && (
                <p className="text-lg font-mono text-accent mt-2">
                  {foundNumbers.sort((a, b) => a - b).join('')}
                </p>
              )}
            </div>
          </div>
        );

      case 'riddle':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-accent mb-4">Solve the Riddle</h4>
              <div className="bg-surface/20 rounded-lg p-6 text-lg text-surface-200 leading-relaxed">
                "{puzzle.riddle}"
              </div>
            </div>
            <Input
              label="Your answer"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Enter your answer..."
              className="text-center"
            />
          </div>
        );

      default:
        return (
          <Input
            label="Solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Enter your answer..."
          />
        );
    }
  };

  const canSubmit = () => {
    switch (puzzle?.type) {
      case 'pattern':
        return selectedOption !== null;
      case 'logic':
        return Object.keys(logicGrid).length === 3;
      case 'hidden':
        return foundNumbers.length === 4;
      default:
        return solution.trim() !== '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && puzzle && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`bg-primary border-2 border-accent/30 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
                shakeAnimation ? 'animate-shake' : ''
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {puzzle.title}
                  </h2>
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-surface/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="X" className="w-6 h-6 text-surface-400" />
                  </motion.button>
                </div>

                <p className="text-surface-200 mb-6 leading-relaxed">
                  {puzzle.description}
                </p>

                {renderPuzzleInterface()}

                {error && (
                  <motion.div
                    className="mt-4 p-3 bg-error/20 border border-error/30 rounded-lg text-error text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                <div className="mt-6 pt-6 border-t border-surface-600">
                  <HintSystem
                    hints={puzzle.hints || []}
                    onUseHint={handleHintRequest}
                    hintsUsed={hintsUsed}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!canSubmit() || isSubmitting}
                  >
                    {isSubmitting ? 'Checking...' : 'Submit Solution'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PuzzleModal;