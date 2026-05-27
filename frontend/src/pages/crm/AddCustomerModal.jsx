import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import { useCreateCustomerMutation } from '../../api/customersApi';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineGlobeAlt, HiOutlineBriefcase, HiOutlineCurrencyRupee, HiOutlineMap } from 'react-icons/hi';

const AddCustomerModal = ({ isOpen, onClose }) => {
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      country: '',
      creditLimit: '',
      billingAddress: '',
      paymentTerms: 'Net 30'
    }
  });

  const onSubmit = async (data) => {
    try {
      await createCustomer(data).unwrap();
      toast.success('Customer added successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add customer');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Company Name</label>
            <div className="relative group">
              <HiOutlineBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('name', { required: 'Company name is required' })}
                className={`input-field pl-11 shadow-sm ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g. Dubai Spices LLC"
                autoFocus
              />
            </div>
            {errors.name && <p className="input-error">{errors.name.message}</p>}
          </div>

          {/* Contact Person */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Contact Person</label>
            <div className="relative group">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('contactPerson')}
                className="input-field pl-11 shadow-sm"
                placeholder="e.g. Ahmed Al-Rashid"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Email Address</label>
            <div className="relative group">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="email"
                {...register('email', { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={`input-field pl-11 shadow-sm ${errors.email ? 'border-red-500' : ''}`}
                placeholder="ahmed@dubaispices.ae"
              />
            </div>
            {errors.email && <p className="input-error">{errors.email.message}</p>}
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Country</label>
            <div className="relative group">
              <HiOutlineGlobeAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('country')}
                className="input-field pl-11 shadow-sm"
                placeholder="e.g. UAE"
              />
            </div>
          </div>

          {/* Credit Limit */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Credit Limit</label>
            <div className="relative group">
              <HiOutlineCurrencyRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="number"
                {...register('creditLimit', { valueAsNumber: true })}
                className="input-field pl-11 shadow-sm"
                placeholder="Amount in base currency"
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Payment Terms</label>
            <select
              {...register('paymentTerms')}
              className="input-field cursor-pointer"
            >
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Advance">Advance</option>
            </select>
          </div>

          {/* Billing Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="input-label ml-1">Billing Address</label>
            <div className="relative group">
              <HiOutlineMap className="absolute left-3.5 top-3 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <textarea
                {...register('billingAddress')}
                className="input-field pl-11 min-h-[80px] py-3 resize-none shadow-sm"
                placeholder="Complete billing address..."
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
            {isCreating ? 'Adding...' : 'Add Customer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
