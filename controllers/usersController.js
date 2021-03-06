import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { secret } from '../config/environment.js';
import Series from '../models/series.js';

const getAllUsers = async (req, res, next) => {
  if (req.currentUser.isAdmin) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  } else {
    res.status(401).send({ message: 'Unauthorised: you must be an admin to see all users' });
  }
};

// Create new user
const registerUser = async (req, res, next) => {
  try {
    if (req.body.password === req.body.passwordConfirmation) {
      delete req.body.passwordConfirmation;
      const newUser = await User.create(req.body);
      return res.status(201).json(newUser);
    } else {
      return res.status(400).json({
        status: 'failure',
        message: "Passwords don't match."
      });
    }
  } catch (err) {
    if (err.message.includes('User validation failed: password: Password')) {
      const errorMessage = err.message.split('password: ')[1];
      return res.status(400).json({
        status: 'failure',
        message: errorMessage
      });
    }

    if (err.message.includes('email: Email address invalid')) {
      return res.status(400).json({
        status: 'failure',
        message: 'Email address invalid.'
      });
    }

    if (err.message.includes('Error, expected `username` to be unique')) {
      return res.status(400).json({
        status: 'failure',
        message: 'Username already taken.'
      });
    }

    if (err.message.includes('email: Error, expected `email` to be unique')) {
      return res.status(400).json({
        status: 'failure',
        message: 'Email address already registered.'
      });
    }

    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    // Get user from database, and grab its hash:
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ status: 'failure', message: 'Unauthorised' });
    } else {
      const isValidPw = user.validatePassword(req.body.password);
      if (!isValidPw) {
        return res.status(404).json({ status: 'failure', message: 'Unauthorised' });
      } else {
        const payload = {
          userId: user._id,
          userName: user.username,
          isAdmin: user.isAdmin
        };
        const token = jwt.sign(
          payload, // payload from the token decrpyted
          secret, // the secret that only I know
          { expiresIn: '6h' } // token (login) expires in 6hrs
        );
        // 202 = accepted
        res.status(202).json({ status: 'success', token, message: 'Login successful' });
      }
    }
  } catch (err) {
    next(err);
  }
};

const addUserFavourites = async (req, res, next) => {
  try {
    // Get user via token
    if (!req.currentUser) {
      res
        .status(400)
        .json({ message: "Unauthorised. You must be logged in to 'favourite' a series" });
    } else {
      // Get series (that they clicked on):
      const series = await Series.findById(req.body.seriesId);
      const userFavouritedAlready = !!req.currentUser.favouriteSeries.find(
        (item) => item._id.toString() === req.body.seriesId
      );
      if (userFavouritedAlready) {
        // remove from favourites list if already in list
        await User.updateOne({ _id: req.currentUser._id }, { $pull: { favouriteSeries: series } });
      } else {
        // add to favourites list if not in there
        await User.updateOne({ _id: req.currentUser._id }, { $push: { favouriteSeries: series } });
      }
      const updatedUser = await User.findById(req.currentUser._id);
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    next(err);
  }
};

const getUserFavourites = async (req, res, next) => {
  try {
    if (req.params.id === req.currentUser._id.toString() || req.currentUser.isAdmin) {
      const user = await User.findById(req.params.id);
      if (!user) {
        res
          .status(400)
          .json({ status: 'failure', message: `No user found with if ${req.params.id}` });
      } else {
        res.status(200).json(user.favouriteSeries);
      }
    } else {
      res.status(401).json({
        message:
          "Unauthorised. You can't access another user's Favourites list unless you're an Admin."
      });
    }
  } catch (err) {
    next(err);
  }
};

export default { getAllUsers, registerUser, loginUser, addUserFavourites, getUserFavourites };
