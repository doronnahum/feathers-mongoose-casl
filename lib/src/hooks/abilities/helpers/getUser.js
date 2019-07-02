module.exports = async function ({ hook, testMode, userIdForTest }) {
  try {
    let user = hook.params.user; // user from jwt
    if (testMode && userIdForTest) { // In test mode we allow to define a different user, used by the dashboard
      user = await hook.app.service('/users').get(userIdForTest);
    }
    const userId = user ? user._id : false;

    const hasUser = !!userId;
    return {
      user,
      hasUser,
      userId
    };
  } catch (error) {
    hook.app.error('feathers-mongoose-casl/src/hooks/abilities/helpers/getUser.js', error);
    throw new Error(error);
  }
};
