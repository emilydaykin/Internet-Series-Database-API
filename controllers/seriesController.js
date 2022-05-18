import Series from '../models/series.js';

// (GET) HOME
const getHomePage = async (req, res, next) => {
  return res.send('Welcome to the TV Series Database!');
};
// app.get('/', (req, res) => res.send('Welcome to the TV Series Database!'));

// (GET) ALL SERIES
const getAllSeries = async (req, res, next) => {
  try {
    const allSeries = await Series.find();
    return res.status(200).json(allSeries);
  } catch (err) {
    next(err);
  }
};

// (GET) SERIES by ID
const getSeriesBySearchTerm = async (req, res, next) => {
  try {
    console.log('params', req.params);
    const allSeries = await Series.find();
    const seriesById = allSeries.find((show) => show.id === req.params.search);
    // console.log('seriesById', seriesById);

    if (seriesById) {
      return res.status(200).json(seriesById);
    } else if (parseFloat(req.params.search)) {
      const searchTermToFloat = parseFloat(req.params.search);
      console.log('searchTermToFloat', searchTermToFloat);
      const seriesByYearOrRating = allSeries.filter(
        (show) =>
          show.pilotYear === searchTermToFloat ||
          show.finaleYear === searchTermToFloat ||
          show.rating === searchTermToFloat
      );

      console.log('seriesByYearOrRating', seriesByYearOrRating);
      if (seriesByYearOrRating.length !== 0) {
        return res.status(200).json(seriesByYearOrRating);
      } else {
        return res.status(400).json({ message: 'Series not found' });
      }
    } else {
      const searchTermLowerCase = req.params.search.toLowerCase();
      // console.log('searchTermLowerCase', searchTermLowerCase);
      const seriesByNameOrDescriptionOrGenreOrActor = allSeries.filter(
        (show) =>
          show.name.toLowerCase().includes(searchTermLowerCase) ||
          show.description.toLowerCase().includes(searchTermLowerCase) ||
          show.genre.find((showGenre) => showGenre.toLowerCase().includes(searchTermLowerCase)) ||
          show.actors.find((actor) => actor.toLowerCase().includes(searchTermLowerCase))
      );

      if (seriesByNameOrDescriptionOrGenreOrActor.length !== 0) {
        return res.status(200).json(seriesByNameOrDescriptionOrGenreOrActor);
      } else {
        return res.status(400).json({ message: 'Series not found' });
      }
    }
  } catch (err) {
    next(err);
  }
};

// (POST) CREATE SERIES
const createSeries = async (req, res, next) => {
  if (req.currentUser.isAdmin) {
    try {
      console.log('req.body', req.body);
      const newSeries = await Series.create(req.body);
      return res.status(201).json({ message: 'Created new series!', body: newSeries });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(401).send({ message: 'Unauthorised: you must be an admin to create a series' });
  }
};

// (PUT) EDIT SERIES (by ID)
const updateSeries = async (req, res, next) => {
  if (req.currentUser.isAdmin) {
    try {
      // const updatedSeries = await Series.findByIdAndUpdate(req.params.id, req.body);
      const updatedSeries = await Series.findById(req.params.id);
      updatedSeries.set(req.body);
      const savedSeries = await updatedSeries.save();
      return res.status(200).json({ message: 'Successfully updated series.', body: savedSeries });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(401).send({ message: 'Unauthorised: you must be an admin to update a series' });
  }
};

// (DELETE) SERIES (by ID)
const deleteSeries = async (req, res, next) => {
  if (req.currentUser.isAdmin) {
    try {
      // Grab the movie:
      const series = await Series.findById(req.params.id);
      // Delete the movie:
      await Series.findByIdAndRemove(req.params.id);
      return res.status(200).json({ message: 'Series successfully deleted', body: series });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(401).send({ message: 'Unauthorised: you must be an admin to delete a series' });
  }
};

// (DELETE) SERIES (by name)
// const deleteSeries = async (req, res, next) => {
//   try {
//     console.log('req.params', req.params);
//     console.log('req.params.name', req.params.name);
//     // Grab the movie:
//     const series = await Series.findById(req.params.name);
//     // Delete the movie:
//     await Series.deleteOne({ name: req.params.name });
//     // Remove this movie from all actors:
//     await Actor.updateMany({ name: series.actors }, { $pull: { series: series.name } });
//     return res.status(200).json({ message: 'Series successfully deleted', body: series });
//   } catch (err) {
//     next(err);
//   }
// };

export default {
  getHomePage,
  getAllSeries,
  getSeriesBySearchTerm,
  createSeries,
  updateSeries,
  deleteSeries
};
