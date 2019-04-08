

const usersCache = require('../../cache/usersCache');
const moment = require('moment');

module.exports = async function({hook, testMode,userIdForTest}){
  // find user from params
  let user = hook.params.user; // user from jwt
  const userId = (testMode && userIdForTest) ? userIdForTest : ((user && user._id) ? user._id : null);

  // we need full user
  if(userId){
    let userFromCache = await usersCache.getUserFromCache(hook, userId);
    // Clear cache when jwt updatedAt is after userFromCache.updatedAt
    if(
      user
      && userFromCache
      && userFromCache._id === user._id
      && userFromCache.updatedAt !== user.updatedAt
      && moment(user.updatedAt).isAfter(userFromCache.updatedAt)
    ){
      userFromCache = null;
      if(usersCache) usersCache.clearUserFromCache(hook, userId, 'feathers-mongoose-casl - usersCache hook - remove user from cache, jwt updatedAt is after then userFromCache.updatedAt');
    }
    user =  userFromCache || await hook.app.service('/users').get(user._id);

  } else{
    user = null;
  }

  const hasUser = !!userId;
  return {
    user,
    hasUser,
    userId
  };
};