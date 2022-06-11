import Series from '../../models/series.js';
import User from '../../models/user.js';
import { assert } from 'chai';

export default async function setUp() {
  // Create some mock data
  await Series.create([
    {
      name: 'Arrested Development',
      genre: ['Comedy'],
      description:
        'Level-headed son Michael Bluth takes over family affairs after his father is imprisoned. But the rest of his spoiled, dysfunctional family are making his job unbearable.',
      actors: ['Jason Bateman', 'Michael Cera', 'Portia de Rossi'],
      pilotYear: 2003,
      finaleYear: 2019,
      rating: 8.7,
      image:
        'https://m.media-amazon.com/images/M/MV5BNTFlYTE2YTItZmQ1NS00ZWQ5LWI3OGUtYTQzNDMyZmEyYTZjXkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_.jpg',
      comments: []
    },
    {
      name: 'Inventing Anna',
      genre: ['Drama'],
      description:
        "A journalist with a lot to prove investigates the case of Anna Delvey, the Instagram-legendary German heiress who stole the hearts of New York's social scene - and stole their money as well.",
      actors: ['Anna Chlumsky', 'Julia Garner', 'Arian Moayed'],
      pilotYear: 2022,
      finaleYear: '',
      rating: 6.8,
      image:
        'https://m.media-amazon.com/images/M/MV5BM2QzMWM5OTgtZDE1MC00ZmMyLWIyODItMmQ4NjNlZGRjYTUzXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg',
      comments: []
    }
  ]);

  const users = await User.create(
    { username: 'jo', email: 'jo@user.com', password: 'Password1!@' },
    { username: 'abc', email: 'abc@user.com', password: 'Password1!@', isAdmin: true }
  );

  assert.ok(true);
}
