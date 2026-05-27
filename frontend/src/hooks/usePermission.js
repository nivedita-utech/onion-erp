import useAuth from './useAuth';

/**
 * Custom hook to check user permissions
 * @param {string} module - Module name
 * @param {string} action - Action: 'create', 'read', 'update', 'delete'
 * @returns {boolean} Whether user has the permission
 */
const usePermission = (module, action) => {
  const { user } = useAuth();

  if (!user || !user.role) return false;

  // Super admin has all permissions
  if (user.role.name === 'super_admin') return true;

  const permissions = user.role.permissions || [];
  const modulePermission = permissions.find((p) => p.module === module);

  if (!modulePermission) return false;

  return !!modulePermission[action];
};

export default usePermission;
