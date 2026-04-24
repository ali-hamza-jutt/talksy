export const API = {
  BASE:              '/api/v1/users',
  SIGNIN:            '/api/v1/users/signin',
  SIGNUP:            '/api/v1/users/signup',
  LOGOUT:            '/api/v1/users/logout',
  FORGOT_PASSWORD:   '/api/v1/users/forgotPassword',
  RESET_PASSWORD:    (token: string) => `/api/v1/users/resetPassword/${token}`,
  CLOUDINARY_SIG:    '/api/cloudinary-signature',
  PROFILE_UPDATE:    '/profileUpdate',
  FILE_UPLOAD:       '/fileUploads',
  FILE_DELETE:       '/filedelete',
} as const;

export const SOCKET_URL = window.location.origin;
