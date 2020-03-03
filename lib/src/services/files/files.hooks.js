
// feathers-mongoose-casl
// ------------------------
const uploadsHooks = require('../../hooks/uploads/uploadsHooks');
const authenticate = require('../../hooks/authenticate');
const validateAbilities = require('../../hooks/abilities');
const validateSchema = require('../../hooks/validateSchema');
const sanitizedData = require('../../hooks/sanitizedData');
// //un comment to copy to your src folder
// const authenticate = require('feathers-mongoose-casl/lib/src/hooks/authenticate');
// const validateAbilities = require('feathers-mongoose-casl/lib/src/hooks/abilities');
// const validateSchema = require('feathers-mongoose-casl/lib/src/hooks/validateSchema');
// const sanitizedData = require('feathers-mongoose-casl/lib/src/hooks/sanitizedData');
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
    all: [authenticate, validateAbilities, uploadsHooks(uploadHookConfig)],
    find: [],
    get: [],
    create: [validateSchema],
    update: [validateSchema],
    patch: [validateSchema],
    remove: []
  },

  after: {
    all: [uploadsHooks(uploadHookConfig), sanitizedData],
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
