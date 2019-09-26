const isEqual = require('lodash/isEqual');
const forOwn = require('lodash/forOwn');
var assert = require('assert');

const isEqualDeep = function (data, otherData) {
  try {
    const checkInObject = function (values, otherValues) {
      const onNotEqual = function () {
        throw new Error('not Equal');
      };
      if (values && otherValues) {
        forOwn(values, function (value, key) {
          const value1 = value;
          const value2 = otherValues[key];
          const typeof1 = typeof value1;
          const typeof2 = typeof value2;
          if (typeof1 !== typeof2) {
            onNotEqual();
          } else if (typeof1 === 'object') {
            checkInObject(value1, value2);
          } else {
            if (!isEqual(value1, value2)) {
              onNotEqual();
            }
          }
        });
      }
    };
    checkInObject(data, otherData);
    return true;
  } catch (error) {
    return assert.fail('not Equal value');
  }
};

module.exports = isEqualDeep;
