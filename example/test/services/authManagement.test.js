require('./authentication.test');

const { TEST_USERS } = require('../enums');

const { ADMIN } = TEST_USERS;
const assert = require('assert');
// const { expect } = require('chai');
const app = require('../../src/app');

describe('\'authManagement\' service', () => {
  const authManagementService = app.service('authManagement');

  it('Registered the authManagement service', () => {
    assert.ok(authManagementService, 'Registered the service');
  });

  it('Check unique email - should failed', async function () {
    try {
      await authManagementService.create({
        'action': 'checkUnique',
        'value': {
          'email': ADMIN.email
        }
      }, { provider: 'rest' });
      assert.ok(false, 'verify not failed as except');
    } catch (error) {
      assert.ok(error.code === 400 && error.message.includes('already'), 'verify  failed as except');
    }
  });

});
