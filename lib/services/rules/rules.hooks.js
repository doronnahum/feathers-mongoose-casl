

const commonHooks = require('feathers-hooks-common');
const rulesCache = require('../../hooks/cache/rulesCache');
const parseRules = require('../../hooks/parseRules');
// const {hooks} = require('feathers-mongoose-casl');
// const rulesCache = hooks.rulesCache
// const parseRules = hooks.parseRules


module.exports = {
  before: {
    all: [],
    find: [
      commonHooks.when(
        commonHooks.isProvider('server'), // We want to serve catch rules only for ability service;
      )],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [parseRules],
    find: [rulesCache.setRulesInCache],
    get: [],
    create: [rulesCache.clearRulesFromCache],
    update: [rulesCache.clearRulesFromCache],
    patch: [rulesCache.clearRulesFromCache],
    remove: [rulesCache.clearRulesFromCache],
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
