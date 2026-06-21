import { cn } from '../utils/helpers';

export default function Input({ 
  label, 
  error, 
  className, 
  type = 'text',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-espresso mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
          error 
            ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300' 
            : 'border-gray-200 bg-white text-espresso placeholder-taupe hover:border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
