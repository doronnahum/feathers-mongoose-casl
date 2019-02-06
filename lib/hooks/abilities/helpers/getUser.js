

const { GeneralError } = require('@feathersjs/errors');

module.exports = async function({hook, testMode,userIdForTest}){
  let user = hook.params.user;
  if(testMode && userIdForTest){
    user = await hook.app.service('/users').get(userIdForTest);
    if(!user){
      throw new GeneralError('User Not Found');
    }
  }
  const hasUser = user && user._id;
  const userId = hasUser && user._id;
  const userRolesIds = hasUser ? (user.roles || []) : [];
  return {
    user,
    hasUser,
    userId,
    userRolesIds
  };
};