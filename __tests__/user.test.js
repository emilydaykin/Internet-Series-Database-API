import { expect } from 'chai';
import setUp from './lib/setUp.js';
import tearDown from './lib/tearDown.js';

describe('Testing Authentication', () => {
  beforeEach(() => setUp());
  afterEach(() => tearDown());

  it('Assert REGISTER new user is successful', async () => {
    const resp = await api.post('/api/users').send({
      username: 'jesse',
      email: 'jesse@user.com',
      password: 'SecretPw135&',
      passwordConfirmation: 'SecretPw135&'
    });

    expect(resp.status).to.eq(201);
  });

  it('Assert LOG IN by a registered user is successful', async () => {
    const resp = await api.post('/api/login').send({
      email: 'jo@user.com',
      password: 'Password1!@'
    });

    expect(resp.status).to.eq(202);
  });
});
