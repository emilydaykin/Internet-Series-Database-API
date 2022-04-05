// const createSeries = (name, genre, description, actors, pilotYear, finaleYear, rating, image) => {
//   return {
//     name: name,
//     genre: genre,
//     description: description,
//     actors: actors,
//     pilotYear: pilotYear,
//     finaleYear: finaleYear,
//     rating: rating,
//     image: image
//   };
// };

// const series = [
//   createSeries(
//     'The Blacklist',
//     ['Crime', 'Drama', 'Mystery'],
//     'A new FBI profiler, Elizabeth Keen, has her entire life uprooted when a mysterious criminal, Raymond Reddington, who has eluded capture for decades, turns himself in and insists on speaking only to her.',
//     // ['James Spader', 'Megan Boone'],
//     [],
//     2013,
//     'ongoing',
//     8.1,
//     'https://pictures.betaseries.com/fonds/poster/f6e33b2e1607c9581d623a317be5aba2.jpg'
//   ),
//   createSeries(
//     'Modern Family',
//     ['Comedy', 'Drama', 'Romance'],
//     'Three different but related families face trials and tribulations in their own uniquely comedic ways.',
//     // ['Julie Bowen', 'Sofia Vergara'],
//     [],
//     2009,
//     2020,
//     8.5,
//     'https://flxt.tmsimg.com/assets/p8257662_b_v8_ab.jpg'
//   ),
//   createSeries(
//     'Person of Interest',
//     ['Action', 'Crime', 'Drama'],
//     "An ex-CIA agent and a wealthy programmer save lives via a surveillance AI that sends them the identities of civilians involved in impending crimes. However, the details of the crimes, including the civilians' roles, are left a mystery.",
//     // ['Jim Caviezel', 'Taraji P. Henson'],
//     [],
//     2011,
//     2016,
//     8.5,
//     'https://m.media-amazon.com/images/M/MV5BZDU1NzA5YzUtNTdmNy00NTVjLWFhNzEtYWI1NmNkNTA1ZDBhXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg'
//   ),
//   createSeries(
//     'The Good Doctor',
//     ['Drama'],
//     'Shaun Murphy, a young surgeon with autism and Savant syndrome, is recruited into the surgical unit of a prestigious hospital.',
//     // ['Freddie Highmore', 'Christina Chang'],
//     [],
//     2017,
//     'ongoing',
//     8.2,
//     'https://flxt.tmsimg.com/assets/p14159625_b1t_v9_aa.jpg'
//   ),
//   createSeries(
//     'Sherlock',
//     ['Crime', 'Drama', 'Mystery'],
//     'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.',
//     // ['Benedict Cumberbatch', 'Martin Freeman'],
//     [],
//     2010,
//     2017,
//     9.1,
//     'https://m.media-amazon.com/images/M/MV5BMWY3NTljMjEtYzRiMi00NWM2LTkzNjItZTVmZjE0MTdjMjJhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTQ4NTc5OTU@._V1_FMjpg_UX1000_.jpg'
//   ),
//   createSeries(
//     'Once Upon a Time',
//     ['Adventure', 'Fantasy', 'Romance'],
//     'A young woman with a troubled past is drawn to a small town in Maine where fairy tales are to be believed.',
//     // ['Lana Parilla', 'Jennifer Morrison'],
//     [],
//     2011,
//     2018,
//     7.9,
//     'https://m.media-amazon.com/images/M/MV5BNjBmZmI0ZDktODI2MS00MDU1LTk0NDYtNGE0MDc0OWVkYzcwXkEyXkFqcGdeQXVyMzAzNTY3MDM@._V1_.jpg'
//   )
// ];

import { readFileSync } from 'fs';

let rawdata = readFileSync('series.json');
let series = JSON.parse(rawdata);
console.log(series);

const createUser = (username, email, password, isAdmin = false) => {
  return {
    username: username,
    email: email,
    password: password,
    isAdmin: isAdmin
  };
};

const users = [
  createUser('normal_user', 'normal@user.com', 'Password1!@'),
  createUser('admin', 'admin@user.com', 'Password1!@', true)
];

// export default { series, users };
