import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import { API } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import http from '@/services/api';

interface FormData { email: string; }

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await http.post(API.FORGOT_PASSWORD, data);
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Forgot your password? Reset it with Talksy.">
      {sent ? (
        <p className="text-center text-sm text-success font-medium">
          Check your inbox — a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email" type="email" placeholder="Enter your email"
            icon={<Mail size={16} />} error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
      <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-5">
        Remember it?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">Signin</Link>
      </p>
    </AuthLayout>
  );
}
