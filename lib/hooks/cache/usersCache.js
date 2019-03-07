
// usersCache.js
// This hook will check if specific user is saved in cache
// if the user will be found in the cache then response will be from cache
// if not then we will be set in the cache at hook.after.get the user 
// when user is patch/update/delete we will remove him from cache

const feathersCache = require('@feathers-plus/cache');

const userCache = {
  usersCacheMap: null,
  initCache: function(hook){
    if(!userCache.usersCacheMap){
      const userCacheConfig = hook.app.get('users-cache');
      hook.app.debug('feathers-mongoose-casl - usersCache hook - initial the users cache');
      userCache.usersCacheMap = feathersCache(userCacheConfig['local-config']);
    }
    return userCache.usersCacheMap;
  },
  setUserInCache: async function(hook) {
    const userCacheMap = userCache.usersCacheMap || userCache.initCache(hook);
    try {
      const hookType = hook.type;
      const method = hook.method;
      if(hookType === 'after' && method === 'get'){
        const userId = hook.id.toString();
        if(userId && hook.result && hook.result._id){
          if(!hook.result.fromCache){
            // save user is cache
            userCacheMap.set(userId, Object.assign(hook.result, {fromCache: true}));
            hook.app.debug('feathers-mongoose-casl - usersCache hook - save user in cache', {userId});
            return hook;
          }
          return hook;
        }
      }
      return hook;
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - usersCache hook error', error);
    }
  },
  clearUserFromCache: async function(hook) {
    const userCacheMap = userCache.usersCacheMap;
    if(!userCacheMap) return;
    try {
      const hookType = hook.type;
      const method = hook.method;

      if(hookType === 'after' && ['patch','update', 'remove'].includes(method)){
        const userId = hook.id.toString();
        userCacheMap.delete(userId);
        hook.app.info(`feathers-mongoose-casl - usersCache hook - remove user from cache after ${method}`, {userId});
      }

      return hook;
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - usersCache hook error', error);
    }
  },
  getUserFromCache: async function(hook, userId) {
    const userCacheMap = userCache.usersCacheMap;
    if(!userCacheMap) return;
    const userFromCatch = userCacheMap.get(userId.toString());
    if(userFromCatch){
      hook.app.info('feathers-mongoose-casl - usersCache hook - return user from cache', {userId});
    }
    return userFromCatch;
  }
};

module.exports = userCache;

// userCacheConfig: {
//   "enabled": true,
//  "local-catch": true,
//  "local-config": {
//    "maxAge": 3600000
//  }
// }