const assert = require('assert');
const app = require('../../src/app');
const { TEST_USERS } = require('../enums');
const { expect } = require('chai');
const { ADMIN, WRITER, READER } = TEST_USERS;

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

  let adminUser;
  // eslint-disable-next-line no-unused-vars
  let writerUser;
  let readerUser;

  it('Create admin user', function () {
    return app.service('users').create(ADMIN).then(user => {
      adminUser = user;
      expect(user).to.be.instanceof(Object);
      expect(user.email).to.equal(ADMIN.email);
    });
  });

  it('Create writer user', function () {
    return app.service('users').create(WRITER).then(user => {
      writerUser = user;
      expect(user).to.be.instanceof(Object);
      expect(user.email).to.equal(WRITER.email);
    });
  });

  it('Create reader user', function () {
    return app.service('users').create(READER).then(user => {
      readerUser = user;
      expect(user).to.be.instanceof(Object);
      expect(user.email).to.equal(READER.email);
    });
  });

  it('Add writer role to Writer user - server provider', function () {
    return app.service('users').patch(null, { roles: ['writer'] }, { query: { email: WRITER.email } }).then(users => {
      const user = users[0];
      expect(user).to.be.instanceof(Object);
      expect(user.roles).to.be.instanceof(Array);
      expect(user.roles[0]).to.equal('writer');
    });
  });

  it('Add reader role to reader user - rest provider - as admin user - should success', function () {
    return app.service('users').patch(null, { roles: ['reader'] }, { provider: 'rest', user: adminUser, query: { email: READER.email } }).then(users => {
      const user = users[0];
      expect(user).to.be.instanceof(Object);
      expect(user.roles).to.be.instanceof(Array);
      expect(user.roles[0]).to.equal('reader');
    });
  });

  it('Add writer role to writer user - rest provider - as reader user - should failed', async function () {
    try {
      await app.service('users').patch(null, { roles: ['writer'] }, { provider: 'rest', user: readerUser, query: { email: WRITER.email } });
      assert.ok(false);
    } catch (error) {
      expect(error.code).to.equal(403);
    }
  });
});
