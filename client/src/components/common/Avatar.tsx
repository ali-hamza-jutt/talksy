import { resolveUrl } from '@/services/cloudinary';

interface Props {
  src?:     string;
  name:     string;
  size?:    'xs' | 'sm' | 'md' | 'lg';
  online?:  boolean;
  className?: string;
}

const SIZE = { xs: 'w-8 h-8 text-xs', sm: 'w-10 h-10 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-lg' } as const;

export default function Avatar({ src, name, size = 'sm', online, className = '' }: Props) {
  const url = resolveUrl(src, 'user');
  return (
    <div className={`relative shrink-0 ${SIZE[size]} ${className}`}>
      {url ? (
        <img src={url} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className={`flex items-center justify-center w-full h-full rounded-full bg-primary/20 text-primary font-semibold uppercase`}>
          {name[0]}
        </span>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-dark-card ${online ? 'bg-success' : 'bg-light-muted'}`} />
      )}
    </div>
  );
}
