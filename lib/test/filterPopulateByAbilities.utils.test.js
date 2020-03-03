/* pick.utils.test.js */

var filterPopulateByAbilities = require('../src/utils/filterPopulateByAbilities.js');
const isEqualDeep = require('./utils/isDeepEqualNotReference');

describe('test feathers-mongoose-casl filterPopulateByAbilities', function () {
  context('1 - simple populate when populate is array and whitelistPopulate is array', function () {
    it('should return only [users]', function () {
      isEqualDeep(
        filterPopulateByAbilities(
          ['users', 'products'],
          ['users']
        ),
        ['users']
      );
    });
  });

  context('2 - simple populate when populate is string with spaces and whitelistPopulate is array', function () {
    it('should return only [users, tags]', function () {
      isEqualDeep(
        filterPopulateByAbilities(
          'users products tags',
          ['users', 'tags']
        ),
        ['users', 'tags']
      );
    });
  });

  context('3 - simple populate when populate is string with comma and whitelistPopulate is array', function () {
    it('should return only [users, products]', function () {
      isEqualDeep(
        filterPopulateByAbilities(
          'users,products,tags',
          ['users', 'products']
        ),
        ['users', 'products']
      );
    });
  });

  context('4 - complex populate with path object and deep populate that not allowed', function () {
    it('should return [["users", { path: "office" }]', function () {
      isEqualDeep(
        filterPopulateByAbilities(
          ['users', { path: 'office', populate: 'organizations' }],
          ['users', 'office', 'office.banks']
        ),
        ['users', { path: 'office' }]
      );
    });
  });

  context('5 - complex populate with path object and deep populate that allowed', function () {
    it('should return [ "users", { path: "office", populate: [ "organizations" ] } ]', function () {
      isEqualDeep(
        filterPopulateByAbilities(
          ['users', { path: 'office', populate: 'organizations' }],
          ['users', 'office', 'office.organizations']
        ),
        ['users', { path: 'office', populate: ['organizations'] }]
      );
    });
  });

  context('6 - complex populate with path object and deep populate that allowed but with select that force by the whitelistPopulate', function () {
    it('should return [ "users", { path: "office", populate: [ { path: "organizations", select: ["name", "title"] } ] } ]', function () {
      isEqualDeep(
        filterPopulateByAbilities(
          ['users', { path: 'office', populate: 'organizations' }],
          ['users', 'office', { path: 'office.organizations', select: ['name', 'title'] }]
        ),
        ['users', { path: 'office', populate: [{ path: 'organizations', select: ['name', 'title'] }] }]
      );
    });
  });

  context('7 - complex populate with string but with select that force by the whitelistPopulate', function () {
    it('should return [{ path: "users", select: ["name", "title"] }]', function () {
      isEqualDeep(
        filterPopulateByAbilities(
          'users',
          [{ path: 'users', select: ['name', 'title'] }]
        ),
        [{ path: 'users', select: ['name', 'title'] }]
      );
    });
  });
});
