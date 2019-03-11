/* eslint-disable no-unused-vars */


const { GeneralError } = require('@feathersjs/errors');
const {asyncForEach, getJoiInstance} = require('../../utils/helpers'); 
// const {asyncForEach, getJoiInstance} = require('feathers-mongoose-casl'); 

class Service {
  constructor (options) {
    this.options = options || {};
    this.app = options.app;
  }

  async find (params) {
    try {
      const collections = [];
      const services = Object.keys(this.app.docs.paths); // All app services as array ['/posts','/rules']
      await asyncForEach(services, async (service) => {
        const name = service.substring(1); // from '/post' to 'post'
        const getJoi = getJoiInstance(this.app, name);// This will be set in app by src/utils/createModelFromJoi.js
        if(getJoi){ // Dashboard return only services with joi validators
          const service = this.app.service(name);
          const serviceOptions = service && service.options || {};
          const dashboardConfig = serviceOptions.dashboardConfig;
          if(!dashboardConfig || !dashboardConfig.hide){
            // ability is object with all abilities for the current user, canRead, canCreate....
            const userId = params.user && params.user._id;
            const ability = await this.app.service('user-abilities').find({query: {serviceName: name, includeSchema: true}, userId});
            if(ability && ability.result && ability.result.canRead){ // Return only result with readAbilities
              // TODO need to filter dashboard.hide from schema
              ability.data.dashboardConfig = dashboardConfig;
              collections.push(ability);
            }
          }
            
        }
      });
      return {
        'total': collections.length, // Each user will get different result, depend of is rules
        'data': collections
      };
    } catch (error) {
      throw new GeneralError(); 
    }
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;