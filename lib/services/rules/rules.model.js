// rules-model.js - A mongoose model
const rulesValidators = require('./rules.validators.js');
const createModelFromJoi= require('../../utils/createModelFromJoi');
// const {createModelFromJoi}= require('feathers-mongoose-casl');


module.exports = function (app) {
  // const mongooseClient = app.get('mongooseClient');
  // const { Schema } = mongooseClient;
  // const blockSchema = new Schema({ 
  //   user: { type: Schema.Types.ObjectId, ref: 'rules', required: true }, 
  //   rules: { type: Schema.Types.ObjectId, ref: 'rules', required: true }, 
  //   blockedAll: Boolean
  // }); 

  // const schema = new Schema({
  //   name: { type: String, required: true },
  //   description: { type: String },
  //   type: { type: String },
  //   active: { type: Boolean },
  //   from: { type: Date },
  //   to: { type: Date },
  //   conditions: { type: Object },
  //   userContext: { type: Object },
  //   fields: { type: Array },
  //   subject: { type: Array },
  //   actions: { type: Array },
  //   blocked: blockSchema
  // }, {
  //   timestamps: true
  // });
  return createModelFromJoi(app, 'rules', rulesValidators);
};
