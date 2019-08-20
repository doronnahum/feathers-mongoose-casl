const assert = require('assert');
const app = require('../../src/app');
// const isEqualDeep = require('../../../lib/test/utils/isDeepEqualNotReference');
const { TEST_USERS } = require('../enums');
const { expect } = require('chai');
const { ADMIN, WRITER, READER } = TEST_USERS;

const createUser = function (name, userData) {
  it(`Create ${name} user`, function () {
    return app.service('users').create(userData).then(user => {
      expect(user).to.be.instanceof(Object);
      expect(user.email).to.equal(userData.email);
    });
  });
};

const AddRuleToUser = function (name, userEmail, role) {
  it(`Add ${role} role to ${name} user`, function () {
    return app.service('users').patch(null, { roles: [role] }, { query: { email: userEmail } }).then(users => {
      const user = users[0];
      expect(user).to.be.instanceof(Object);
      expect(user.roles).to.be.instanceof(Array);
      expect(user.roles[0]).to.equal(role);
    });
  });
};

describe('\'user\' service', () => {
  it('Registered the user service', () => {
    const service = app.service('users');
    assert.strictEqual(typeof service, 'object', 'service is not found');
  });

  it('Should be empty', function () {
    return app.service('users').find().then(users => {
      expect(users.data).to.be.instanceof(Array);
    });
  });

  createUser('Admin', ADMIN);
  createUser('Writer', WRITER);
  createUser('Reader', READER);

  AddRuleToUser('Writer', WRITER.email, 'writer');
  // AddRuleToUser('Reader', READER.email, 'reader');

  it('Validate that Admin can add rule to a user', function () {
    return app.service('users').find({ query: { email: ADMIN.email } }).then(users => {
      const adminUser = users.data[0];
      return app.service('users').patch(null, { roles: ['reader'] }, { provider: 'rest', user: adminUser, query: { email: READER.email } }).then(users => {
        const user = users[0];
        expect(user).to.be.instanceof(Object);
        expect(user.roles).to.be.instanceof(Array);
        expect(user.roles[0]).to.equal('reader');
      });
    });
  });

  it('Validate that Writer can not add rule to a user', async function () {
    const users = await app.service('users').find({ query: { email: READER.user } });
    const readerUser = users[0];
    try {
      await app.service('users').patch(null, { roles: ['writer'] }, { provider: 'rest', user: readerUser, query: { email: WRITER.email } });
      assert.ok(false);
    } catch (error) {
      expect(error.code).to.equal(403);
    }
  });
});
