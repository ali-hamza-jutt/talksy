import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import { API } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import http from '@/services/api';

interface FormData { password: string; }

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await http.patch(API.RESET_PASSWORD(token!), data);
      toast.success('Password reset successful!');
      navigate(ROUTES.LOGIN);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Reset your Talksy password.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password" type="password" placeholder="Enter new password"
          icon={<Lock size={16} />} error={errors.password?.message}
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
        />
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
      <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-5">
        Remember it?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">Signin</Link>
      </p>
    </AuthLayout>
  );
}
