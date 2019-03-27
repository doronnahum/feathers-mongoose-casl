
const getUserFromParams  = require('../../hooks/getUserFromParams');
const protectFile  = require('../../hooks/protectFile');
const protectedFileServerUrlPrefix  = require('../../hooks/protectedFileServerUrlPrefix');
// const {hooks} = require('feathers-mongoose-casl');
// const {getUserFromParams, protectFile, protectedFileServerUrlPrefix} = hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [getUserFromParams, protectFile('files', 'file')],
    update: [getUserFromParams, protectFile('files', 'file')],
    patch: [getUserFromParams, protectFile('files', 'file')],
    remove: []
  },

  after: {
    all: [protectedFileServerUrlPrefix('file')],
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
