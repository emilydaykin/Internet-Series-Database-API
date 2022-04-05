import mongoose from 'mongoose';

const actorSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Actor name required'] },
  series: { type: Array, ref: 'Series', required: [true, 'Series for actor required'] }
});

export default mongoose.model('Actor', actorSchema);
