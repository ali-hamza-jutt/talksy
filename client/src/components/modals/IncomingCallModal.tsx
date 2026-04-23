import { Phone, PhoneOff, Video } from 'lucide-react';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import Avatar from '@/components/common/Avatar';

export default function IncomingCallModal() {
  const { user } = useAuthStore();
  const { incomingCall, setIncomingCall } = useChatStore();

  if (!incomingCall) return null;

  const decline = () => {
    getSocket().emit(SE.IS_BUSY, { uid: incomingCall.uid, scid: incomingCall.scid });
    setIncomingCall(null);
  };

  const accept = () => {
    if (!user) return;
    const params = new URLSearchParams({
      uid: incomingCall.uid,
      scid: incomingCall.scid,
      ctype: incomingCall.ctype,
      name: incomingCall.name,
      image: incomingCall.image,
    });
    window.open(`/call?${params}`, '_blank');
    setIncomingCall(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-72">
        <Avatar src={incomingCall.image} name={incomingCall.name} size="lg" />
        <div className="text-center">
          <p className="font-semibold text-light-text dark:text-dark-text">{incomingCall.name}</p>
          <p className="text-sm text-light-muted dark:text-dark-muted flex items-center gap-1 justify-center mt-1">
            {incomingCall.ctype === 'video' ? <Video size={14} /> : <Phone size={14} />}
            Incoming {incomingCall.ctype} call…
          </p>
        </div>
        <div className="flex gap-6 mt-2">
          <button onClick={decline} className="flex flex-col items-center gap-1 text-danger">
            <span className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
              <PhoneOff size={22} />
            </span>
            <span className="text-xs">Decline</span>
          </button>
          <button onClick={accept} className="flex flex-col items-center gap-1 text-success">
            <span className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Phone size={22} />
            </span>
            <span className="text-xs">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
