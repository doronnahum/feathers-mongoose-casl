module.exports = async function ({ hook, testMode, userIdForTest }) {
  try {
    let user = hook.params.user; // user from jwt
    if (testMode && userIdForTest) { // In test mode we allow to define a different user, used by the dashboard
      const userIdFromParams = user && user._id && user._id.toString();
      const userIdForCurrentTest = userIdForTest.toString();
      if (userIdForCurrentTest !== userIdFromParams) { // When current user equal to the target user we can save the request
        if (hook.params[`userForTest-${userIdForCurrentTest}`]) {
          user = hook.params[`userForTest-${userIdForCurrentTest}`];
        } else {
          user = await hook.app.service('/users').get(userIdForTest); // Save to save next request for this user
          hook.params[`userForTest-${userIdForCurrentTest}`] = user;
        }
      }
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
