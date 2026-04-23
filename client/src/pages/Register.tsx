import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import { API } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import http from '@/services/api';

interface FormData { name: string; email: string; password: string; location: string; }

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await http.post(API.SIGNUP, data);
      if (res.data.status === 'fail') { toast.error(res.data.message); return; }
      toast.success('Account created! Please sign in.');
      navigate(ROUTES.LOGIN);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign up" subtitle="Get your Talksy account now.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username" placeholder="Enter your name"
          icon={<User size={16} />} error={errors.name?.message}
          {...register('name', { required: 'Username is required', maxLength: { value: 20, message: 'Max 20 characters' } })}
        />
        <Input
          label="Email" type="email" placeholder="Enter your email"
          icon={<Mail size={16} />} error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password" type="password" placeholder="Enter password"
          icon={<Lock size={16} />} error={errors.password?.message}
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
        />
        <Input
          label="Location" placeholder="Enter your location"
          icon={<MapPin size={16} />} error={errors.location?.message}
          {...register('location', { required: 'Location is required' })}
        />
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-5">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">Signin</Link>
      </p>
    </AuthLayout>
  );
}
