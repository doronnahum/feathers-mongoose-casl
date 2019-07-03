/* pick.utils.test.js */

var pick = require('../src/utils/pick.js');
const isEqualDeep = require('./utils/isDeepEqualNotReference');

const fakeData = {
  '_id': 4,
  'user': { name: 'Dan', age: 30 },
  'title': 'theTitle',
  'comments': [{ title: 'A', body: 'b' }, { title: 'B', body: 'bb' }, { title: 'C', body: 'bbb' }],
  'colors': ['red', 'green', 'grey']
};

describe('test feathers-mongoose-casl pick', function () {
  context('1 - simple select field test', function () {
    it('should return only title and default fields', function () {
      isEqualDeep(
        pick(fakeData, ['title']),
        { _id: 4, title: 'theTitle' }
      );
    });
  });

  context('2 - simple select field test without default fields', function () {
    it('should return only title', function () {
      isEqualDeep(
        pick(fakeData, ['title'], []),
        { 'title': 'theTitle' }
      );
    });
  });

  context('3 - simple select all except some fields, using "-" ', function () {
    it('should return all except the title', function () {
      isEqualDeep(
        pick(fakeData, ['-title']),
        { _id: 4,
          user: { name: 'Dan', age: 30 },
          comments:
           [ { title: 'A', body: 'b' },
             { title: 'B', body: 'bb' },
             { title: 'C', body: 'bbb' } ],
          colors: [ 'red', 'green', 'grey' ] }
      );
    });
  });

  context('4 - complex select body in comments[] using path and select', function () {
    it('should return only id and comment[] included body field in each item', function () {
      isEqualDeep(
        pick(fakeData, [{ path: 'comments', select: ['body'], type: 'array' }]),
        {
          '_id': 4,
          'comments': [{ body: 'b' }, { body: 'bb' }, { body: 'bbb' }]
        }
      );
    });
  });

  context('5 - complex select fields in comments[] using data condition - failed condition', function () {
    it('should return only id and comment that included only the title, failed condition', function () {
      isEqualDeep(
        pick(fakeData, [{ path: 'comments', type: 'array', when: { 'user.name': 'Oren' }, then: ['*'], otherwise: ['title'] }]),
        {
          '_id': 4,
          'comments': [{ title: 'A' }, { title: 'B' }, { title: 'C' }]
        }
      );
    });
  });

  context('6 - complex select fields in comments[] using data condition - success condition', function () {
    it('should return only id and comment that included all fields, success condition', function () {
      isEqualDeep(
        pick(fakeData, [{ path: 'comments', type: 'array', when: { 'user.name': 'Dan' }, then: ['*'], otherwise: ['title'] }]),
        {
          '_id': 4,
          'comments': [{ title: 'A', body: 'b' }, { title: 'B', body: 'bb' }, { title: 'C', body: 'bbb' }]
        }
      );
    });
  });
});
