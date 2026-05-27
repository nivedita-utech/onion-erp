import { useForm } from 'react-hook-form';
import { HiOutlineMail } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    toast.success('Password reset link sent to your email');
    console.log('Reset password for:', data.email);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-lg mb-4">
          <HiOutlineMail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold font-display text-gray-100">Forgot Password</h1>
        <p className="text-gray-500 text-sm mt-2">Enter your email to receive a reset link</p>
      </div>

      <div className="glass-card p-8 border border-white/10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="your@email.com"
              className="input-field"
            />
            {errors.email && <p className="input-error">{errors.email.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full">Send Reset Link</button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/auth/login" className="text-sm text-primary-400 hover:text-primary-300">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
