import jwt from 'jsonwebtoken';
import { secret } from '../config/environment.js';
import User from '../models/user.js';

// This is also a middleware!!!
const secureRoute = async (req, res, next) => {
  try {
    // Get jwt token from headers of request
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer')) {
      return res.status(401).send({ message: 'Unauthorised. No token or invalid token.' });
    } else {
      const token = authToken.replace('Bearer ', '');
      jwt.verify(token, secret, async (err, data) => {
        if (err) {
          return res.status(400).send({ message: 'Unauthorised. Token not verified.' });
        } else {
          // console.log('data', data);
          const user = await User.findById(data.userId);
          if (!user) {
            return res.status(400).send({ message: 'Unauthorised. No user found.' });
          } else {
            req.currentUser = user;
            next();
          }
        }
      });
    }
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorised' });
  }
};

export default secureRoute;
