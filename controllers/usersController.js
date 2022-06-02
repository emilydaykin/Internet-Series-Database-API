import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { secret } from '../config/environment.js';

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
  // console.log('req.body', req.body);
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
      console.log('------errorMessage:', errorMessage);
      res.status(400).json({
        status: 'failure',
        message: errorMessage
      });
      console.log('------ password error message:', err.message);
      console.log('------');
    }

    if (err.message.includes('email: Email address invalid')) {
      res.status(400).json({
        status: 'failure',
        message: 'Email invalid'
      });
    }

    if (err.message.includes('email: Error, expected `email` to be unique')) {
      res.status(400).json({
        status: 'failure',
        message: 'Email already registered'
      });
    }

    if (err.message.includes('Error, expected `username` to be unique')) {
      res.status(400).json({
        status: 'failure',
        message: 'Username taken'
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
        const payload = { userId: user._id, userName: user.username, isAdmin: user.isAdmin };
        console.log({ payload });
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

export default { getAllUsers, registerUser, loginUser };
