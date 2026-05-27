import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import CustomBarChart from '../../components/charts/BarChart';
import { HiOutlineDownload, HiOutlineArrowLeft } from 'react-icons/hi';

const reportTypes = [
  { id: 'sales', name: 'Sales Report', description: 'Revenue, orders, and customer-wise sales breakdown', color: 'primary' },
  { id: 'purchase', name: 'Purchase Report', description: 'Supplier-wise purchase breakdown and payment status', color: 'blue' },
  { id: 'inventory', name: 'Inventory Report', description: 'Current stock snapshot and movement history', color: 'green' },
  { id: 'export', name: 'Export Performance', description: 'Currency-wise, country-wise export analysis', color: 'purple' },
  { id: 'pnl', name: 'Profit & Loss', description: 'Monthly revenue, COGS, expenses, and net profit', color: 'yellow' },
];

const colorMap = {
  primary: 'from-primary-500/20 to-primary-600/5 border-primary-500/20 text-primary-400',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
  green: 'from-green-500/20 to-green-600/5 border-green-500/20 text-green-400',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
};

// Mock data for Sales Report
const salesReportData = [
  { id: '1', date: '2024-03-01', customer: 'Dubai Spices LLC', amount: '₹12,50,000', status: 'Paid' },
  { id: '2', date: '2024-03-05', customer: 'US Food Imports', amount: '₹8,40,000', status: 'Pending' },
  { id: '3', date: '2024-03-12', customer: 'SpiceWorld EU', amount: '₹15,20,000', status: 'Paid' },
];
const salesColumns = [
  { header: 'Date', accessor: 'date' },
  { header: 'Customer', accessor: 'customer' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Status', accessor: 'status' },
];
const salesChartData = [
  { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 }, { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 7000 }, { name: 'Fri', sales: 6000 }, { name: 'Sat', sales: 2000 },
];

const Reports = () => {
  const [activeReport, setActiveReport] = useState(null);

  const renderActiveReport = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setActiveReport(null)}
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to Reports
        </button>

        <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4 border-l-4 border-primary-500">
          <div>
            <h2 className="text-xl font-bold text-gray-100">{activeReport.name}</h2>
            <p className="text-sm text-gray-400">{activeReport.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <input type="date" className="input-field w-40" />
            <span className="text-gray-500">to</span>
            <input type="date" className="input-field w-40" />
            <button className="btn-primary flex items-center gap-2">
              <HiOutlineDownload className="w-4 h-4" /> PDF Export
            </button>
          </div>
        </div>

        {/* Dummy Layout for the selected report */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-base font-semibold mb-4 text-gray-300">Detailed Records</h3>
            <DataTable 
              columns={salesColumns} 
              data={salesReportData} 
              searchable={false} 
              pagination={false} 
            />
          </div>
          <div className="lg:col-span-1">
            <CustomBarChart
              title="Overview Chart"
              data={salesChartData}
              xKey="name"
              bars={[{ dataKey: 'sales', color: '#ee7a0e', name: 'Value' }]}
              height={320}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate, view, and download comprehensive business reports"
        breadcrumbs={[{ label: 'Reports' }]}
      />

      {activeReport ? (
        renderActiveReport()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              onClick={() => setActiveReport(report)}
              className={`glass-card p-6 bg-gradient-to-br ${colorMap[report.color]} border cursor-pointer hover:shadow-glow transition-all duration-300 group`}
            >
              <h3 className="text-lg font-semibold font-display text-gray-100 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{report.description}</p>
              <button className="btn-secondary w-full flex items-center justify-center gap-2 text-sm group-hover:border-primary-500/50">
                View Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
