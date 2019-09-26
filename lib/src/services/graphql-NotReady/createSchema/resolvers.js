const { callingParamsPersistUser } = require('../../../utils/helpers');
// const {callingParamsPersistUser} = require('feathers-mongoose-casl');

const findById = function (app, serviceName) {
  return async (res) => {
    const _id = res.args._id;
    const params = res.context.body[Symbol.for('private-params')];
    const select = Object.keys(res.projection);
    const response = await app.service(serviceName).get(_id, callingParamsPersistUser(params, { query: {
      $select: select
    } }));
    return response;
  };
};
const findMany = function (app, serviceName) {
  return async (res) => {
    const params = res.context.body[Symbol.for('private-params')];
    const select = Object.keys(res.projection);
    const response = await app.service(serviceName).find(callingParamsPersistUser(params, { query: {
      $select: select
    } }));
    return response.data;
  };
};
const findByIds = function (app, serviceName) {
  return async (res) => {
    const params = res.context.body[Symbol.for('private-params')];
    const _ids = res.args._ids;
    const select = Object.keys(res.projection);
    const response = await app.service(serviceName).find(callingParamsPersistUser(params, { query: {
      _id: { $in: _ids },
      $select: select
    } }));
    return response.data;
  };
};
const count = function (app, serviceName) {
  return async (res) => {
    const params = res.context.body[Symbol.for('private-params')];
    const response = await app.service(serviceName).find(callingParamsPersistUser(params, { query: {
      $select: ['_id']
    } }));
    return response.total;
  };
};

module.exports = {
  findById,
  findByIds,
  findMany,
  count
};
