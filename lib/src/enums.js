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
  SERVICES_TO_SKIP_VALIDATE :['dashboard','user-abilities','authManagement'],
  STORAGE_TYPES: {
    's3': 's3',
    'static': 'static',
    'others': 'others'
  },
  uploadServiceName: {
    'uploads': 'uploads',
    'uploadsStatic': 'uploads-static'
  },
  uploadPublicFileKey: Symbol.for('public-file')
};