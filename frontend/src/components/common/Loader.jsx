const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-white/10 border-t-primary-500 rounded-full animate-spin`} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <Loader size="xl" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

export default Loader;
