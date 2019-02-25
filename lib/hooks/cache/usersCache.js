
// usersCache.js
// This hook will check if specific user is saved in cache
// if the user will be found in the cache then response will be from cache
// if not then we will be set in the cache at hook.after.get the user 
// when user is patch/update/delete we will remove him from cache

const feathersCache = require('@feathers-plus/cache');

let userCacheMap;

module.exports = function handleUsersCache() {
  return async function(hook) {
    try {
      const userCacheConfig = hook.app.get('users-cache');
      if(!userCacheConfig.enabled) return hook;

      if(!userCacheMap){
        hook.app.info('feathers-mongoose-casl - usersCache hook - initial the users cache');
        userCacheMap = feathersCache(userCacheConfig['local-config']);
      }
    
      const hookType = hook.type;
      const method = hook.method;
      if(hookType === 'before' && method === 'get'){
        const userId = hook.id;
        const userFromCatch = userCacheMap.get(userId);
        if(userFromCatch){
          hook.app.info('feathers-mongoose-casl - usersCache hook - return user from cache', {userId});
          hook.result = userFromCatch; // Skip the DB request
        }
        return hook;
      }

    
      if(hookType === 'after' && method === 'get'){
        const userId = hook.id;
        if(userId && hook.result && hook.result._id){
          if(!hook.result.fromCache){
            // save user is cache
            userCacheMap.set(userId, Object.assign(hook.result, {fromCache: true}));
            hook.app.info('feathers-mongoose-casl - usersCache hook - save user in cache', {userId});
            return hook;
          }
          return hook;
        }
      }

      if(hookType === 'after' && ['patch','update', 'remove'].includes(method)){
        const userId = hook.id;
        userCacheMap.delete(userId);
        hook.app.info(`feathers-mongoose-casl - usersCache hook - remove user from cache after ${method}`, {userId});
      }

      return hook;
          
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - usersCache hook error', error);
    }
  };
};

// userCacheConfig: {
//   "enabled": true,
//  "local-catch": true,
//  "local-config": {
//    "maxAge": 3600000
//  }
// }