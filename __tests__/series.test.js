import { expect } from 'chai';
import setUp from './lib/setUp.js';
import tearDown from './lib/tearDown.js';

describe('Testing GET series for unauthenticated users', () => {
  // Set up environment before each test (seed db with test data)
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

  it('Assert GET request returns an array of 2 series', async () => {
    const resp = await api.get('/api/series');
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(2);
  });

  it('Assert GET request returns correct results from a search parameter', async () => {
    // search term = 'arrested'
    const resp = await api.get('/api/series/arrested');
    expect(resp.status).to.eq(200);
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(1);
    expect(resp.body[0].name).to.eq('Arrested Development');
  });

  it('Assert GET request returns no results if search parameter not found', async () => {
    const resp = await api.get('/api/series/unknownSeries');
    expect(resp.status).to.eq(200);
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(0);
  });
});

describe('Testing POST series for unauthenticated users', () => {
  beforeEach(() => setUp());
  afterEach(() => tearDown());

  it('Assert POST request returns correct results when filtering by genre', async () => {
    const resp = await api
      .post('/api/series/genre/search')
      .set('Content-type', 'application/json') // no need
      .send({ genres: ['drama'] });
    expect(resp.status).to.eq(200);
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(1);
    expect(resp.body[0].name).to.eq('Inventing Anna');
  });

  it('Assert POST request returns no results if genre (combination) not found', async () => {
    const resp = await api
      .post('/api/series/genre/search')
      .set('Content-type', 'application/json') // no need
      .send({ genres: ['drama', 'mystery', 'thriller'] });
    expect(resp.status).to.eq(200);
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(0);
  });
});
