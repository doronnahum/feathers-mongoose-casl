require('./users.test');
require('./authentication.test');

const assert = require('assert');
const app = require('../../src/app');

describe('\'posts\' service', () => {
  it('registered the service', async () => {
    const service = app.service('posts');
    const p = await service.find();
    // eslint-disable-next-line no-console
    console.log({ p });
    assert.ok(service, 'Registered the service');
  });
});
