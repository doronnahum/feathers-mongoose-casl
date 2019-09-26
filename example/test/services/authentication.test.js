require('./users.test');

const { firstUser } = require('../enums');
const assert = require('assert');
const app = require('../../src/app');
// const isEqualDeep = require('../../../lib/test/utils/isDeepEqualNotReference');

describe('\'authentication\' service', () => {
  it('1 - registered the authentication service', () => {
    const service = app.service('authentication');
    assert.ok(service, 'Registered the service');
  });

  context('2 - try to login the first user', () => {
    it('should be empty', async function () {
      const service = app.service('authentication');
      const token = await service.create({
        strategy: 'local',
        email: firstUser.email,
        password: firstUser.password
      });
      assert.ok(token.accessToken && token.user && token.user._id, 'login pass');
    });
  });

  // context('2 - create the first user', () => {
  //   it('should be one user', async function () {
  //     const service = app.service('users');
  //     await service.create({email: 'doron.nahum@gmail.com', password: 'password'});
  //     const users = await service.find();
  //     assert.strictEqual(users.total, 1);
  //   });
  // });
});
