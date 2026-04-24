import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import { API } from '@/constants/api';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';
import http from '@/services/api';

interface FormData { email: string; password: string; }

export default function Login() {
  console.log('CAPTCHA KEY:', import.meta.env.VITE_CAPTCHA_SITEKEY);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!captchaToken) {
      toast.error('Please complete the captcha');
      return;
    }
    setLoading(true);
    try {
      const res = await http.post(API.SIGNIN, { ...data, 'g-recaptcha-response': captchaToken });
      if (res.data.status === 'fail') { toast.error(res.data.message); return; }
      setUser(res.data.data.user);
      toast.success('Welcome back!');
      navigate(ROUTES.HOME);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Sign in to continue to Talksy.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email" type="email" placeholder="Enter your email"
          icon={<Mail size={16} />} error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password" type="password" placeholder="Enter password"
          icon={<Lock size={16} />} error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_CAPTCHA_SITEKEY}
            onChange={setCaptchaToken}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-5">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-semibold text-primary hover:underline">Signup now</Link>
      </p>
      <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-2">
        <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary hover:underline">Forgot password?</Link>
      </p>
    </AuthLayout>
  );
}
