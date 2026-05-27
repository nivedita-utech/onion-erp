import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useGetStockQuery } from '../../api/inventoryApi';

const columns = [
  { header: 'Batch ID', accessor: 'batchId' },
  { header: 'Product', accessor: (row) => row.product?.name || '—' },
  { header: 'Quantity', accessor: (row) => `${row.quantity || 0} ${row.product?.unit || 'kg'}` },
  { header: 'Warehouse', accessor: 'warehouse' },
  { header: 'Expiry Date', accessor: (row) => row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : '—' },
  { header: 'Status', accessor: (row) => row.quantity > 100 ? 'Active' : 'Low Stock', render: (row) => (
    <StatusBadge status={row.quantity > 100 ? 'active' : 'warn'} />
  )},
];

const Inventory = () => {
  const { data, isLoading } = useGetStockQuery();

  return (
    <div className="page-container">
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and batch details"
        breadcrumbs={[{ label: 'Inventory' }]}
      />
      <DataTable 
        columns={columns} 
        data={data?.data || []} 
        loading={isLoading}
        searchable 
        sortable 
        pagination 
      />
    </div>
  );
};

export default Inventory;
