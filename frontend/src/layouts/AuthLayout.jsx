import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="w-full max-w-md">

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
