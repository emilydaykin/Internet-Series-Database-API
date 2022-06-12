import { expect } from 'chai';
import setUp from './lib/setUp.js';
import tearDown from './lib/tearDown.js';
import jwt from 'jsonwebtoken';
import { secret } from '../config/environment.js';

const mockSeries = {
  name: 'Without a Trace',
  genre: ['Crime', 'Drama', 'Mystery'],
  description:
    'Series about the special FBI Missing Persons Squad that finds missing people by applying advanced psychological profiling to reveal the victims lives.',
  actors: ['Anthony LaPaglia', 'Poppy Montgomery', 'Enrique Murciano'],
  pilotYear: '2002',
  finaleYear: '2009',
  rating: '7.0',
  image:
    'https://m.media-amazon.com/images/M/MV5BZjRlNzQyN2MtMWNlYi00YTA3LTlkMGItNTY2OWZkNTkwNDgyXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_QL75_UY281_CR11,0,190,281_.jpg',
  episodes: '160',
  language: 'CBS (United States)'
};

describe('Testing REGISTER and LOG IN', () => {
  beforeEach(() => setUp());
  afterEach(() => tearDown());

  it('Assert register new user is successful (POST)', async () => {
    const resp = await api.post('/api/users').send({
      username: 'jesse',
      email: 'jesse@user.com',
      password: 'SecretPw135&',
      passwordConfirmation: 'SecretPw135&'
    });

    expect(resp.status).to.eq(201);
  });

  it('Assert error raised with incorrect register (POST)', async () => {
    const resp = await api.post('/api/users').send({
      username: 'jesse',
      email: 'jesse@user.com',
      password: 'SecretPw1!',
      passwordConfirmation: 'DifferentSecretPw!1'
    });

    expect(resp.status).to.eq(400);
    expect(resp.body.message).to.eq("Passwords don't match.");

    const anotherResp = await api.post('/api/users').send({
      username: 'jesse',
      password: 'SecretPw135&',
      passwordConfirmation: 'SecretPw135&'
    });

    expect(anotherResp.status).to.eq(500);
    expect(anotherResp.text).to.deep.include('User email required');
  });

  it('Assert login by a registered user is successful (POST)', async () => {
    const resp = await api.post('/api/login').send({
      email: 'jo@user.com',
      password: 'Password1!@'
    });

    expect(resp.status).to.eq(202);
  });

  it('Assert login by an un-registered user throws an error (POST)', async () => {
    const resp = await api.post('/api/login').send({
      email: 'unknown@user.com',
      password: 'Password1!@'
    });

    expect(resp.status).to.eq(404);
    expect(resp.body.message).to.deep.include('Unauthorised');
  });
});

let userToken;
let userId;
let seriesId;

describe('Testing User (non-admin) Authentication (Favourites)', () => {
  beforeEach(() => setUp());
  beforeEach(async () => {
    // Get user token and id:
    const resp = await api
      .post('/api/login')
      .send({ email: 'jo@user.com', password: 'Password1!@' });
    userToken = resp.body.token;
    const jwtDecoded = jwt.verify(userToken, secret);
    userId = jwtDecoded.userId;

    // Get series id:
    const seriesResp = await api.get('/api/series/arrested');
    seriesId = seriesResp.body[0]._id;
  });

  afterEach(() => tearDown());

  it("Assert fetching user's favourites series is successful (GET)", async () => {
    // this is essentially a request to update (PUT) the user object
    const resp = await api.get(`/api/users/${userId}`).set('Authorization', `Bearer ${userToken}`);
    expect(resp.status).to.eq(200);
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(0); // no favourites yet
  });

  it("Assert error when a userId and token don't match when fetching favoutites (GET)", async () => {
    const resp = await api
      .get(`/api/users/62a4be404e12b72e2`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(resp.status).to.eq(401);
    expect(resp.body.message).to.deep.include('Unauthorised'); // always use _deep_ include
  });

  it("Assert adding users' favourites series is successful (PUT)", async () => {
    // this is essentially a request to update (PUT) the user object
    const resp = await api
      .put('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ seriesId: seriesId });
    expect(resp.status).to.eq(200);
    expect(resp.body.email).to.eq('jo@user.com');
    expect(resp.body.favouriteSeries).to.be.an('array');
    expect(resp.body.favouriteSeries.length).to.eq(1);
    expect(resp.body.favouriteSeries[0].name).to.eq('Arrested Development');
  });

  it("Assert removing users' favourites series is successful (PUT)", async () => {
    // Adding a series to the user's favourites list:
    const favouriting = await api
      .put('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ seriesId: seriesId });
    expect(favouriting.status).to.eq(200);
    expect(favouriting.body.email).to.eq('jo@user.com');
    expect(favouriting.body.favouriteSeries).to.be.an('array');
    expect(favouriting.body.favouriteSeries.length).to.eq(1);
    expect(favouriting.body.favouriteSeries[0].name).to.eq('Arrested Development');

    // Calling the same endpoint again (which should REMOVE the series from the list):
    const unFavouriting = await api
      .put('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ seriesId: seriesId });
    expect(unFavouriting.status).to.eq(200);
    expect(unFavouriting.body.email).to.eq('jo@user.com');
    expect(unFavouriting.body.favouriteSeries).to.be.an('array');
    expect(unFavouriting.body.favouriteSeries.length).to.eq(0);
  });
});

let adminToken;

describe('Testing Admin Authentication', () => {
  beforeEach(() => setUp());
  beforeEach(async () => {
    // Get admin token:
    const adminResp = await api
      .post('/api/login')
      .send({ email: 'abc@user.com', password: 'Password1!@' });
    adminToken = adminResp.body.token;

    // Get user token:
    const userResp = await api
      .post('/api/login')
      .send({ email: 'jo@user.com', password: 'Password1!@' });
    userToken = userResp.body.token;
  });

  afterEach(() => tearDown());

  it('Assert admins can fetch all users (GET)', async () => {
    const resp = await api.get('/api/users').set('Authorization', `Bearer ${adminToken}`);
    // console.log(resp);
    expect(resp.status).to.eq(200);
    expect(resp.body).to.be.an('array');
    expect(resp.body.length).to.eq(3);
  });

  it('Assert error when non-admins try to fetch all users (GET)', async () => {
    const normalUserResp = await api.get('/api/users').set('Authorization', `Bearer ${userToken}`);
    expect(normalUserResp.status).to.eq(401);

    const unauthenticatedResp = await api.get('/api/users');
    expect(unauthenticatedResp.status).to.eq(401);
  });

  it('Assert admins can create/add a new series to the catalogue (POST & GET)', async () => {
    const postResp = await api
      .post('/api/series')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(mockSeries);
    expect(postResp.status).to.eq(201);

    // Check it's really there:
    const getResp = await api.get('/api/series/without a trace');
    expect(getResp.status).to.eq(200);
    expect(getResp.body).to.be.an('array');
    expect(getResp.body.length).to.eq(1);
    expect(getResp.body[0].genre).to.deep.include.members(['Crime', 'Drama', 'Mystery']);
  });

  it("Assert users can't create/add a new series to the catalogue (POST)", async () => {
    const resp = await api
      .post('/api/series')
      .set('Authorization', `Bearer ${userToken}`)
      .send(mockSeries);

    expect(resp.status).to.eq(401);
    expect(resp.body.message).to.deep.include(
      'Unauthorised: you must be an admin to create a series'
    );
  });

  it('Assert wrong token error message when creating/adding a new series to the catalogue (POST)', async () => {
    const resp = await api
      .post('/api/series')
      .set('Authorization', `Bearer dfg6546df4g5sd4fg5er54erg6`)
      .send(mockSeries);

    expect(resp.status).to.eq(400);
    expect(resp.body.message).to.deep.include('Unauthorised. Token not verified.');
  });

  it("Assert unauthenticated users can't create/add a new series to the catalogue (POST)", async () => {
    const resp = await api.post('/api/series').send(mockSeries);

    expect(resp.status).to.eq(401);
    expect(resp.body.message).to.deep.include('Unauthorised. No token or invalid token.');
  });
});
