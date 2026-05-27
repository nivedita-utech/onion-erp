import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import { useCreateExportOrderMutation } from '../../api/exportApi';
import { useGetCustomersQuery } from '../../api/customersApi';
import { useGetProductsQuery } from '../../api/productsApi';
import toast from 'react-hot-toast';
import { 
  HiOutlinePlus, HiOutlineTrash, HiOutlineGlobe, 
  HiOutlineUser, HiOutlineHashtag, HiOutlineCurrencyDollar,
  HiOutlineTruck, HiOutlineDocumentText
} from 'react-icons/hi';

const AddExportOrderModal = ({ isOpen, onClose }) => {
  const [createExport, { isLoading: isCreating }] = useCreateExportOrderMutation();
  const { data: customersData } = useGetCustomersQuery();
  const { data: productsData } = useGetProductsQuery();

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      orderNo: '',
      customer: '',
      currency: 'USD',
      shippingTerm: 'FOB',
      containerNo: '',
      blNo: '',
      items: [{ product: '', quantity: 1, rate: 0, amount: 0 }],
      shipmentStatus: 'Booked'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchedItems = useWatch({ control, name: "items" });
  const watchedCurrency = useWatch({ control, name: "currency" });

  const total = useMemo(() => {
    return watchedItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  }, [watchedItems]);

  const currencySymbol = useMemo(() => {
    switch (watchedCurrency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  }, [watchedCurrency]);

  // Update item amount when qty/rate change
  useEffect(() => {
    watchedItems.forEach((item, index) => {
      const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      if (amount !== item.amount) {
        setValue(`items.${index}.amount`, amount);
      }
    });
  }, [watchedItems, setValue]);

  // Auto-generate EXP No
  useEffect(() => {
    if (isOpen) {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      setValue('orderNo', `EXP-${date}-${random}`);
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data) => {
    try {
      await createExport(data).unwrap();
      toast.success('Export Order created successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create export order');
    }
  };

  const handleProductChange = (index, productId) => {
    const product = productsData?.data?.find(p => p._id === productId);
    if (product) {
      // For export, we might use exportPrices but for now domesticPrice is safe default
      const exportPrice = product.exportPrices?.find(p => p.currency === watchedCurrency)?.price;
      setValue(`items.${index}.rate`, exportPrice || product.domesticPrice || 0);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Export Order"
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order No */}
          <div className="space-y-1.5">
            <label className="input-label">Export Order No</label>
            <div className="relative">
              <HiOutlineHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                {...register('orderNo', { required: 'Order number is required' })}
                className="input-field pl-11 bg-gray-50/50 dark:bg-black/20"
                readOnly
              />
            </div>
          </div>

          {/* Customer Selection */}
          <div className="space-y-1.5">
            <label className="input-label">International Customer</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
              <select
                {...register('customer', { required: 'Customer is required' })}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                <option value="">Select a customer</option>
                {customersData?.data?.map((customer) => (
                  <option key={customer._id} value={customer._id}>{customer.name} ({customer.country})</option>
                ))}
              </select>
            </div>
            {errors.customer && <p className="input-error">{errors.customer.message}</p>}
          </div>

          {/* Currency */}
          <div className="space-y-1.5">
            <label className="input-label">Currency</label>
            <div className="relative">
              <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <select
                {...register('currency')}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Shipping Term */}
          <div className="space-y-1.5">
            <label className="input-label">Shipping Term (Incoterm)</label>
            <div className="relative">
              <HiOutlineGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <select
                {...register('shippingTerm')}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                <option value="FOB">FOB</option>
                <option value="CIF">CIF</option>
                <option value="EXW">EXW</option>
                <option value="CNF">CNF</option>
              </select>
            </div>
          </div>

          {/* Container No */}
          <div className="space-y-1.5">
            <label className="input-label">Container Number</label>
            <div className="relative">
              <HiOutlineTruck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                {...register('containerNo')}
                className="input-field pl-11"
                placeholder="e.g. TCNU1234567"
              />
            </div>
          </div>

          {/* BL No */}
          <div className="space-y-1.5">
            <label className="input-label">B/L Number</label>
            <div className="relative">
              <HiOutlineDocumentText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                {...register('blNo')}
                className="input-field pl-11"
                placeholder="e.g. BL987654321"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              Shipment Items
            </h4>
            <button
              type="button"
              onClick={() => append({ product: '', quantity: 1, rate: 0, amount: 0 })}
              className="btn-secondary py-1 text-xs flex items-center gap-1"
            >
              <HiOutlinePlus className="w-3 h-3" />
              Add Product
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-3 items-end bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-white/10 group">
                <div className="col-span-4 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Product</label>
                  <select
                    {...register(`items.${index}.product`, { required: true })}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="input-field bg-transparent border-white/20 h-10 py-1"
                  >
                    <option value="">Select Product</option>
                    {productsData?.data?.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Qty</label>
                  <input
                    type="number"
                    {...register(`items.${index}.quantity`, { required: true })}
                    className="input-field bg-transparent border-white/20 h-10 py-1"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Rate ({currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.rate`, { required: true })}
                    className="input-field bg-transparent border-white/20 h-10 py-1 text-right"
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currencySymbol}</span>
                    <input
                      type="number"
                      {...register(`items.${index}.amount`)}
                      className="input-field bg-transparent border-white/20 h-10 py-1 pl-6 text-right"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-span-1 flex justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex justify-between items-center border-t border-white/5 pt-6">
          <div className="text-gray-500 text-sm">
            Please verify all international documentation before submitting.
          </div>
          <div className="glass-card px-6 py-3 bg-primary-500/5">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-400">Total Shipment Value:</span>
              <span className="text-2xl font-bold text-primary-400 uppercase">
                {currencySymbol}{total.toLocaleString()} {watchedCurrency}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            submit="true"
            className="btn-primary shadow-glow disabled:opacity-50"
            disabled={isCreating}
          >
            {isCreating ? 'Creating Order...' : 'Create Export Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExportOrderModal;
