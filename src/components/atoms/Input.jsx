import { motion } from 'framer-motion';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-200 mb-2">
          {label}
        </label>
      )}
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-surface/50 border rounded-md text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 ${
          error ? 'border-error focus:ring-error focus:border-error' : 'border-surface-600'
        }`}
        whileFocus={{ scale: 1.02 }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;