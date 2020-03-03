/* eslint-disable no-unused-vars */
const { GeneralError } = require('@feathersjs/errors');
const joi2json = require('../../utils/joi2json');
const { getJoiInstance } = require('../../utils/helpers');
// const {joi2json, getJoiInstance} = require('feathers-mongoose-casl');

const dashboardConfig = { dashboard: { doc: { hideOnCreate: true, hideOnUpdate: true } } };
class Service {
  constructor (options) {
    this.options = options || {};
    this.app = this.options.app;
  }

  async find (params) {
    const result = {};
    if (!params.query || !params.query.serviceName) {
      throw new GeneralError('serviceName is required');
    }
    if (params.query.includeSchema) {
      const getValidators = getJoiInstance(this.app, params.query.serviceName);
      if (getValidators) {
        const validators = getValidators(true);
        const jsonSchema = joi2json(validators);

        // Add default fields
        jsonSchema.properties.createdAt = { format: 'date-time', meta: [dashboardConfig], type: 'string', readOnly: true };
        jsonSchema.properties.updatedAt = { format: 'date-time', meta: [dashboardConfig], type: 'string', readOnly: true };
        jsonSchema.properties._id = { meta: [dashboardConfig], pattern: '^[0-9a-fA-F]{24}$', type: 'string', readOnly: true };
        result.schema = jsonSchema;
      } else {
        result.schemaErr = 'Missing Schema';
      }
    }
    result.data = params.query;
    result.data.userId = (params.user && params.user._id) || params.userId;
    return result;
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
