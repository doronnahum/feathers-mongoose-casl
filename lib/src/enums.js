const STORAGE_TYPES = {
  's3': 's3',
  'local-private': 'local-private',
  'local-public': 'local-public',
  'google-cloud': 'google-cloud',
  'others': 'others'
};

module.exports = {
  USER_PROTECTED_FIELDS: [
    'isVerified',
    'verifyToken',
    'verifyShortToken',
    'verifyExpires',
    'verifyChanges',
    'resetToken',
    'resetShortToken',
    'resetExpires',
    'fromCache',
    'roles'
  ],
  SERVICES_TO_SKIP_VALIDATE: ['dashboard', 'user-abilities', 'authManagement'],
  STORAGE_TYPES,
  UPLOAD_SERVICES: {
    [STORAGE_TYPES['local-private']]: 'upload-local-private',
    [STORAGE_TYPES['local-public']]: 'upload-local-public',
    [STORAGE_TYPES.s3]: 'uploads-s3',
    [STORAGE_TYPES['google-cloud']]: 'uploads-google'
  },
  UPLOAD_PUBLIC_FILE_KEY: Symbol.for('public-file')
};
