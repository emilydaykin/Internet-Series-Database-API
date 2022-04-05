import { connectToDb, disconnectFromDb } from './helpers.js';
import data from './data.js';
import Series from '../models/series.js';
// import Actor from '../models/actor.js';
import User from '../models/user.js';

async function seed() {
  await connectToDb();
  console.log('Connected to Mongo DB via Mongoose');
  await Series.deleteMany({}); // clear all before populating
  const series = await Series.create(data.series);
  console.log(`Seeded ${series.length} series 🎥🍿`);
  // await Actor.deleteMany({}); // clear all before populating
  // const actors = await Actor.create(data.actors);
  // console.log(`Seeded ${actors.length} actors 🎭`);
  await User.deleteMany({}); // clear all before populating
  const users = await User.create(data.users);
  console.log(`Seeded ${users.length} users 👥`);
  await disconnectFromDb();
  console.log('Disconnected from Mongo DB.');
}

seed();
