import { useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { HiOutlinePlus } from 'react-icons/hi';
import { useGetProductsQuery } from '../../api/productsApi';
import AddProductModal from './AddProductModal';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetProductsQuery();

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Category', accessor: 'category' },
    { header: 'Grade', accessor: 'grade' },
    { header: 'Unit', accessor: 'unit' },
    { 
      header: 'Packaging', 
      accessor: 'packagingTypes',
      render: (row) => row.packagingTypes?.join(', ') || '—'
    },
    { 
      header: 'Domestic Price', 
      accessor: 'domesticPrice',
      render: (row) => row.domesticPrice ? `₹${row.domesticPrice}/${row.unit || 'kg'}` : '—'
    },
    { 
      header: 'Export (USD)', 
      accessor: 'exportPrices',
      render: (row) => {
        const usdPrice = row.exportPrices?.find(p => p.currency === 'USD')?.price;
        return usdPrice ? `$${usdPrice}/${row.unit || 'kg'}` : '—';
      }
    },
  ];

  const tableData = useMemo(() => data?.data || [], [data]);

  return (
    <div className="page-container">
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        breadcrumbs={[{ label: 'Products' }]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Product
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

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Products;
