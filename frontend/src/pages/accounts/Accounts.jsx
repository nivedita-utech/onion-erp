import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { HiOutlineCurrencyDollar, HiOutlineCash, HiOutlineExclamation } from 'react-icons/hi';

const sampleReceivables = [
  { _id: '1', customer: 'Dubai Spices LLC', invoiceNo: 'INV-001', amount: '₹3,20,000', dueDate: '2024-02-15', aging: '0-30 days', status: 'pending' },
  { _id: '2', customer: 'US Food Imports', invoiceNo: 'INV-002', amount: '$5,200', dueDate: '2024-01-20', aging: '31-60 days', status: 'overdue' },
  { _id: '3', customer: 'SpiceWorld EU', invoiceNo: 'INV-003', amount: '€4,100', dueDate: '2024-03-01', aging: '0-30 days', status: 'pending' },
];

const columns = [
  { header: 'Customer', accessor: 'customer' },
  { header: 'Invoice', accessor: 'invoiceNo' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Due Date', accessor: 'dueDate' },
  { header: 'Aging', accessor: 'aging' },
  { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
];

const Accounts = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Accounts"
        subtitle="Manage receivables, payables, and expenses"
        breadcrumbs={[{ label: 'Accounts' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Receivables" value="₹12,40,000" icon={HiOutlineCurrencyDollar} color="blue" />
        <StatCard title="Total Payables" value="₹5,80,000" icon={HiOutlineCash} color="red" />
        <StatCard title="Overdue Payments" value="4" icon={HiOutlineExclamation} color="yellow" />
      </div>

      {/* Tabs placeholder */}
      <div className="flex gap-2 border-b border-white/5 pb-0">
        <button className="px-4 py-2 text-sm font-medium text-primary-400 border-b-2 border-primary-500">Receivables</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-300">Payables</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-300">Expenses</button>
      </div>

      <DataTable columns={columns} data={sampleReceivables} searchable sortable pagination />
    </div>
  );
};

export default Accounts;
