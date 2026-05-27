import { HiArrowSmUp, HiArrowSmDown } from 'react-icons/hi';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', className = '' }) => {
  const colorMap = {
    primary: 'from-primary-500/20 to-primary-600/5 text-primary-400 border-primary-500/20',
    green: 'from-green-500/20 to-green-600/5 text-green-400 border-green-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
    yellow: 'from-yellow-500/20 to-yellow-600/5 text-yellow-400 border-yellow-500/20',
    red: 'from-red-500/20 to-red-600/5 text-red-400 border-red-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
  };

  const iconBgMap = {
    primary: 'bg-primary-500/10 text-primary-400',
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    red: 'bg-red-500/10 text-red-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <div className={`stat-card bg-gradient-to-br ${colorMap[color]} border ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold font-display text-gray-100">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <HiArrowSmUp className="w-4 h-4 text-green-400" />
              ) : (
                <HiArrowSmDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trendValue}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
