import Series from '../../models/series.js';
import User from '../../models/user.js';
import { assert } from 'chai';

export default async function tearDown() {
  await Series.deleteMany();
  await User.deleteMany();
  assert.ok(true);
}
