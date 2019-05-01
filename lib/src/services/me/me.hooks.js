const pick = require('../../utils/pick');
// //un comment to copy to your src folder
// const {pick} = require('feathers-mongoose-casl');

module.exports = {
  before: {
    all: [],
    find: [],
    patch: [(hook) => {
      const abilityFields = hook.app.get('feathers-mongoose-casl').pickMeUpdateFields;
      hook.data = pick(hook.data, abilityFields);
    }]
  },
  after: {
    all: [],
    find: [(hook) => {
      hook.dispatch = pick(hook.result, hook.app.get('feathers-mongoose-casl').pickMeReadFields);
    }],
    get: [],
    create: [],
    update: [],
    patch: [(hook) => {
      hook.dispatch = pick(hook.result, hook.app.get('feathers-mongoose-casl').pickMeReadFields);
    }],
    remove: []
  },
};