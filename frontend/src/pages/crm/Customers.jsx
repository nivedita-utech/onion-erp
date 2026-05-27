import { useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { HiOutlinePlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useGetCustomersQuery } from '../../api/customersApi';
import AddCustomerModal from './AddCustomerModal';

const Customers = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetCustomersQuery();

  const columns = [
    { header: 'Company Name', accessor: 'name' },
    { header: 'Contact Person', accessor: 'contactPerson' },
    { header: 'Country', accessor: 'country' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Credit Limit', 
      accessor: 'creditLimit',
      render: (row) => row.creditLimit ? `₹ ${row.creditLimit.toLocaleString()}` : '—'
    },
    { 
      header: 'Orders', 
      accessor: 'orders',
      render: (row) => row.orderHistory?.length || 0
    },
  ];

  const tableData = useMemo(() => data?.data || [], [data]);

  return (
    <div className="page-container">
      <PageHeader
        title="Customers"
        subtitle="Manage your customer database"
        breadcrumbs={[{ label: 'CRM', path: '/customers' }, { label: 'Customers' }]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Customer
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        onRowClick={(row) => navigate(`/customers/${row._id}`)}
        searchable
        sortable
        pagination
      />

      <AddCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Customers;
