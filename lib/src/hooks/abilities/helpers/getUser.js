

const usersCache = require('../../cache/usersCache');

module.exports = async function({hook, testMode,userIdForTest}){
  // find user from params
  let user = hook.params.user; // user from jwt
  const userId = (testMode && userIdForTest) ? userIdForTest : ((user && user._id) ? user._id : null);

  // we need full user
  if(userId){
    const userFromCache = await usersCache.getUserFromCache(hook, userId);
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