import Actor from '../models/actor.js';
import Series from '../models/series.js';

const getAllActors = async (req, res, next) => {
  try {
    const actors = await Actor.find();
    return res.status(200).json(actors);
  } catch (err) {
    next(err);
  }
};

// POST
const createActor = async (req, res, next) => {
  if (req.currentUser.isAdmin) {
    try {
      const newActor = await Actor.create(req.body);
      await Series.updateMany({ _id: newActor.series }, { $push: { actors: newActor._id } });
      // await Series.updateMany({ name: newActor.series }, { $push: { actors: newActor.name } });
      return res.status(201).json(newActor);
    } catch (err) {
      next(err);
    }
  } else {
    res.status(401).send({ message: 'Unauthorised: you must be an admin to create an actor' });
  }
};

const getAllSeriesForActor = async (req, res, next) => {
  try {
    console.log('req.params', req.params);
    // console.log('req.params.name', req.params.name);

    // const actor = await Actor.findById(req.params.id).populate('series');
    const actor = await Actor.findOne({ name: req.params.name });
    const allActors = await Actor.find();
    if (actor) {
      return res.status(200).json(actor.series);
    } else {
      return res.status(404).json({
        message: `Actor ${req.params.id} not found. Actors available: ${allActors.map(
          (actor) => actor.name
        )}`
      });
    }
  } catch (err) {
    next(err);
  }
};

export default { getAllActors, createActor, getAllSeriesForActor };
