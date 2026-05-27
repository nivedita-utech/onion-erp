import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import { useCreateLeadMutation } from '../../api/leadsApi';
import toast from 'react-hot-toast';
import { 
  HiOutlineUser, HiOutlineMail, HiOutlinePhone, 
  HiOutlineGlobeAlt, HiOutlineLightningBolt, HiOutlineTag 
} from 'react-icons/hi';

const AddLeadModal = ({ isOpen, onClose }) => {
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      source: '',
      status: 'New'
    }
  });

  const onSubmit = async (data) => {
    try {
      await createLead(data).unwrap();
      toast.success('Lead created successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create lead');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Contact Name</label>
            <div className="relative group">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('name', { required: 'Name is required' })}
                className={`input-field pl-11 shadow-sm ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g. John Doe"
                autoFocus
              />
            </div>
            {errors.name && <p className="input-error">{errors.name.message}</p>}
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
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="input-error">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Phone Number</label>
            <div className="relative group">
              <HiOutlinePhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('phone')}
                className="input-field pl-11 shadow-sm"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Country</label>
            <div className="relative group">
              <HiOutlineGlobeAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register('country')}
                className="input-field pl-11 shadow-sm"
                placeholder="e.g. USA"
              />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Lead Source</label>
            <div className="relative group">
              <HiOutlineLightningBolt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <select
                {...register('source')}
                className="input-field pl-11 appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Trade Fair">Trade Fair</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="input-label ml-1">Initial Status</label>
            <div className="relative group">
              <HiOutlineTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <select
                {...register('status')}
                className="input-field pl-11 appearance-none cursor-pointer shadow-sm"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
              </select>
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
            {isCreating ? 'Creating...' : 'Create Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeadModal;
