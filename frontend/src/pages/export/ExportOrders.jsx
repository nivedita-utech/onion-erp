import { useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { HiOutlinePlus } from 'react-icons/hi';
import { useGetExportOrdersQuery } from '../../api/exportApi';
import AddExportOrderModal from './AddExportOrderModal';

const ExportOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetExportOrdersQuery();

  const columns = [
    { header: 'Order No', accessor: 'orderNo' },
    { 
      header: 'Customer', 
      accessor: 'customer',
      render: (row) => row.customer?.name || '—'
    },
    { 
      header: 'Country', 
      accessor: 'customer',
      render: (row) => row.customer?.country || '—'
    },
    { header: 'Currency', accessor: 'currency' },
    { 
      header: 'Total', 
      accessor: 'totalAmount',
      render: (row) => {
        const total = row.items?.reduce((acc, item) => acc + (item.amount || 0), 0) || 0;
        const symbol = row.currency === 'EUR' ? '€' : row.currency === 'GBP' ? '£' : '$';
        return `${symbol}${total.toLocaleString()}`;
      }
    },
    { header: 'Container', accessor: 'containerNo', render: (row) => row.containerNo || '—' },
    { header: 'Shipment', accessor: 'shipmentStatus', render: (row) => <StatusBadge status={row.shipmentStatus.toLowerCase()} /> },
  ];

  const tableData = useMemo(() => data?.data || [], [data]);

  return (
    <div className="page-container">
      <PageHeader
        title="Export Orders"
        subtitle="Manage international shipments and documentation"
        breadcrumbs={[{ label: 'Export' }]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Export Order
          </button>
        }
      />
      <DataTable 
        columns={columns} 
        data={tableData} 
        loading={isLoading}
        searchable 
        sortable 
        pagination 
      />

      <AddExportOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default ExportOrders;
