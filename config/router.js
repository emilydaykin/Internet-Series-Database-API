import express from 'express';
import seriesController from '../controllers/seriesController.js';
import usersController from '../controllers/usersController.js';
import commentsController from '../controllers/commentsController.js';
import secureRoute from '../middleware/secureRoute.js';

const router = express.Router();

router.route('/').get(seriesController.getHomePage);

router
  .route('/series')
  .get(seriesController.getAllSeries)
  .post(secureRoute, seriesController.createSeries); // admin only

router.route('/series/:search').get(seriesController.getSeriesBySearchTerm);

router.route('/series/genre/search').post(seriesController.filterSeriesByGenre);

router
  .route('/series/:id')
  .put(secureRoute, seriesController.updateSeries) // admin only
  .delete(secureRoute, seriesController.deleteSeries); // admin only

router.route('/series/:id/comments').post(secureRoute, commentsController.createComment);

router
  .route('/series/:id/comments/:commentId')
  .post(secureRoute, commentsController.updateComment)
  .delete(secureRoute, commentsController.deleteComment);

// router.route('/series/:name').delete(seriesController.deleteSeries);

router
  .route('/users')
  .get(secureRoute, usersController.getAllUsers) // admin only
  .post(usersController.registerUser)
  .put(secureRoute, usersController.addUserFavourites); // logged in users only

router.route('/users/:id').get(secureRoute, usersController.getUserFavourites); // the same logged in user or admin only

router.route('/login').post(usersController.loginUser);

export default router;
