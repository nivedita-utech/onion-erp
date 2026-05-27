import { useState, useEffect } from 'react';
import { useGetRolesQuery, useUpdateRoleMutation, useCreateRoleMutation } from '../../../api/rolesApi';
import { useGetMeQuery } from '../../../api/authApi';
import toast from 'react-hot-toast';
import { 
  HiOutlineSave, HiOutlineRefresh, HiOutlineCheckCircle, 
  HiOutlineLockClosed, HiOutlinePlus, HiOutlineX 
} from 'react-icons/hi';

const modules = [
  'dashboard', 'leads', 'customers', 'products', 'inventory', 
  'production', 'purchase', 'sales', 'export', 'accounts', 
  'reports', 'employees', 'notifications', 'settings'
];

const PermissionMatrix = () => {
  const { data: rolesData, isLoading: rolesLoading, refetch: refetchRoles } = useGetRolesQuery({ limit: 100 });
  const { refetch: refetchMe } = useGetMeQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  
  const [localPermissions, setLocalPermissions] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // New role modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    if (rolesData?.data) {
      const perms = {};
      rolesData.data.forEach(role => {
        perms[role._id] = {
          name: role.name,
          permissions: role.permissions || []
        };
      });
      setLocalPermissions(perms);
    }
  }, [rolesData]);

  const handleToggle = (roleId, module) => {
    setLocalPermissions(prev => {
      const rolePerms = [...(prev[roleId].permissions || [])];
      let modulePerm = rolePerms.find(p => p.module === module);
      
      const isCurrentlyEnabled = modulePerm?.read || false;
      const newValue = !isCurrentlyEnabled;

      if (!modulePerm) {
        modulePerm = { module, create: newValue, read: newValue, update: newValue, delete: newValue };
        rolePerms.push(modulePerm);
      } else {
        modulePerm = { ...modulePerm, create: newValue, read: newValue, update: newValue, delete: newValue };
      }

      const updatedRolePerms = rolePerms.map(p => p.module === module ? modulePerm : p);

      setHasChanges(true);
      return {
        ...prev,
        [roleId]: {
          ...prev[roleId],
          permissions: updatedRolePerms
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      const promises = Object.entries(localPermissions).map(([id, data]) => 
        updateRole({ id, permissions: data.permissions }).unwrap()
      );
      
      await Promise.all(promises);
      toast.success('Permissions updated successfully!');
      
      await refetchMe();
      setHasChanges(false);
      refetchRoles();
    } catch (err) {
      toast.error('Failed to update permissions: ' + (err?.data?.message || 'Unknown error'));
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return toast.error('Please enter a role name');
    
    try {
      const defaultPerms = modules.map(mod => ({
        module: mod,
        create: false,
        read: false,
        update: false,
        delete: false
      }));

      await createRole({ 
        name: newRoleName, 
        permissions: defaultPerms 
      }).unwrap();

      toast.success(`Role "${newRoleName}" created successfully!`);
      setNewRoleName('');
      setIsAddModalOpen(false);
      refetchRoles();
    } catch (err) {
      toast.error('Failed to create role: ' + (err?.data?.message || 'Unknown error'));
    }
  };

  if (rolesLoading) return <div className="animate-pulse flex items-center justify-center h-64 text-gray-500">Loading matrix...</div>;

  const roleIds = Object.keys(localPermissions).filter(id => localPermissions[id].name !== 'admin');

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-wrap justify-between items-center bg-gray-50 dark:bg-surface-200/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700/30 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
            <HiOutlineLockClosed className="text-primary-500" />
            Permissions Matrix
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure system access dynamically</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-secondary h-10 px-4 flex items-center gap-2 border-primary-500/30 text-primary-600 dark:text-primary-400 bg-primary-500/5 hover:bg-primary-500/10"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Role
          </button>
          <button
            onClick={() => { refetchRoles(); setHasChanges(false); }}
            className="btn-secondary h-10 px-4 flex items-center gap-2 border-gray-300 dark:border-gray-600"
          >
            <HiOutlineRefresh className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isUpdating}
            className={`btn-primary h-10 px-6 flex items-center gap-2 ${!hasChanges ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          >
            <HiOutlineSave className="w-4 h-4" />
            {isUpdating ? 'Saving...' : 'Save & Sync Sidebar'}
          </button>
        </div>
      </div>

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h4 className="text-xl font-bold font-display text-gray-900 dark:text-white">Create New Role</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateRole} className="p-6 space-y-4">
              <div>
                <label className="input-label">Role Name</label>
                <input 
                  autoFocus
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Regional Manager" 
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
                <p className="mt-2 text-xs text-gray-500">This role will be created with restricted access to all modules by default.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isCreating} className="btn-primary flex-1">
                  {isCreating ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-surface-100 shadow-xl transition-colors">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 dark:bg-surface-300/50 border-b border-gray-200 dark:border-gray-700/50">
              <th className="p-3 bg-gray-50 dark:bg-surface-300 z-20 w-32 md:w-48 text-gray-600 dark:text-gray-300 font-bold border-r border-gray-200 dark:border-gray-700/50 uppercase tracking-wider text-[10px]">
                MODULE NAME
              </th>
              {roleIds.map(roleId => (
                <th key={roleId} className="p-2 text-center border-r border-gray-200 dark:border-gray-700/30">
                  <span 
                    className="capitalize text-[9px] leading-tight tracking-tight text-primary-600 dark:text-primary-400 font-bold block overflow-hidden" 
                    title={localPermissions[roleId].name}
                  >
                    {localPermissions[roleId].name === 'super_admin' ? (
                      <span className="text-secondary-600 dark:text-secondary-400">Admin</span>
                    ) : (
                      localPermissions[roleId].name.replace('_', ' ').split(' ').map((word, i) => (
                        <span key={`${word}-${i}`} className="block">{word}</span>
                      ))
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {modules.map(mod => (
              <tr key={mod} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                <td className="p-4 sticky left-0 bg-white dark:bg-surface-100 z-10 border-r border-gray-200 dark:border-gray-700/50 group-hover:bg-gray-50 dark:group-hover:bg-surface-200 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 capitalize">{mod}</span>
                  </div>
                </td>
                {roleIds.map(roleId => {
                  const perm = localPermissions[roleId].permissions.find(p => p.module === mod) || {
                    read: false
                  };
                  const isEnabled = perm.read;
                  return (
                    <td key={roleId} className="p-4 border-r border-gray-100 dark:border-gray-700/30">
                      <div className="flex items-center justify-center">
                        <button
                          disabled={localPermissions[roleId].name === 'super_admin'}
                          onClick={() => handleToggle(roleId, mod)}
                          className={`w-11 h-5 rounded-full transition-all duration-300 relative ${
                            isEnabled ? 'bg-primary-500 shadow-glow ring-2 ring-primary-500/20' : 'bg-gray-300 dark:bg-gray-700'
                          } ${localPermissions[roleId].name === 'super_admin' ? 'opacity-70 grayscale cursor-not-allowed' : ''}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                            isEnabled ? 'left-6' : 'left-0.5'
                          }`} />
                          {localPermissions[roleId].name === 'super_admin' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <HiOutlineLockClosed className="w-2.5 h-2.5 text-primary-600" />
                            </div>
                          )}
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hasChanges && (
        <div className="bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30 p-4 rounded-xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <HiOutlineCheckCircle className="text-primary-500 dark:text-primary-400 w-5 h-5" />
            <p className="text-sm text-primary-800 dark:text-primary-300 font-medium">
              Permissions modified. Click <span className="font-bold underline decoration-primary-500/30 decoration-2">Save & Sync Sidebar</span> to push updates to all active users.
            </p>
          </div>
          <button onClick={handleSave} className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 underline underline-offset-4 decoration-2">
            APPLY CHANGES
          </button>
        </div>
      )}
    </div>
  );
};

export default PermissionMatrix;
