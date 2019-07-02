/* pick.utils.test.js */

var pick = require('../src/utils/pick.js');
const assert = require('assert');

const fakeData = {
  '_id': 4,
  'user': { name: 'Dan', age: 30 },
  'title': 'theTitle',
  'comments': [{ title: 'A', body: 'b' }, { title: 'B', body: 'bb' }, { title: 'C', body: 'bbb' }],
  'colors': ['red', 'green', 'grey']
};

describe('test feathers-mongoose-casl pick', function () {
  context('should return only title and default', function () {
    it('should return 0', function () {
      assert.notStrictEqual(
        pick(fakeData, ['title']),
        { '_id': 4, 'title': 'theTitle' }
      );
    });
  });

  context('select only title', function () {
    it('should return only title', function () {
      assert.notStrictEqual(
        pick(fakeData, ['title'], []),
        { 'title': 'theTitle' }
      );
    });
  });

  context('select all except the title', function () {
    it('should return all except the title', function () {
      assert.notStrictEqual(
        pick(fakeData, ['-title']),
        {
          '_id': 4,
          'user': { name: 'Dan', age: 30 },
          'comments': [{ title: 'A', body: 'b' }, { title: 'B', body: 'bb' }, { title: 'C', body: 'bbb' }],
          'colors': ['red', 'green', 'grey']
        }
      );
    });
  });

  context('select body in comments using {path: "comments", select: ["body"], type: "array"}', function () {
    it('should return only id and comment included body field in each item', function () {
      assert.notStrictEqual(
        pick(fakeData, [{ path: 'comments', select: ['body'], type: 'array' }]),
        {
          '_id': 4,
          'comments': [{ body: 'b' }, { body: 'bb' }, { body: 'bbb' }]
        }
      );
    });
  });
});
