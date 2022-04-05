// To connect and disconnect from MongoBD

import mongoose from 'mongoose';
import { dbURL } from '../config/environment.js';

export function connectToDb() {
  mongoose.connect(dbURL);
}

export function disconnectFromDb() {
  if (mongoose.connection.readyState !== 0) {
    mongoose.disconnect(dbURL);
  }
}
