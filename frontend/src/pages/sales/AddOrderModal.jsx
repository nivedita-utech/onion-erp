import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import { useCreateSalesOrderMutation } from '../../api/salesApi';
import { useGetCustomersQuery } from '../../api/customersApi';
import { useGetProductsQuery } from '../../api/productsApi';
import toast from 'react-hot-toast';
import { 
  HiOutlinePlus, HiOutlineTrash, HiOutlineShoppingCart, 
  HiOutlineUser, HiOutlineHashtag, HiOutlineCurrencyRupee,
  HiOutlineTag
} from 'react-icons/hi';

const AddOrderModal = ({ isOpen, onClose }) => {
  const [createOrder, { isLoading: isCreating }] = useCreateSalesOrderMutation();
  const { data: customersData } = useGetCustomersQuery();
  const { data: productsData } = useGetProductsQuery();

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      orderNo: '',
      invoiceNo: '',
      customer: '',
      items: [{ product: '', quantity: 1, rate: 0, amount: 0 }],
      discount: 0,
      gstAmount: 0,
      status: 'Quotation'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Watch items for real-time calculations
  const watchedItems = useWatch({ control, name: "items" });
  const watchedDiscount = useWatch({ control, name: "discount" });

  const subtotal = useMemo(() => {
    return watchedItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  }, [watchedItems]);

  const gst = useMemo(() => subtotal * 0.18, [subtotal]);
  const total = useMemo(() => subtotal + gst - (Number(watchedDiscount) || 0), [subtotal, gst, watchedDiscount]);

  // Update item amount when qty/rate change
  useEffect(() => {
    watchedItems.forEach((item, index) => {
      const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      if (amount !== item.amount) {
        setValue(`items.${index}.amount`, amount);
      }
    });
  }, [watchedItems, setValue]);

  // Auto-generate Order No
  useEffect(() => {
    if (isOpen) {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      setValue('orderNo', `SO-${date}-${random}`);
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        gstAmount: gst,
        totalAmount: total
      };
      await createOrder(payload).unwrap();
      toast.success('Sales Order created successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create order');
    }
  };

  const handleProductChange = (index, productId) => {
    const product = productsData?.data?.find(p => p._id === productId);
    if (product) {
      setValue(`items.${index}.rate`, product.domesticPrice || 0);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Sales Order"
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order No */}
          <div className="space-y-1.5">
            <label className="input-label">Order Number</label>
            <div className="relative">
              <HiOutlineHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                {...register('orderNo', { required: 'Order number is required' })}
                className="input-field pl-11 bg-gray-50/50 dark:bg-black/20"
                readOnly
              />
            </div>
          </div>

          {/* Invoice No */}
          <div className="space-y-1.5">
            <label className="input-label">Invoice Number (Optional)</label>
            <div className="relative">
              <HiOutlineHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                {...register('invoiceNo')}
                className="input-field pl-11"
                placeholder="e.g. INV-2024-001"
              />
            </div>
          </div>

          {/* Customer Selection */}
          <div className="space-y-1.5">
            <label className="input-label">Customer</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
              <select
                {...register('customer', { required: 'Customer is required' })}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                <option value="">Select a customer</option>
                {customersData?.data?.map((customer) => (
                  <option key={customer._id} value={customer._id}>{customer.name}</option>
                ))}
              </select>
            </div>
            {errors.customer && <p className="input-error">{errors.customer.message}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <HiOutlineShoppingCart className="w-5 h-5 text-primary-500" />
              Order Items
            </h4>
            <button
              type="button"
              onClick={() => append({ product: '', quantity: 1, rate: 0, amount: 0 })}
              className="btn-secondary py-1 text-xs flex items-center gap-1"
            >
              <HiOutlinePlus className="w-3 h-3" />
              Add Item
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
                    {...register(`items.${index}.quantity`, { required: true, valueAsNumber: true })}
                    className="input-field bg-transparent border-white/20 h-10 py-1"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Rate</label>
                  <input
                    type="number"
                    {...register(`items.${index}.rate`, { required: true, valueAsNumber: true })}
                    className="input-field bg-transparent border-white/20 h-10 py-1 text-right"
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Amount</label>
                  <div className="relative">
                    <HiOutlineCurrencyRupee className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="number"
                      {...register(`items.${index}.amount`, { valueAsNumber: true })}
                      className="input-field bg-transparent border-white/20 h-10 py-1 pl-7 text-right"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-span-1 flex justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30"
                    disabled={fields.length === 1}
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Summary Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-t border-white/5 pt-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="input-label">Discount Amount (₹)</label>
              <div className="relative w-48">
                <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  {...register('discount', { valueAsNumber: true })}
                  className="input-field pl-11"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-4 space-y-3 bg-primary-500/5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">GST (18%)</span>
              <span className="font-semibold">₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-red-400">
              <span>Discount</span>
              <span>- ₹{Number(watchedDiscount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-2 text-primary-400">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary shadow-glow disabled:opacity-50"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Sales Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrderModal;
