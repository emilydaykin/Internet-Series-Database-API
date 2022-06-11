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

  it('Assert GET request returns an array of 2 series with reviews', async () => {
    const resp = await api.get('/api/series');
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(2);
    resp.body.forEach((series) => {
      expect(series.comments).to.be.an('array');
      expect(series.comments.length).to.eq(1);
      expect(series.comments[0].createdByName).to.eq('jo');
    });
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

  it('Assert POST request for creating series unauthorised if not admin (if no token present)', async () => {
    const resp = await api.post('/api/series').send({
      name: 'White Collar',
      genre: ['Comedy', 'Crime', 'Drama'],
      description:
        'A white-collar criminal agrees to help the FBI catch other white-collar criminals using his expertise as an art and securities thief, counterfeiter, and conman.',
      actors: ['Matt Bomer', 'Tim DeKay', 'Willie Garson'],
      pilotYear: 2009,
      finaleYear: 2014,
      rating: 8.3,
      image:
        'https://m.media-amazon.com/images/M/MV5BNDI5MDgyMTYzNF5BMl5BanBnXkFtZTcwMjAwNzk1Mw@@._V1_QL75_UY281_CR9,0,190,281_.jpg',
      comments: []
    });
    expect(resp.status).to.eq(401);
    expect(resp.body.message).to.eq('Unauthorised. No token or invalid token.');
  });
});
