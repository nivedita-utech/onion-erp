import { useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { HiOutlinePlus, HiTruck } from 'react-icons/hi';
import { useGetSalesOrdersQuery, useDispatchOrderMutation } from '../../api/salesApi';
import AddOrderModal from './AddOrderModal';
import toast from 'react-hot-toast';

const SalesOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetSalesOrdersQuery();

  const columns = [
    { header: 'Order No', accessor: 'orderNo' },
    { 
      header: 'Customer', 
      accessor: 'customer',
      render: (row) => row.customer?.name || '—'
    },
    { 
      header: 'Items', 
      accessor: 'items',
      render: (row) => row.items?.length || 0
    },
    { 
      header: 'Total', 
      accessor: 'totalAmount',
      render: (row) => {
        const subtotal = row.items?.reduce((acc, item) => acc + (item.amount || 0), 0) || 0;
        const total = subtotal + (row.gstAmount || 0) - (row.discount || 0);
        return `₹${total.toLocaleString()}`;
      }
    },
    { header: 'Invoice', accessor: 'invoiceNo', render: (row) => row.invoiceNo || '—' },
    { header: 'Payment', accessor: 'paymentStatus', render: (row) => <StatusBadge status={row.paymentStatus.toLowerCase()} /> },
  ];

  const [dispatchOrder] = useDispatchOrderMutation();

  const handleDispatch = async (id) => {
    try {
      await dispatchOrder(id).unwrap();
      toast.success('Order dispatched!');
    } catch (err) {}
  };

  const actionColumn = {
    header: 'Actions',
    render: (row) => (
      <div className="flex gap-2">
        {row.status !== 'Shipped' && row.status !== 'Delivered' && (
          <button onClick={() => handleDispatch(row._id)} className="p-1 text-primary-600 hover:bg-primary-50 rounded" title="Dispatch Order">
            <HiTruck className="w-5 h-5" />
          </button>
        )}
      </div>
    )
  };

  const tableData = useMemo(() => data?.data || [], [data]);

  return (
    <div className="page-container">
      <PageHeader
        title="Sales Orders"
        subtitle="Manage quotations, orders, and invoices"
        breadcrumbs={[{ label: 'Sales' }]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Order
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

      <AddOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default SalesOrders;
