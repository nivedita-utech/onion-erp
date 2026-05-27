import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import { useCreateProductMutation } from '../../api/productsApi';
import toast from 'react-hot-toast';
import { 
  HiOutlineCube, HiOutlineHashtag, HiOutlineTag, 
  HiOutlineAcademicCap, HiOutlineScale, HiOutlineCurrencyRupee 
} from 'react-icons/hi';

const AddProductModal = ({ isOpen, onClose }) => {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      grade: '',
      unit: 'kg',
      domesticPrice: '',
      packaging: '',
      usdPrice: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        packagingTypes: data.packaging ? data.packaging.split(',').map(s => s.trim()) : [],
        exportPrices: data.usdPrice ? [{ currency: 'USD', price: Number(data.usdPrice) }] : []
      };
      
      await createProduct(formattedData).unwrap();
      toast.success('Product added successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add product');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Product Name</label>
            <div className="relative group">
              <HiOutlineCube className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('name', { required: 'Product name is required' })}
                className={`input-field pl-11 shadow-sm ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g. Onion Powder Premium"
                autoFocus
              />
            </div>
            {errors.name && <p className="input-error">{errors.name.message}</p>}
          </div>

          {/* SKU */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">SKU (Unique Code)</label>
            <div className="relative group">
              <HiOutlineHashtag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('sku', { required: 'SKU is required' })}
                className={`input-field pl-11 shadow-sm ${errors.sku ? 'border-red-500' : ''}`}
                placeholder="e.g. OP-PREM-100"
              />
            </div>
            {errors.sku && <p className="input-error">{errors.sku.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Category</label>
            <div className="relative group">
              <HiOutlineTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <select
                {...register('category')}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="Powder">Powder</option>
                <option value="Flakes">Flakes</option>
                <option value="Granules">Granules</option>
                <option value="Minced">Minced</option>
              </select>
            </div>
          </div>

          {/* Grade */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Quality Grade</label>
            <div className="relative group">
              <HiOutlineAcademicCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <select
                {...register('grade')}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                <option value="">Select Grade</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="Premium">Premium</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Unit */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Base Unit</label>
            <div className="relative group">
              <HiOutlineScale className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <select
                {...register('unit')}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                <option value="kg">kilogram (kg)</option>
                <option value="gm">gram (gm)</option>
                <option value="ton">ton (t)</option>
              </select>
            </div>
          </div>

          {/* Domestic Price */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Domestic Price (₹)</label>
            <div className="relative group">
              <HiOutlineCurrencyRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="number"
                {...register('domesticPrice', { valueAsNumber: true })}
                className="input-field pl-11 shadow-sm"
                placeholder="Rate per unit"
              />
            </div>
          </div>

          {/* Packaging Types */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Packaging Types</label>
            <div className="relative group">
              <HiOutlineCube className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('packaging')}
                className="input-field pl-11 shadow-sm"
                placeholder="e.g. Vacuum Bag, HDPE Bag"
              />
            </div>
            <p className="text-[10px] text-gray-500 ml-1">Separate with commas</p>
          </div>

          {/* Export Price (USD) */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Export Price (USD $)</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium group-focus-within:text-primary-500 transition-colors">$</span>
              <input
                type="number"
                step="0.01"
                {...register('usdPrice')}
                className="input-field pl-8 shadow-sm"
                placeholder="USD Rate per unit"
              />
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
            {isCreating ? 'Saving...' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
