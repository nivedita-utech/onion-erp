import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { HiOutlineCog, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineOfficeBuilding, HiOutlineClipboardList } from 'react-icons/hi';
import DataTable from '../../components/common/DataTable';
import PermissionMatrix from './components/PermissionMatrix';

const tabs = [
  { id: 'company', label: 'Company Profile', icon: HiOutlineOfficeBuilding },
  { id: 'users', label: 'User Management', icon: HiOutlineUserGroup },
  { id: 'roles', label: 'Roles & Permissions', icon: HiOutlineShieldCheck },
  { id: 'audit', label: 'Audit Logs', icon: HiOutlineClipboardList },
  { id: 'general', label: 'General Settings', icon: HiOutlineCog },
];

const mockAuditLogs = [
  { id: '1', date: '2024-03-12 14:30', user: 'Admin User', action: 'CREATE', module: 'SalesOrder', details: 'Created SO-2024-004' },
  { id: '2', date: '2024-03-12 11:20', user: 'Manager John', action: 'UPDATE', module: 'Inventory', details: 'Updated stock for OP-PREM-100' },
  { id: '3', date: '2024-03-11 09:15', user: 'Admin User', action: 'LOGIN', module: 'Auth', details: 'User logged in' },
];

const auditColumns = [
  { header: 'Date/Time', accessor: 'date' },
  { header: 'User', accessor: 'user' },
  { header: 'Action', accessor: 'action' },
  { header: 'Module', accessor: 'module' },
  { header: 'Details', accessor: 'details' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');

  return (
    <div className="page-container">
      <PageHeader
        title="Settings"
        subtitle="Configure your system preferences"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {/* Settings Tabs */}
      <div className="bg-gray-100/50 dark:bg-surface-200/50 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-gray-200 dark:border-gray-700/30 backdrop-blur-sm mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-primary-400 shadow-md ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="glass-card p-6">
        {activeTab === 'company' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Company Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Company Name</label>
                <input type="text" className="input-field" defaultValue="OnionERP Exports Pvt. Ltd." />
              </div>
              <div>
                <label className="input-label">GST Number</label>
                <input type="text" className="input-field" placeholder="27AABCU9603R1ZM" />
              </div>
              <div>
                <label className="input-label">IEC Code</label>
                <input type="text" className="input-field" placeholder="0310000000" />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input type="email" className="input-field" defaultValue="info@onionerp.com" />
              </div>
              <div className="md:col-span-2">
                <label className="input-label">Address</label>
                <textarea className="input-field" rows={3} defaultValue="123, Industrial Area, Nashik, Maharashtra 422001, India" />
              </div>
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <p className="text-gray-500 text-sm">User management interface will be integrated with the Users API.</p>
          </div>
        )}

        {activeTab === 'roles' && (
          <PermissionMatrix />
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Audit Logs</h3>
            <div className="flex flex-wrap gap-4 items-end bg-surface-200 p-4 rounded-xl border border-gray-600/30">
               <div>
                  <label className="input-label text-xs">User</label>
                  <select className="input-field w-40 text-sm py-1.5"><option>All Users</option></select>
               </div>
               <div>
                  <label className="input-label text-xs">Module</label>
                  <select className="input-field w-40 text-sm py-1.5"><option>All Modules</option></select>
               </div>
               <div>
                  <label className="input-label text-xs">From Date</label>
                  <input type="date" className="input-field w-40 text-sm py-1.5" />
               </div>
               <div>
                  <label className="input-label text-xs">To Date</label>
                  <input type="date" className="input-field w-40 text-sm py-1.5" />
               </div>
               <button className="btn-secondary text-sm h-[34px] border-gray-600">Filter</button>
            </div>
            
            <DataTable columns={auditColumns} data={mockAuditLogs} searchable pagination />
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="input-label">Default Currency</label>
                <select className="input-field w-48">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="input-label">Low Stock Threshold</label>
                <input type="number" className="input-field w-48" defaultValue={100} />
              </div>
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
