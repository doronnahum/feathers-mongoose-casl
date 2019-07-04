const assert = require('assert');
const app = require('../../src/app');
const isEqualDeep = require('../../../lib/test/utils/isDeepEqualNotReference');
const {firstUser} = require('../enums');

describe('\'user\' service',  () => {
  
  it('1 - registered the user service', () => {
    const service = app.service('users');
    assert.ok(service, 'Registered the service');
  });

  context('2 - find current users', () => {
    it('should be empty', async function () {
      const service = app.service('users');
      const users = await service.find();
      isEqualDeep(
        users.data,
        []
      );
    });
  });

  context('3 - create the first user', () => {
    it('should be one user', async function () {
      const service = app.service('users');
      await service.create({email: firstUser.email, password: firstUser.password});
      const users = await service.find();
      assert.strictEqual(users.total, 1);
    });
  });

});
