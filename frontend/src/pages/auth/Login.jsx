import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useLoginMutation } from '../../api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold font-display text-gradient">OnionERP</h1>
        <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
      </div>

      {/* Login Form */}
      <div className="glass-card p-8 border border-white/10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="input-label">Email Address</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
                placeholder="admin@onionerp.com"
                className="input-field pl-10"
              />
            </div>
            {errors.email && <p className="input-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="input-error">{errors.password.message}</p>}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-surface-200 text-primary-500 focus:ring-primary-500/30" />
              <span className="text-sm text-gray-400">Remember me</span>
            </label>
            <a href="/auth/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader size="sm" /> : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-primary-500/5 border border-primary-500/10 rounded-lg">
          <p className="text-xs text-gray-400 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Email: <span className="text-primary-400">admin@onionerp.com</span></p>
          <p className="text-xs text-gray-500">Password: <span className="text-primary-400">admin123</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
