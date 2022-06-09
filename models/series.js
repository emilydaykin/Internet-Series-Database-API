import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxLength: 300 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdById: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    createdByName: { type: String }
  },
  { timestamps: true }
);

const seriesSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Series name required'] },
  genre: { type: Array, required: [true, 'Series genre(s) required in array'] }, // Object works too
  description: { type: String, required: false },
  actors: { type: Array, ref: 'Actor', required: false },
  pilotYear: { type: Number, required: [true, 'Series pilot/release year required'] },
  finaleYear: { type: mongoose.Mixed, required: false }, // Number or String
  rating: { type: Number, required: false },
  image: { type: String, required: false },
  comments: [commentSchema]
});

export default mongoose.model('Series', seriesSchema);
