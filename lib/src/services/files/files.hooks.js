
const uploadsHooks = require('../../hooks/uploads/uploadsHooks');
// const {hooks} = require('feathers-mongoose-casl');
// const {uploadsHooks} = hooks;

const uploadHookConfig = {
  fileKeyName: 'file',
  userKeyName: 'user',
  publicRead: true,
  singUrlKeyName: 'file'
};

module.exports = {
  before: {
    all: [uploadsHooks(uploadHookConfig)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [uploadsHooks(uploadHookConfig)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
