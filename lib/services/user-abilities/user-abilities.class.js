/* eslint-disable no-unused-vars */
const validate = require('validate.js');
const joi2json = require('../../utils/joi2json');

const { GeneralError } = require('@feathersjs/errors');

class Service {
  constructor (options) {
    this.options = options || {};
    this.app = options.app;
  }

  async find(params) {
    let result = {};
    if(!params.query || !params.query.serviceName) {
      throw new GeneralError('serviceName is required');
    }
    if(params.query.includeSchema){
      const getValidators = this.app.get(params.query.serviceName + 'getJoi');
      if(getValidators){
        const validators = getValidators(true);
        const jsonSchema = joi2json(validators);
        // Add default fields
        jsonSchema.properties.createdAt = {type: 'date', 'readOnly': true};
        jsonSchema.properties.updatedAt = {type: 'date', 'readOnly': true};
        jsonSchema.properties._id = {type: 'string', 'readOnly': true};
        if(jsonSchema){
          result.schema =  jsonSchema;
        }else{
          result.schemaErr = 'Missing Schema';
        }
      }
    }
    result.data = params.query;
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
