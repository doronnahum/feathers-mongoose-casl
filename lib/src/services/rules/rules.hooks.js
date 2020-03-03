
const commonHooks = require('feathers-hooks-common');

// feathers-mongoose-casl
// ------------------------
const authenticate = require('../../hooks/authenticate');
const validateAbilities = require('../../hooks/abilities');
const validateSchema = require('../../hooks/validateSchema');
const sanitizedData = require('../../hooks/sanitizedData');
const rulesCache = require('../../hooks/cache/rulesCache');
const parseRules = require('../../hooks/parseRules');
// //un comment to copy to your src folder
// const {hooks} = require('feathers-mongoose-casl');
// const rulesCache = hooks.rulesCache
// const parseRules = hooks.parseRules
// const authenticate = require('feathers-mongoose-casl/lib/src/hooks/authenticate');
// const validateAbilities = require('feathers-mongoose-casl/lib/src/hooks/abilities');
// const validateSchema = require('feathers-mongoose-casl/lib/src/hooks/validateSchema');
// const sanitizedData = require('feathers-mongoose-casl/lib/src/hooks/sanitizedData');

module.exports = {
  before: {
    all: [authenticate, validateAbilities],
    find: [
      commonHooks.when(
        commonHooks.isProvider('server') // We want to serve catch rules only for ability service;
      )],
    get: [],
    create: [validateSchema],
    update: [validateSchema],
    patch: [validateSchema],
    remove: []
  },

  after: {
    all: [parseRules, sanitizedData],
    find: [rulesCache.setRulesInCache],
    get: [],
    create: [rulesCache.clearRulesFromCache],
    update: [rulesCache.clearRulesFromCache],
    patch: [rulesCache.clearRulesFromCache],
    remove: [rulesCache.clearRulesFromCache]
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
