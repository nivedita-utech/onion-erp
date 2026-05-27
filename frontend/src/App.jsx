import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './components/common/PrivateRoute';

// Auth pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard
import Overview from './pages/dashboard/Overview';

// CRM
import Leads from './pages/crm/Leads';
import Customers from './pages/crm/Customers';
import CustomerDetail from './pages/crm/CustomerDetail';

// Modules
import Products from './pages/products/Products';
import Inventory from './pages/inventory/Inventory';
import Production from './pages/production/Production';
import PurchaseOrders from './pages/purchase/PurchaseOrders';
import SalesOrders from './pages/sales/SalesOrders';
import ExportOrders from './pages/export/ExportOrders';
import Accounts from './pages/accounts/Accounts';
import Reports from './pages/reports/Reports';
import Employees from './pages/employees/Employees';
import Quality from './pages/quality/Quality';
import Settings from './pages/settings/Settings';
import Notifications from './pages/notifications/Notifications';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/production" element={<Production />} />
          <Route path="/purchase" element={<PurchaseOrders />} />
          <Route path="/sales" element={<SalesOrders />} />
          <Route path="/export" element={<ExportOrders />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
