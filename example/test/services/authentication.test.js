require('./users.test');

const { TEST_USERS } = require('../enums');

const { ADMIN, WRITER } = TEST_USERS;
const assert = require('assert');
const { expect } = require('chai');
const app = require('../../src/app');

describe('\'authentication\' service', () => {
  const authenticationService = app.service('authentication');
  it('Registered the authentication service', () => {
    assert.ok(authenticationService, 'Registered the service');
  });

  it('Try to login with admin user - should get user and token', async function () {
    const response = await authenticationService.create({
      strategy: 'local',
      email: ADMIN.email,
      password: ADMIN.password
    }, { provider: 'rest' });
    expect(response).to.be.instanceof(Object);
    expect(response).to.have.property('accessToken');
    expect(response).to.have.property('user');
    expect(response.user).to.be.instanceof(Object);
    expect(response.user).to.have.property('_id');
    expect(response.user).to.not.have.property('password');
  });

  it('Try to login with writer user - wrong password - should failed', async function () {
    try {
      await authenticationService.create({
        strategy: 'local',
        email: WRITER.email,
        password: 'some-wrong-password'
      }, { provider: 'rest' });
      assert.ok(false, 'login not failed as except');
    } catch (error) {
      assert.ok(error.code === 401, 'login failed as except');
    }
  });
});
