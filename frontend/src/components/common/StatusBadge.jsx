import { getStatusColor } from '../../utils/helpers';

const StatusBadge = ({ status, className = '' }) => {
  const colorClass = getStatusColor(status);
  const displayText = status?.replace(/_/g, ' ') || 'Unknown';

  return (
    <span className={`${colorClass} capitalize ${className}`}>
      {displayText}
    </span>
  );
};

export default StatusBadge;
