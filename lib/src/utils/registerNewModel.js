
const Joigoose = require('joigoose');
const { setJoiInstance } = require('../utils/helpers');
const { accessibleFieldsPlugin } = require('@casl/mongoose');

const setJoi = (app, name, getJoiSchema) => {
  setJoiInstance(app, name, getJoiSchema);
}
const getModelFromJoi = (app, getJoiSchema) => {
  const mongooseClient = app.get('mongooseClient');
  // @ts-ignore
  return Joigoose(mongooseClient, null, { _id: false, timestamps: false }).convert(getJoiSchema(false));
}
const setModel = (mongooseModel) => {
  mongooseModel.plugin(accessibleFieldsPlugin)
}

const registerNewModel = {
  setJoi,
  getModelFromJoi,
  setModel
}

module.exports = registerNewModel;