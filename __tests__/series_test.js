import { expect } from 'chai';
import setUp from './lib/setUp.js';
import tearDown from './lib/tearDown.js';

describe('Testing GET series', () => {
  // Set up environemnt before each test (seed db with test data)
  beforeEach(() => setUp());

  // clear out db after each test to keep testing environment consistent
  afterEach(() => tearDown());

  it('Assert GET request returns a 200 response', async () => {
    // Using async-await:
    const resp = await api.get('/api/series'); // `api` is from Supertest
    expect(resp.status).to.eq(200);
    // Or by returning a Promise:
    // api.get('/api/series').end((err, res) => {
    //   expect(res.status).to.eq(200);
    // });
  });
});
