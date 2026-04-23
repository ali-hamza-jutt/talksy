import { useState, useRef } from 'react';
import { Camera, Check, X, Edit2 } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { uploadToCloudinary } from '@/services/cloudinary';
import http from '@/services/api';
import { API } from '@/constants/api';
import toast from 'react-hot-toast';

export default function ProfilePanel() {
  const { user, setUser } = useAuthStore();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const saveName = () => {
    if (!name.trim() || name === user.name) { setEditingName(false); return; }
    getSocket().emit(SE.UPDATE_USERNAME, { userId: user._id, name: name.trim() });
    setUser({ ...user, name: name.trim() });
    setEditingName(false);
    toast.success('Name updated');
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Max file size is 2MB'); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'talksy/profiles');
      await http.post(API.PROFILE_UPDATE, { userId: user._id, image: url });
      const updatedUser = { ...user, image: url };
      setUser(updatedUser);
      getSocket().emit(SE.CURRENT_USER, { userId: user._id, image: url });
      toast.success('Photo updated');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <h2 className="panel-heading">Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar src={user.image} name={user.name} size="lg" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity"
              disabled={uploading}
            >
              <Camera size={18} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>

          <div className="w-full space-y-4">
            <div>
              <p className="text-xs font-medium text-light-muted dark:text-dark-muted mb-1">Name</p>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveName()}
                    className="input-field flex-1"
                    autoFocus
                  />
                  <button onClick={saveName} className="sidebar-icon text-success"><Check size={16} /></button>
                  <button onClick={() => { setEditingName(false); setName(user.name); }} className="sidebar-icon text-danger"><X size={16} /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-light-input dark:bg-dark-input">
                  <span className="text-sm text-light-text dark:text-dark-text">{user.name}</span>
                  <button onClick={() => setEditingName(true)} className="sidebar-icon w-8 h-8"><Edit2 size={14} /></button>
                </div>
              )}
            </div>

            <ProfileField label="Email" value={user.email} />
            {user.location && <ProfileField label="Location" value={user.location} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-light-muted dark:text-dark-muted mb-1">{label}</p>
      <div className="p-3 rounded-xl bg-light-input dark:bg-dark-input">
        <span className="text-sm text-light-text dark:text-dark-text">{value}</span>
      </div>
    </div>
  );
}
