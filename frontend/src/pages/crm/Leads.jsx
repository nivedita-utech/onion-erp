import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { HiOutlinePlus, HiCheckCircle } from 'react-icons/hi';
import { useGetLeadsQuery, useConvertLeadMutation } from '../../api/leadsApi';
import toast from 'react-hot-toast';
import AddLeadModal from './AddLeadModal';

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Country', accessor: 'country' },
  { header: 'Source', accessor: 'source' },
  { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
  { header: 'Assigned To', accessor: (row) => row.assignedTo?.name || 'Unassigned' },
];

const Leads = () => {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data, isLoading } = useGetLeadsQuery(params);
  const [convertLead] = useConvertLeadMutation();

  const handleConvert = async (id) => {
    try {
      await convertLead(id).unwrap();
      toast.success('Successfully converted to customer');
    } catch (err) {
      // Error handled by apiSlice
    }
  };

  const actionColumn = {
    header: 'Actions',
    render: (row) => (
      <div className="flex gap-2">
        {!row.convertedToCustomer && (
          <button 
            onClick={() => handleConvert(row._id)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Convert to Customer"
          >
            <HiCheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    )
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Leads"
        subtitle="Manage your sales pipeline"
        breadcrumbs={[{ label: 'CRM', path: '/leads' }, { label: 'Leads' }]}
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Lead
          </button>
        }
      />
      <DataTable 
        columns={[...columns, actionColumn]} 
        data={data?.data || []} 
        loading={isLoading}
        searchable 
        sortable 
        pagination
        onPageChange={(page) => setParams(prev => ({ ...prev, page }))}
      />

      <AddLeadModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default Leads;
