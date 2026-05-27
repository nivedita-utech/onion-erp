import usePermission from '../../hooks/usePermission';

/**
 * PermissionGuard - Conditionally renders children based on user permission
 * @param {Object} props
 * @param {string} props.module - Module name
 * @param {string} props.action - Action: 'create', 'read', 'update', 'delete'
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.fallback] - Fallback content if no permission
 */
const PermissionGuard = ({ module, action, children, fallback = null }) => {
  const hasPermission = usePermission(module, action);

  if (!hasPermission) return fallback;

  return children;
};

export default PermissionGuard;
