/**
 * returnUserOnLogin.hook.js
 * By default https://github.com/feathersjs/authentication receive to client only the token after login/signup
 * this hook will added the user data to repose
 * response: {
 *  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI1YzRmNDIzODg1YzFhNmJkODcwNzNiZTciLCJpYXQiOjE1NDkxOTczNzIsImV4cCI6MTU0OTI4Mzc3MiwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiMmIwMGE0NjYtZDEyZi00ODg5LWFjOGItYjM5N2JiYWE1MGY3In0.ADYrhNzvmTmW78mEbf1WNauXvN3OOLQPlSySUuawyjw"
    user: {
      _id: "5c4f423885c1a6bd87073be7",
      createdAt: "2019-01-28T17:56:08.023Z",
      updatedAt: "2019-01-29T08:29:59.478Z",
      rules: ["5c4f423885c1a6bd87073be8"],
      __v: 0,
      _id: "5c4f423885c1a6bd87073be7"
    }
  *}
 */
const enums = require('../../enums');
const pick = require('../../utils/pick');
const { GeneralError } = require('@feathersjs/errors');

module.exports = function returnUserOnLogin () {
  return async function (hook) {
    try {
      const isLoginOrRegisterRequest = hook.result && hook.result.accessToken;
      if (isLoginOrRegisterRequest) {
        const USER_PROTECTED_FIELDS = hook.app.get('feathers-mongoose-casl').pickMeReadFields || ['-password', ...enums.USER_PROTECTED_FIELDS.map(field => `-${field}`)];
        /**
         * fetchMeOnLogin
         * When user maker login or register request is user data will define in the params.user
         * When fetchMeOnLogin is true then we going to replace the data with /me response
         * it is good for cases that me making extra work and we want to maintain consistency
         */
        if (hook.app.get('feathers-mongoose-casl').fetchMeOnLogin) {
          const me = await hook.app.service('me').find(hook.params);
          hook.result.user = me;
        } else {
          /**
           * Add user to result // TODO: In the new version of feathers we didn't need this anymore
           */
          hook.result.user = pick(hook.params.user, USER_PROTECTED_FIELDS);
        }
      }
    } catch (error) {
      hook.app.error('returnUserOnLogin failed');
      throw new GeneralError(error);
    }
    return hook;
  };
};
