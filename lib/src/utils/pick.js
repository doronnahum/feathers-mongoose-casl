// pick.js
// This function help us to pick specific fields from object
// the function get object and fields array
// the array can be negative ['-name','-price'] and the result will be all fields except price and name
// of positive, ['name','price'] and the result will be only name and price
// you can't mixed positive and negative
// each field can be an object to include condition [{name: id: 1}] - return name only if is equals to one
// we use sift to check your condition, sift filter base the mongodb query, see https://docs.mongodb.com/manual/reference/operator/query/** 
// the field name can be deep, like that ['product.price']- in this example we will return only the price from the product object
// if product is not an object then we will return the product value, this is useful for reference field that sometimes you populate them and sometimes you not
// depp to arr field ['comments._id'] - if comments is array of object then in this example we will return array with object with comment _id 

const validate = require('validate.js');
const sift = require('sift').default;
const {deletePropertyPath} = require('./helpers');
const cloneDeep = require('lodash.clonedeep');
const _pick = require('lodash.pick');
const _omit = require('lodash.omit');

/**
 * @function can
 * @param {*} data 
 * @param {*} conditions
 * can help to check field condition
 */
const can = function(data, conditions) {
  const _sift = sift(conditions); // Create sift
  return _sift(data); // Make the query
};



const parseFields = function({data, defaultFields, fields}){
  const negative = [];
  const positive = [...defaultFields];
  const path_select = [];
  const path_select_from_arr = [];
  let allField = false;

  fields.forEach(field => {
    if(field === '*'){
      allField = true;
    }
    const isNegative = field[0] === '-';
    if(isNegative){
      const fieldName = isNegative ? field.substr(1) : field;
      negative.push(fieldName); // isDeep: fieldName.includes('.')
      return;
    }
    if(field.path && !field.when){
      const selectInPath = {path: field.path, select: field.select};
      if(field.type === 'array'){
        path_select_from_arr.push(selectInPath);
      }else{
        path_select.push(selectInPath);
      }
      return;
    }
    if(field.when){
      const whenResult = can(data, field.when);
      const selectInPath = {path: field.path, select: whenResult ? field.then : field.otherwise};
      if(field.type === 'array'){
        path_select_from_arr.push(selectInPath);
      }else{
        path_select.push(selectInPath);
      }
      
      return;
    }
    positive.push(field);
  });
  return {
    negative,
    positive,
    path_select,
    path_select_from_arr,
    allField
  };
};

/**
 * @function pick
 * @param {object} data Pass nested object {}
 * @param {array} fields ['_id',{'user': {userId: 'aav'}}]
 * @private {array} defaultFields fields to include always ['_id']
 * console.log(pick(testObject, ['id', 'user.name', 'comments.body'])); // Get only specific field
 *  console.log(pick(testObject, ['-user.name'])); // Get all values except user.name
 */
const pick = function(_data, fields, defaultFields = ['_id', 'updatedAt', 'createdAt']){
  const data = cloneDeep(_data);
  let values = {};
  const {
    negative,
    positive,
    path_select,
    path_select_from_arr,
    allField
  } = parseFields({values, data, defaultFields, fields});

  const pickFromPositive = !allField && positive.length !== defaultFields.length;
  if(allField){
    values = data;
  }
  if(pickFromPositive){
    values = _pick(data, positive);
  }
  if(negative.length){
    let _data = pickFromPositive ? values : data; 
    values = _omit(_data, negative);
  }
  if(path_select.length){
    path_select.forEach(({path, select}) => {
      values[path] = (data[path] && typeof data[path] === 'object' ) ? pick(data[path], select) : data[path];
    });
  }
  if(path_select_from_arr.length){
    path_select_from_arr.forEach(({path, select}) => {
      const _data = data[path];
      if(Array.isArray(_data)){
        values[path] = _data.map(item => (item && typeof item === 'object' ) ? pick(item, select) : item);
      }
    });
  }

  return values;
};

module.exports = pick;

// const comments = [
//   {
//     'postId': 1,
//     'id': 1,
//     'text': 'theText',
//   },
//   {
//     'postId': 1,
//     'id': 2,
//     'text': 'theText',
//   }
// ];
// const user = {
//   'id': 'theId',
//   'name': 'theName',
//   'username': 'theUserName',
//   'address': {
//     'street': 'Kulas Light',
//     'suite': 'Apt. 556',
//   }
// };
// const FAKE_DATA = {
//   '_id': 4,
//   'userId':'aak',
//   'user': user,
//   'title': 'theTitle',
//   'body': 'theBody',
//   'comments': comments,
//   'images': ['11','22', '333']
// };

// Simple positive
// console.log(pick(FAKE_DATA, ['_id', 'title']));
// Simple Negative
// console.log(pick(FAKE_DATA, ['-body','-title']));
//with
// console.log(pick(FAKE_DATA, [{path: 'user', when: {'user.id': 'theId'}, then: ['name'], otherwise: ['id']}]));
//path
// console.log(pick(FAKE_DATA, [{path: 'user', select: ['name']}]));
//path
// console.log(pick(FAKE_DATA, [{path: 'comments', select: ['text'], type: 'array'}]));
