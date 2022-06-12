// This should probably go in user.test.js or series.test.js,
// rather than its own separate file, since it's not its own
// model, but embedded in the Series one...

import { expect } from 'chai';
import setUp from './lib/setUp.js';
import tearDown from './lib/tearDown.js';
import jwt from 'jsonwebtoken';
import { secret } from '../config/environment.js';

let userToken;
let userId;
let seriesId;

const mockComment = {
  text: 'Not bad',
  rating: 4,
  createdById: userId
};

describe('Testing COMMENTS', () => {
  beforeEach(() => setUp());
  beforeEach(async () => {
    // Get a user token:
    const resp = await api
      .post('/api/login')
      .send({ email: 'jo@user.com', password: 'Password1!@' });
    userToken = resp.body.token;
    const jwtDecoded = jwt.verify(userToken, secret);
    userId = jwtDecoded.userId;

    // Get a series id:
    const seriesResp = await api.get('/api/series/arrested');
    seriesId = seriesResp.body[0]._id;
  });
  afterEach(() => tearDown());

  it('Assert user can create a review on a series (POST)', async () => {
    const resp = await api
      .post(`/api/series/${seriesId}/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(mockComment);
    expect(resp.status).to.eq(201);

    // check comment is there:
    const getResp = await api.get('/api/series/arrested');
    expect(getResp.body).to.be.an('array');
    expect(getResp.body.length).to.eq(1);
    const comments = getResp.body[0].comments;
    expect(comments).to.be.an('array');
    expect(comments.length).to.eq(2);
    const targetComment = comments.find((comment) => comment.text === 'Not bad');
    console.log('targetComment', targetComment);
    expect(targetComment.rating).to.eq(4);
    expect(targetComment.createdById).to.eq(userId);
    expect(targetComment.createdByName).to.eq('jo');
  });

  // TODO
  // it('Assert error when unauthenticated user tries to leave a review on a series', async () => {});

  // TODO
  // it('Assert user can delete their own reviews', async () => {});

  // TODO
  // it("Assert user can't delete others' reviews", async () => {});
});
