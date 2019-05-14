

module.exports = async function({hook, testMode,userIdForTest}){
  // find user from params
  let user = hook.params.user; // user from jwt
  if(testMode && userIdForTest){
    user = await hook.app.service('/users').get(userIdForTest);
  }
  const userId = user ? user._id : false;

  const hasUser = !!userId;
  return {
    user,
    hasUser,
    userId
  };
};