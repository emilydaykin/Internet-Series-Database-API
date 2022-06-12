// This should probably go in user.test.js or series.test.js,
// rather than its own separate file, since it's not its own
// model, but embedded in the Series one...

import { expect } from 'chai';
import setUp from './lib/setUp.js';
import tearDown from './lib/tearDown.js';
import jwt from 'jsonwebtoken';
import { secret } from '../config/environment.js';

let userToken;
let anotherUserToken;
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
    // Get a user token (the one who's written comments):
    const resp = await api
      .post('/api/login')
      .send({ email: 'jo@user.com', password: 'Password1!@' });
    userToken = resp.body.token;
    const jwtDecoded = jwt.verify(userToken, secret);
    userId = jwtDecoded.userId;

    // Get another user's token (who's written no comments):
    const secondResp = await api
      .post('/api/login')
      .send({ email: 'nacho@user.com', password: 'Password1!@' });
    anotherUserToken = secondResp.body.token;

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
    expect(targetComment.rating).to.eq(4);
    expect(targetComment.createdById).to.eq(userId);
    expect(targetComment.createdByName).to.eq('jo');
  });

  it('Assert error when unauthenticated user tries to leave a review on a series', async () => {
    const resp = await api.post(`/api/series/${seriesId}/comments`).send(mockComment);
    expect(resp.status).to.eq(401);
    expect(resp.body.message).to.deep.include('Unauthorised. No token or invalid token.');
  });

  it('Assert user can delete their own reviews', async () => {
    // Get comment id to delete:
    const getResp = await api.get('/api/series/arrested');
    const commentsInitial = getResp.body[0].comments;
    expect(commentsInitial[0].createdById).to.eq(userId);
    const commentId = commentsInitial[0]._id;

    const delResp = await api
      .delete(`/api/series/${seriesId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(delResp.status).to.eq(200);
    expect(delResp.body.comments.length).to.eq(0);

    const getRespAfterDelete = await api.get('/api/series/arrested');
    const commentsAfterDelete = getRespAfterDelete.body[0].comments;
    expect(commentsAfterDelete.length).to.eq(0);
  });

  it("Assert user can't delete others' reviews", async () => {
    // Get comment id to delete (written by Jo):
    const getResp = await api.get('/api/series/arrested');
    const commentsInitial = getResp.body[0].comments;
    expect(commentsInitial[0].createdById).to.eq(userId);
    const commentId = commentsInitial[0]._id;

    // Nacho tries to delete Jo's comment
    const delResp = await api
      .delete(`/api/series/${seriesId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${anotherUserToken}`);
    expect(delResp.status).to.eq(401);
    expect(delResp.body.message).to.deep.include('Unauthorised');
  });
});
