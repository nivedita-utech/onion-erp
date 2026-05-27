import { useState, useMemo, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { 
  HiOutlinePlus, HiOutlineTrash, HiOutlineCalculator, 
  HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineCalendar
} from 'react-icons/hi';
import { 
  useGetPurchaseOrdersQuery, 
  useCreatePurchaseOrderMutation, 
  useGetSuppliersQuery 
} from '../../api/purchaseApi';
import { useGetProductsQuery } from '../../api/productsApi';

const PurchaseOrders = () => {
  const { data: posData, isLoading } = useGetPurchaseOrdersQuery();
  const { data: suppliersData } = useGetSuppliersQuery();
  const { data: productsData } = useGetProductsQuery();
  const [createPO] = useCreatePurchaseOrderMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    poNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    supplier: '',
    items: [{ product: '', quantity: 1, rate: 0, amount: 0 }]
  });

  // Calculate total whenever items change
  const totalAmount = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [formData.items]);

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = Number(newItems[index].quantity) * Number(newItems[index].rate);
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddPO = async (e) => {
    e.preventDefault();
    if (!formData.supplier) return;
    try {
      await createPO(formData).unwrap();
      setIsAddModalOpen(false);
      setFormData({
        poNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier: '',
        items: [{ product: '', quantity: 1, rate: 0, amount: 0 }]
      });
    } catch (err) {
      // Error handled by apiSlice
    }
  };

  const columns = [
    { header: 'PO Number', accessor: 'poNumber' },
    { 
      header: 'Supplier', 
      accessor: 'supplier',
      render: (row) => row.supplier || '—'
    },
    { 
      header: 'Items', 
      accessor: 'items',
      render: (row) => row.items?.length || 0
    },
    { 
      header: 'Total', 
      accessor: 'id',
      render: (row) => {
        const total = row.items?.reduce((sum, item) => sum + (item.amount || 0), 0);
        return `₹${total?.toLocaleString() || 0}`;
      }
    },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Payment', accessor: 'paymentStatus', render: (row) => <StatusBadge status={row.paymentStatus} /> },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage inventory procurement and supplier relations"
        breadcrumbs={[{ label: 'Purchase' }]}
        actions={
          <button 
            className="btn-primary flex items-center gap-2 shadow-glow"
            onClick={() => setIsAddModalOpen(true)}
          >
            <HiOutlinePlus className="w-4 h-4" />
            Create PO
          </button>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={posData?.data || []} 
        loading={isLoading}
        searchable 
        sortable 
        pagination 
      />

      {/* Create PO Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          title="Create New Purchase Order"
          size="xl"
          onClose={() => setIsAddModalOpen(false)}
        >
          <form onSubmit={handleAddPO} className="space-y-8 py-2">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
              <div className="space-y-1.5">
                <label className="input-label ml-1">Supplier Name</label>
                <div className="relative group">
                  <HiOutlineUserGroup className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors z-10" />
                  <input
                    type="text"
                    className="input-field pl-11 shadow-sm"
                    placeholder="Enter Supplier Name"
                    value={formData.supplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="input-label ml-1">PO Number</label>
                <div className="relative group">
                  <HiOutlineClipboardList className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    className="input-field pl-11 border-dashed"
                    value={formData.poNumber}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary-400">Order Items</h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-primary-500 hover:text-primary-400 flex items-center gap-1 transition-colors"
                >
                  <HiOutlinePlus className="w-4 h-4" /> Add Row
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="col-span-5 space-y-1">
                      {index === 0 && <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Product</label>}
                      <select
                        className="input-field shadow-sm"
                        value={item.product}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        required
                      >
                        <option value="">Select Item</option>
                        {productsData?.data?.map(p => (
                          <option key={p._id} value={p.name}>{p.name} ({p.grade})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      {index === 0 && <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Qty</label>}
                      <input
                        type="number"
                        className="input-field shadow-sm"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        required
                        min="1"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      {index === 0 && <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Rate</label>}
                      <input
                        type="number"
                        className="input-field shadow-sm"
                        placeholder="0.00"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                        required
                        min="0"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      {index === 0 && <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Amount</label>}
                      <div className="input-field bg-white/5 border-white/5 text-gray-400">
                        {item.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="col-span-1 pb-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className={`p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all ${
                          formData.items.length === 1 ? 'opacity-0 cursor-default' : ''
                        }`}
                        disabled={formData.items.length === 1}
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-gray-500">
                <HiOutlineCalculator className="w-6 h-6" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Total Valuation</p>
                  <p className="text-xl font-bold font-display text-white">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-ghost"
                >
                  Discard
                </button>
                <button type="submit" className="btn-primary px-8 shadow-glow">
                  Finalize Order
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PurchaseOrders;
