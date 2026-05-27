import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineHome, HiOutlineUserGroup, HiOutlineUsers,
  HiOutlineCube, HiOutlineClipboardList, HiOutlineCog,
  HiOutlineTruck, HiOutlineDocumentText, HiOutlineChartBar,
  HiOutlineCurrencyDollar, HiOutlineGlobe, HiOutlineBeaker,
  HiOutlineShoppingCart, HiOutlineBell, HiOutlineX,
  HiOutlineChevronLeft, HiOutlineCollection,
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HiOutlineHome, module: 'dashboard' },
  { name: 'Leads', path: '/leads', icon: HiOutlineUserGroup, module: 'leads' },
  { name: 'Customers', path: '/customers', icon: HiOutlineUsers, module: 'customers' },
  { name: 'Products', path: '/products', icon: HiOutlineCube, module: 'products' },
  { name: 'Inventory', path: '/inventory', icon: HiOutlineCollection, module: 'inventory' },
  { name: 'Production', path: '/production', icon: HiOutlineBeaker, module: 'production' },
  { name: 'Purchase', path: '/purchase', icon: HiOutlineShoppingCart, module: 'purchase' },
  { name: 'Sales', path: '/sales', icon: HiOutlineDocumentText, module: 'sales' },
  { name: 'Export', path: '/export', icon: HiOutlineGlobe, module: 'export' },
  { name: 'Accounts', path: '/accounts', icon: HiOutlineCurrencyDollar, module: 'accounts' },
  { name: 'Reports', path: '/reports', icon: HiOutlineChartBar, module: 'reports' },
  { name: 'Employees', path: '/employees', icon: HiOutlineClipboardList, module: 'employees' },
  { name: 'Quality', path: '/quality', icon: HiOutlineBeaker, module: 'quality' },
  { name: 'Notifications', path: '/notifications', icon: HiOutlineBell, module: 'notifications' },
  { name: 'Settings', path: '/settings', icon: HiOutlineCog, module: 'settings' },
];

const Sidebar = ({ isOpen, mobileOpen, onClose, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  const hasModuleAccess = (module) => {
    if (!module) return true;
    if (!user?.role?.permissions) return false;
    
    // Check if module exists in permissions and has 'read' set to true
    return user.role.permissions.some(
      (p) => p.module === module && p.read === true
    );
  };

  const filteredMenu = menuItems.filter((item) => hasModuleAccess(item.module));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 border-r transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
        style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <HiOutlineTruck className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-bold font-display text-gradient">OnionERP</h1>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-primary-500 transition-colors"
          >
            <HiOutlineChevronLeft className={`w-4 h-4 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-500 border-l-2 border-primary-500 font-semibold'
                    : 'text-gray-500 hover:text-primary-500 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={!isOpen ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary-500' : 'group-hover:text-primary-500'}`} />
                {isOpen && <span className="animate-fade-in">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        {isOpen && user && (
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-main)' }}>{user.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user.role?.name?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full z-50 w-72 border-r transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <HiOutlineTruck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold font-display text-gradient">OnionERP</h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-500 border-l-2 border-primary-500 font-semibold'
                    : 'text-gray-500 hover:text-primary-500 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-500' : ''}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

    </>
  );
};

export default Sidebar;
