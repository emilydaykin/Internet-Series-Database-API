import express from 'express';
import { port } from './config/environment.js';
import { connectToDb } from './db/helpers.js';
import router from './config/router.js';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();
app.use(express.json()); // middleware

// req.json()
// Sanitise!! MongoDB injections. MUST GO BEFORE ROUTER!!!!
app.use(mongoSanitize());
// mongoSanitize(req)
app.use(
  mongoSanitize({
    replaceWith: '_'
  })
);
// Sanitise!! CrossSite Scripting:
app.use('/api', router);

async function runServer() {
  await connectToDb();
  app.listen(port, () => console.log(`App is listening on port ${port}`));
}

runServer();

export default app;
