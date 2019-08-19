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
    it('should get user and token', async function () {
      const service = app.service('authentication');
      const response = await service.create({
        strategy: 'local',
        email: firstUser.email,
        password: firstUser.password
      });
      // eslint-disable-next-line no-console
      console.log('----------');
      // eslint-disable-next-line no-console
      console.log({ response });
      const users = await app.service('users').find();
      // eslint-disable-next-line no-console
      console.log({ users });
      assert.ok(response.accessToken && response.user && response.user._id, 'login pass');
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
