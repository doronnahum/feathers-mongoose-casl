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
    'fromCache'
  ],
  SERVICES_TO_SKIP_VALIDATE :['dashboard','user-abilities','authManagement'],
  STORAGE_TYPES: {
    's3': 's3',
    'static': 'static',
    'others': 'others'
  }
};