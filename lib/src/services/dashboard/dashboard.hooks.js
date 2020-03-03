// feathers-mongoose-casl
// ------------------------
const authenticate = require('../../hooks/authenticate');
const validateAbilities = require('../../hooks/abilities');
// //un comment to copy to your src folder
// const authenticate = require('feathers-mongoose-casl/lib/src/hooks/authenticate');
// const validateAbilities = require('feathers-mongoose-casl/lib/src/hooks/abilities');

module.exports = {
  before: {
    all: [authenticate, validateAbilities],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
