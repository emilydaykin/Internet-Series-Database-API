import Series from '../../models/series.js';
import { assert } from 'chai';

export default async function tearDown() {
  await Series.deleteMany();
  // done();
  assert.ok(true);
}
