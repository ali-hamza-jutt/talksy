import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Users } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

interface Props { onClose: () => void; }
interface FormData { name: string; description?: string; }

export default function CreateGroupModal({ onClose }: Props) {
  const { user } = useAuthStore();
  const { contacts } = useChatStore();
  const [selected, setSelected] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const onSubmit = (data: FormData) => {
    if (!user) return;
    const socket = getSocket();
    socket.emit(SE.CREATE_GROUP, {
      name: data.name,
      description: data.description,
      userId: user._id,
      members: selected,
    });
    onClose();
  };

  return (
    <Modal open title="Create Group" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Group Name" placeholder="Enter group name"
          icon={<Users size={16} />} error={errors.name?.message}
          {...register('name', { required: 'Group name is required' })}
        />
        <Input
          label="Description" placeholder="Group description (optional)"
          {...register('description')}
        />
        {contacts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-light-muted dark:text-dark-muted mb-2">Add Members</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {contacts.map((c) => (
                <label key={c._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-light-border/40 dark:hover:bg-dark-border/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(c.user_id)}
                    onChange={() => toggle(c.user_id)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">{c.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        <button type="submit" className="btn-primary mt-2">Create Group</button>
      </form>
    </Modal>
  );
}
