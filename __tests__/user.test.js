import { expect } from 'chai';
import setUp from './lib/setUp.js';
import tearDown from './lib/tearDown.js';
import jwt from 'jsonwebtoken';
import { secret } from '../config/environment.js';

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

  it('Assert login by a registered user is successful (POST)', async () => {
    const resp = await api.post('/api/login').send({
      email: 'jo@user.com',
      password: 'Password1!@'
    });

    expect(resp.status).to.eq(202);
  });
});

let userToken;
let userId;
let seriesId;

describe('Testing Non-Admin Authentication', () => {
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
    // console.log('seriesResp', seriesResp.body[0]._id);
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

  it("Assert error when a userId and token don't match", async () => {
    const resp = await api
      .get(`/api/users/62a4be404e12b72e2`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(resp.status).to.eq(401);
    expect(resp.body.message).to.include('Unauthorised');
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
