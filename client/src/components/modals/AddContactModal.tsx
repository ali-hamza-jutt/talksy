import { useForm } from 'react-hook-form';
import { User, Mail } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';

interface Props { onClose: () => void; }
interface FormData { name: string; email: string; }

export default function AddContactModal({ onClose }: Props) {
  const { user } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (!user) return;
    const socket = getSocket();
    socket.emit(SE.CONTACT_LIST, {
      name: data.name,
      email: data.email,
      userEmail: user.email,
      created_by: user._id,
      username: user.name,
    });
    reset();
    onClose();
  };

  return (
    <Modal open title="Add Contact" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name" placeholder="Contact name"
          icon={<User size={16} />} error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          label="Email" type="email" placeholder="Contact email"
          icon={<Mail size={16} />} error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <button type="submit" className="btn-primary mt-2">Add Contact</button>
      </form>
    </Modal>
  );
}
