

// rulesCache.hook.js
// This hook will check if rules collection is saved in cache
// if the rules will be found in the cache then response will be from cache
// if not then we will be set in the cache at hook.after.find the rules collection 
// in each changed in rules collection we clear the cache

const feathersCache = require('@feathers-plus/cache');

let rulesCacheMap;

module.exports = function handleRulesCache() {
  return async function(hook) {
    try {
      const hookType = hook.type;
      const method = hook.method;

      const rulesCacheConfig = hook.app.get('rules-cache');
      //method: 'patch', hookType: 'after'
      if(hookType === 'after' && ['patch','update', 'remove'].includes(method)){
        rulesCacheMap.reset();
        hook.app.info(`feathers-mongoose-casl - rulesCache hook - Removed rules from cache after ${method}`);

        return hook;
      }
      if(!rulesCacheConfig.enabled || !hook.params.requestFromAbilities) return hook;

      if(!rulesCacheMap){
        hook.app.info('feathers-mongoose-casl - rulesCache hook - initial the rules cache');
        rulesCacheMap = feathersCache(rulesCacheConfig['local-config']);
      }
    
    
      if(hookType === 'before' && method === 'find'){
        if(hook.params.disabledCache) {
          hook.app.info('feathers-mongoose-casl - rulesCache hook - skip rules from cache, return results from DB');
          return hook;
        }
        const rulesFromCatch = rulesCacheMap.get('find-rules');
        if(rulesFromCatch){
          hook.app.info('feathers-mongoose-casl - rulesCache hook - return results from DB');
          hook.result = rulesFromCatch; // Skip the DB request
        }
        return hook;
      }

    
      if(hookType === 'after' && method === 'find'){
        if(!hook.result.fromCache){
          // save rules is cache
          hook.result.fromCache = true;
          rulesCacheMap.set('find-rules', hook.result);
          hook.app.info('feathers-mongoose-casl - rulesCache hook - save rules results from DB in cache');

          return hook;
        }
      }
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - rulesCache hook error', error);
    }
  };
};

// rulesCacheMap: {
//   "enabled": true,
//  "local-catch": true,
//  "local-config": {
//    "maxAge": 3600000,
//    "max": 100
//  }
// }