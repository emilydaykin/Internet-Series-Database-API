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

// (GET) SERIES by search term
const getSeriesBySearchTerm = async (req, res, next) => {
  try {
    const allSeries = await Series.find();
    const seriesById = allSeries.find((show) => show.id === req.params.search);

    if (seriesById) {
      return res.status(200).json(seriesById);
    } else if (parseFloat(req.params.search)) {
      const searchTermToFloat = parseFloat(req.params.search);
      const seriesByYearOrRating = allSeries.filter(
        (show) =>
          show.pilotYear === searchTermToFloat ||
          show.finaleYear === searchTermToFloat ||
          show.rating === searchTermToFloat
      );

      return res.status(200).json(seriesByYearOrRating);
    } else {
      const searchTermLowerCase = req.params.search.toLowerCase();
      const seriesByNameOrDescriptionOrGenreOrActor = allSeries.filter(
        (show) =>
          show.name.toLowerCase().includes(searchTermLowerCase) ||
          show.description.toLowerCase().includes(searchTermLowerCase) ||
          show.genre.find((showGenre) => showGenre.toLowerCase().includes(searchTermLowerCase)) ||
          show.actors.find((actor) => actor.toLowerCase().includes(searchTermLowerCase))
      );

      return res.status(200).json(seriesByNameOrDescriptionOrGenreOrActor);
    }
  } catch (err) {
    next(err);
  }
};

// (GET) filter series by genre (only)
const filterSeriesByGenre = async (req, res, next) => {
  try {
    const allSeries = await Series.find();

    if (req.body.genres) {
      const seriesByGenre = allSeries.filter((show) => {
        const intersection = show.genre.filter((showGenre) =>
          req.body.genres.includes(showGenre.toLowerCase())
        );
        return intersection.length === req.body.genres.length;
      });
      return res.status(200).json(seriesByGenre);
    }
  } catch (err) {
    next(err);
  }
};

// (POST) CREATE SERIES
const createSeries = async (req, res, next) => {
  if (req.currentUser.isAdmin) {
    try {
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

export default {
  getHomePage,
  getAllSeries,
  getSeriesBySearchTerm,
  filterSeriesByGenre,
  createSeries,
  updateSeries,
  deleteSeries
};
