
const uploadsHooks  = require('../../hooks/uploads/uploadsHooks');
// const {hooks} = require('feathers-mongoose-casl');
// const {uploadsHooks} = hooks;

const uploadHookConfig = {
  serviceName: 'files',
  fileKeyName: 'file',
  singUrlKeyName: 'file',
  protectTheFile: true,
  autoSignUrl: true,
  userKeyName: 'user'
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
