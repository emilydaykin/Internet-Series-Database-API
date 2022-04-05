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
  try {
    // console.log('req.body', req.body);
    if (req.body.password === req.body.passwordConfirmation) {
      delete req.body.passwordConfirmation;
      // console.log('req.body after delete', req.body);
      const newUser = await User.create(req.body);
      return res.status(201).json(newUser);
    } else {
      res.status(400).json({
        status: 'failure',
        message: "Passwords don't match, or you haven't provided a password confirmation"
      });
    }
  } catch (err) {
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
        const payload = { userId: user._id, isAdmin: user.isAdmin };
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
