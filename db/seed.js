import { connectToDb, disconnectFromDb } from './helpers.js';
import data from './data/data.js';
import Series from '../models/series.js';
import User from '../models/user.js';

async function seed() {
  // MAKE SURE THE DATABASE IS RUNNING LOCALLY if dev!!!!!
  await connectToDb();
  console.log('Connected to Mongo DB via Mongoose.');
  await Series.deleteMany({}); // clear all before populating
  const series = await Series.create(data.series);
  console.log(`Seeded ${series.length} series 🎥🍿`);
  await User.deleteMany({}); // clear all before populating
  const users = await User.create(data.users);
  console.log(`Seeded ${users.length} users 👥`);
  await disconnectFromDb();
  console.log('Disconnected from Mongo DB.');
}

seed();
