

// rulesCache.hook.js
// This hook will check if rules collection is saved in cache
// if the rules will be found in the cache then response will be from cache
// if not then we will be set in the cache at hook.after.find the rules collection 
// in each changed in rules collection we clear the cache

const feathersCache = require('@feathers-plus/cache');
const debug = require('debug')('feathers-mongoose-casl');

const rulesCache = {
  rulesCacheMap: null,
  initCache: function(hook){
    if(!rulesCache.rulesCacheMap){
      const rulesCacheConfig = hook.app.get('feathers-mongoose-casl').rulesCache;
      debug('rulesCache hook - initial the rules cache');
      rulesCache.rulesCacheMap = feathersCache(rulesCacheConfig['local-config']);
    }
    return rulesCache.rulesCacheMap;
  },
  setRulesInCache: async function(hook) {
    const rulesCacheMap = rulesCache.rulesCacheMap || rulesCache.initCache(hook);
    try {
      const hookType = hook.type;
      const method = hook.method;
      if(hookType === 'after' && method === 'find'){
        if(!hook.result.fromCache){
          // save rules is cache
          hook.result.fromCache = true;
          rulesCacheMap.set('find-rules', hook.result);
          debug('rulesCache hook - save rules results from DB in cache');
          return hook;
        }
      }
      return hook;
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - rulesCache hook error', error);
    }
  },
  clearRulesFromCache: async function(hook) {
    const rulesCacheMap = rulesCache.rulesCacheMap;
    if(!rulesCacheMap) return;
    try {
      const hookType = hook.type;
      const method = hook.method;

      if(hookType === 'after' && ['patch','update', 'remove'].includes(method)){
        rulesCacheMap.reset();
        hook.app.info(`feathers-mongoose-casl - rulesCache hook - remove rules from cache after ${method}`);
      }
      return hook;
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - rulesCache hook error', error);
    }
  },
  getRulesFromCache: async function() {
    const rulesCacheMap = rulesCache.rulesCacheMap;
    if(!rulesCacheMap) return;
    const rulesFromCatch = rulesCacheMap.get('find-rules');
    if(rulesFromCatch){
      debug('rulesCache hook - return rules from cache');
    }
    return rulesFromCatch;
  }
};
module.exports = rulesCache;
// rulesCacheMap: {
//   "enabled": true,
//  "local-config": {
//    "maxAge": 3600000,
//    "max": 100
//  }
// }