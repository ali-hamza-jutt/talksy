import { API } from '@/constants/api';
import http from './api';

export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const { data } = await http.get(`${API.CLOUDINARY_SIG}?folder=${folder}`);
  const { timestamp, signature, api_key, cloud_name } = data;

  const form = new FormData();
  form.append('file', file);
  form.append('timestamp', timestamp);
  form.append('signature', signature);
  form.append('api_key', api_key);
  form.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
    method: 'POST',
    body: form,
  });
  const json = await res.json();
  return json.secure_url as string;
}

export function resolveUrl(src: string | undefined, type: 'user' | 'message'): string {
  if (!src) return type === 'user' ? '/assets/images/users/default_image.jpg' : '';
  if (src.startsWith('http')) return src;
  return type === 'user'
    ? `/assets/images/users/${src}`
    : `/assets/images/image/${src}`;
}
