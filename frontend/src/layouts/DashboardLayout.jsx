import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { useGetMeQuery } from '../api/authApi';
import { updateUser } from '../store/slices/authSlice';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  // Fetch latest user profile on load/refresh
  const { data: userData, isSuccess } = useGetMeQuery(null, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 300000, // Optional: Poll every 5 mins
  });

  // Sync Redux store with latest DB permissions
  useEffect(() => {
    if (isSuccess && userData?.data) {
      dispatch(updateUser(userData.data));
    }
  }, [isSuccess, userData, dispatch]);

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-mesh" style={{ backgroundColor: 'var(--bg-body)' }}>
      {/* Sidebar */}

      <Sidebar
        isOpen={sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Navbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
