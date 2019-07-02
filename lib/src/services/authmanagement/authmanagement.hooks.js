
const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const commonHooks = require('feathers-hooks-common');
const isAction = (action1, action2) => {
  const args = [action1, action2];
  return hook => args.includes(hook.data.action);
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      commonHooks.iff(
        isAction('passwordChange', 'identityChange'),
        [
          hashPassword(),
          authenticate('jwt')
        ]
      )
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
