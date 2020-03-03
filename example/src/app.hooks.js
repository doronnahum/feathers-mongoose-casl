const { hooks } = require('../../lib');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      hooks.sanitizedData // Remove protected fields(CASL rules fields) from response
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [hooks.errorHandler()], // errorHandler - make sure that errors get cleaned up before they go back to the client
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
