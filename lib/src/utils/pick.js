const sift = require('sift').default;
const cloneDeep = require('lodash.clonedeep');
const _pick = require('lodash.pick');
const _omit = require('lodash.omit');

/**
 * pick.js
 * ------------------------------------------------------------------
 * Use pick.js to pick some fields from object
 * ------------------------------------------------------------------
 *
 *
 */

/**
 * @function can
 * @description check field conditions with [sift], sift is like mongoose query
 * @param {object} data
 * @param {object} conditions
 * @example
 * can({id: '123', type: 'BIG'}, {'id': {$in: ['124']}}) === false
 * can({id: '123', type: 'BIG'}, {'type': 'BIG'}) === true
 *
 *
 */
const can = function (data, conditions) {
  const _sift = sift(conditions); // Create sift
  return _sift(data); // Make the query
};

const parseFields = function ({ data, defaultFields, fields }) {
  const negative = [];
  const positive = [...defaultFields];
  const pathSelect = [];
  const pathSelectFromArr = [];
  let allField = false;
  if (fields) {
    fields.forEach(field => {
      if (field === '*') {
        allField = true;
      }
      const isNegative = field[0] === '-';
      if (isNegative) {
        const fieldName = field.substr(1);
        negative.push(fieldName);
        return;
      }
      if (field.path && !field.when) {
        const selectInPath = { path: field.path, select: field.select };
        if (field.type === 'array') {
          pathSelectFromArr.push(selectInPath);
        } else {
          pathSelect.push(selectInPath);
        }
        return;
      }
      if (field.when) {
        const whenResult = can(data, field.when);
        const selectInPath = { path: field.path, select: whenResult ? field.then : field.otherwise };
        if (field.type === 'array') {
          pathSelectFromArr.push(selectInPath);
        } else {
          pathSelect.push(selectInPath);
        }

        return;
      }
      positive.push(field);
    });
  }
  return {
    negative,
    positive,
    pathSelect,
    pathSelectFromArr,
    allField
  };
};

// pick.js
// This function help us to pick specific fields from object
// the function get object and fields array
// the array can be negative ['-name','-price'] and the result will be all fields except price and name
// of positive, ['name','price'] and the result will be only name and price
// you can't mixed positive and negative
// each field can be an object to include conditions [{name: id: 1}] - return name only if is equals to one
// we use sift to check your conditions, sift filter base the mongodb query, see https://docs.mongodb.com/manual/reference/operator/query/**
// the field name can be deep, like that ['product.price']- in this example we will return only the price from the product object
// if product is not an object then we will return the product value, this is useful for reference field that sometimes you populate them and sometimes you not
// depp to arr field ['comments._id'] - if comments is array of object then in this example we will return array with object with comment _id

/**
 * @function pick
 * @param {object} _data Pass nested object {}
 * @param {array} fields ['_id',{'user': {userId: 'A22'}}]
 * @private {string[]} defaultFields fields to include always ['_id']
 * @example
 * const fakeData = {
 *  '_id': 4,
 *  'user': {name: 'Dan', age: 30},
 *  'title': 'theTitle',
 *  'comments': [{title: 'A', body: 'bodyA'},{title: 'B'', body: 'bodyB'},{title: 'C'', body: 'bodyC'}],
 *  'colors': ['red','green', 'grey']
 * }
 * pick(fakeData, ['title']) // object wil title
 * pick(fakeData, ['-title']) // object with all fields except the title
 * pick(fakeData, [{path: 'comments', select: ['title'], type: 'array'}])
 * pick(fakeData, [{ path: 'comments', type: 'array', when: { 'user.name': 'Dan' }, then: ['*'], otherwise: ['title'] }]) // object with only id and comment that included all fields, success condition
 */
const pick = function (_data, fields, defaultFields = ['_id', 'updatedAt', 'createdAt']) {
  const data = cloneDeep(_data);
  let values = {};
  const {
    negative,
    positive,
    pathSelect,
    pathSelectFromArr,
    allField
  } = parseFields({ data, defaultFields, fields });

  const pickFromPositive = !allField && positive.length !== defaultFields.length;
  if (allField) {
    values = data;
  }
  if (pickFromPositive) {
    values = _pick(data, positive);
  }
  if (negative.length) {
    let _data = pickFromPositive ? values : data;
    values = _omit(_data, negative);
  }
  if (pathSelect.length) {
    pathSelect.forEach(({ path, select }) => {
      values[path] = (data[path] && typeof data[path] === 'object') ? pick(data[path], select) : data[path];
    });
  }
  if (pathSelectFromArr.length) {
    pathSelectFromArr.forEach(({ path, select }) => {
      const _data = data[path];
      if (Array.isArray(_data)) {
        values[path] = _data.map(item => (item && typeof item === 'object') ? pick(item, select) : item);
      }
    });
  }

  return values;
};

module.exports = pick;
