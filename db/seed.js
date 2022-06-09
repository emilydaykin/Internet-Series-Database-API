import { connectToDb, disconnectFromDb } from './helpers.js';
import data from './data/data.js';
import Series from '../models/series.js';
import User from '../models/user.js';

const createComment = (text, rating, createdById, createdByName) => {
  return {
    text: text,
    rating: rating,
    createdById: createdById,
    createdByName: createdByName
  };
};

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

  const user1 = await User.findOne({ username: 'sierra' });
  const user2 = await User.findOne({ username: 'alec' });
  const user3 = await User.findOne({ username: 'fabiane' });

  const blacklist = await Series.findOne({ name: /blacklist/i });
  const lastDance = await Series.findOne({ name: /last dance/i });
  const goodPlace = await Series.findOne({ name: /good place/i });
  const tedLasso = await Series.findOne({ name: /ted lasso/i });
  const dark = await Series.findOne({ name: /dark/i });
  const mrRobot = await Series.findOne({ name: /robot/i });
  const laBrea = await Series.findOne({ name: /la brea/i });
  const office = await Series.findOne({ name: /office/i });
  const modernFamily = await Series.findOne({ name: /modern family/i });
  console.log('modernFamily', modernFamily);

  const generatedComments = [
    blacklist.comments.push(
      createComment('Absolutely fantastic - a must watch!', 5, user1._id, user1.username)
    ),
    blacklist.comments.push(
      createComment(
        'Started off amazingly, but underlying story dragged out...',
        4,
        user2._id,
        user2.username
      )
    ),
    lastDance.comments.push(
      createComment(
        "Breath-taking. Can't believe they had all that terrific footage. For all the sports fans out there.",
        5,
        user1._id,
        user1.username
      )
    ),
    lastDance.comments.push(
      createComment(
        "I'm not one for documentaries, but this one was great",
        3,
        user3._id,
        user3.username
      )
    ),
    goodPlace.comments.push(
      createComment(
        'This saved my mental state during the first lockdown of the pandemic - thank you!',
        5,
        user2._id,
        user2.username
      )
    ),
    goodPlace.comments.push(
      createComment(
        'A great, heart-warming, story. Never dragged on, but sometimes a bit childish...',
        4,
        user3._id,
        user3.username
      )
    ),
    tedLasso.comments.push(
      createComment(
        'This got me through the pandemic. Such a feel-good show with great actors and engaging plot throughout - I really hope it never ends!',
        5,
        user1._id,
        user1.username
      )
    ),
    tedLasso.comments.push(
      createComment(
        "Everyone stop what you're doing and go watch it. The british was sometimes hard to understand though...",
        4,
        user2._id,
        user2.username
      )
    ),
    dark.comments.push(
      createComment(
        'Started off incredibly well, had me hooked. But the ending was a huge letdown',
        2,
        user2._id,
        user2.username
      )
    ),
    dark.comments.push(
      createComment(
        "Not for me. Too scary, and didn't understand it cus it was all in German.",
        1,
        user3._id,
        user3.username
      )
    ),
    dark.comments.push(
      createComment('Brilliant! Casting was great.', 5, user1._id, user1.username)
    ),
    mrRobot.comments.push(
      createComment(
        "Terrible. Couldn't get past the second episode. Also too much drug exposure. If i could give this a zero I would",
        1,
        user3._id,
        user3.username
      )
    ),
    laBrea.comments.push(
      createComment(
        "Super cool show! Can't wait to catch the next season.",
        4,
        user1._id,
        user1.username
      )
    ),
    office.comments.push(
      createComment(
        "A classic. If you haven't already watched the entire thing 3 times over, what are you doing with your life?",
        5,
        user2._id,
        user2.username
      )
    ),
    modernFamily.comments.push(
      createComment(
        "Hands down the best show ever made. Heart-warming, hilarious, and you're sure to go away with wonderful life lessons. Why didn't this continue forever like Grey's Anatomy?",
        5,
        user3._id,
        user3.username
      )
    )
  ];

  await blacklist.save();
  await lastDance.save();
  await goodPlace.save();
  await tedLasso.save();
  await dark.save();
  await mrRobot.save();
  await laBrea.save();
  await office.save();
  await modernFamily.save();

  console.log(`Seeded ${generatedComments.length} comments 💬`);

  await disconnectFromDb();
  console.log('Disconnected from Mongo DB.');
}

seed();
