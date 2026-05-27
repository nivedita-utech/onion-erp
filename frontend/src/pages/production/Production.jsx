import { useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { HiOutlinePlus, HiPlay, HiCheck } from 'react-icons/hi';
import { useGetBatchesQuery, useStartProductionMutation, useCompleteProductionMutation } from '../../api/productionApi';
import BatchModal from './BatchModal';
import toast from 'react-hot-toast';

const Production = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetBatchesQuery();

  const columns = [
    { header: 'Batch ID', accessor: 'batchId' },
    { 
      header: 'Product', 
      accessor: 'product',
      render: (row) => row.product?.name || '—'
    },
    { 
      header: 'Raw Material', 
      accessor: 'rawMaterialQty',
      render: (row) => `${row.rawMaterialQty || 0} kg`
    },
    { 
      header: 'Output', 
      accessor: 'outputQty',
      render: (row) => row.outputQty ? `${row.outputQty} kg` : '—'
    },
    { 
      header: 'Wastage', 
      accessor: 'wastage',
      render: (row) => row.wastage ? `${row.wastage}%` : '—'
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => <StatusBadge status={row.status.toLowerCase()} /> 
    },
  ];

  const [startProduction] = useStartProductionMutation();
  const [completeProduction] = useCompleteProductionMutation();

  const handleStart = async (id) => {
    try {
      await startProduction(id).unwrap();
      toast.success('Production started, material issued');
    } catch (err) {}
  };

  const handleComplete = async (id) => {
    const outputQty = prompt('Enter output quantity (kg):');
    if (!outputQty) return;
    try {
      await completeProduction({ id, outputQty: Number(outputQty), wastage: 5 }).unwrap();
      toast.success('Production completed, stock updated');
    } catch (err) {}
  };

  const actionColumn = {
    header: 'Actions',
    render: (row) => (
      <div className="flex gap-2">
        {row.status === 'Planned' && (
          <button onClick={() => handleStart(row._id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Start Production">
            <HiPlay className="w-5 h-5" />
          </button>
        )}
        {row.status === 'Ongoing' && (
          <button onClick={() => handleComplete(row._id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Complete Production">
            <HiCheck className="w-5 h-5" />
          </button>
        )}
      </div>
    )
  };

  const tableData = useMemo(() => data?.data || [], [data]);

  return (
    <div className="page-container">
      <PageHeader
        title="Production"
        subtitle="Manage production batches and stages"
        breadcrumbs={[{ label: 'Production' }]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Batch
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

      <BatchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Production;
