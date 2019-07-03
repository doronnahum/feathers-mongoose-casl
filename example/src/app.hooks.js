const log = require('./hooks/log');
const {hooks} = require('../../lib/index'); // require('feathers-mongoose-casl')

module.exports = {
  before: {
    all: [
      log(),
      hooks.authenticate, // Check user token(JWT) and get user from DB, user will be found at hook.params.user 
      hooks.validateAbilities // Check user abilities (CASL) 
    ],
    find: [],
    get: [],
    create: [hooks.validateSchema], // validate Schema with JOI before create
    update: [hooks.validateSchema], // validate Schema with JOI before update
    patch: [hooks.validateSchema],// validate Schema with JOI before patch
    remove: []
  },

  after: {
    all: [ log(),
      hooks.sanitizedData, // Remove protected fields(CASL rules fields) from response
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ log(), hooks.errorHandler() ], // errorHandler - make sure that errors get cleaned up before they go back to the client
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};