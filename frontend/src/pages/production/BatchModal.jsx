import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import { useCreateBatchMutation } from '../../api/productionApi';
import { useGetProductsQuery } from '../../api/productsApi';
import toast from 'react-hot-toast';
import { HiOutlineCube, HiOutlineScale, HiOutlineIdentification } from 'react-icons/hi';

const BatchModal = ({ isOpen, onClose }) => {
  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      batchId: '',
      product: '',
      rawMaterialQty: '',
      outputQty: '',
      wastage: '',
      status: 'Planned'
    }
  });

  // Auto-generate Batch ID when modal opens
  useEffect(() => {
    if (isOpen) {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      setValue('batchId', `PROD-${date}-${random}`);
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data) => {
    try {
      await createBatch(data).unwrap();
      toast.success('Production batch created successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create batch');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Production Batch"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          {/* Batch ID */}
          <div className="space-y-1.5">
            <label className="input-label">Batch ID</label>
            <div className="relative">
              <HiOutlineIdentification className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                {...register('batchId', { required: 'Batch ID is required' })}
                className="input-field pl-11 bg-gray-50/50 dark:bg-black/20"
                readOnly
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-1.5">
            <label className="input-label">Product</label>
            <div className="relative">
              <HiOutlineCube className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
              <select
                {...register('product', { required: 'Product selection is required' })}
                className={`input-field pl-11 appearance-none cursor-pointer ${errors.product ? 'border-red-500' : ''}`}
                disabled={isLoadingProducts}
              >
                <option value="">Select a product</option>
                {productsData?.data?.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>
            {errors.product && <p className="input-error">{errors.product.message}</p>}
          </div>

          {/* Raw Material Quantity */}
          <div className="space-y-1.5">
            <label className="input-label">Raw Material Quantity (kg)</label>
            <div className="relative">
              <HiOutlineScale className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="number"
                step="0.01"
                {...register('rawMaterialQty', { 
                  required: 'Quantity is required',
                  min: { value: 0.1, message: 'Quantity must be greater than 0' }
                })}
                className={`input-field pl-11 ${errors.rawMaterialQty ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
            </div>
            {errors.rawMaterialQty && <p className="input-error">{errors.rawMaterialQty.message}</p>}
          </div>

          {/* Output and Wastage Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Output Quantity */}
            <div className="space-y-1.5">
              <label className="input-label">Output Quantity (kg)</label>
              <div className="relative">
                <HiOutlineScale className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  {...register('outputQty')}
                  className="input-field pl-11"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Wastage */}
            <div className="space-y-1.5">
              <label className="input-label">Wastage (%)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('wastage')}
                  className="input-field pl-8"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
            {isCreating ? 'Creating...' : 'Create Batch'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BatchModal;
