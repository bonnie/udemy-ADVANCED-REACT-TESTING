/* eslint-disable import/no-unresolved */
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';
import jwt from 'express-jwt';

import { User as UserType } from '../../shared/types';
import { generateData } from './db-func/generateData/index';
import { validateUser } from './middlewares/index';
import bandRoutes from './route-methods/bands';
import showRoutes from './route-methods/shows';
import userRoutes from './route-methods/users';

dotenv.config();
if (!process.env.EXPRESS_SECRET) {
  // eslint-disable-next-line no-console
  console.error('EXPRESS_SECRET must be defined in .env\nEXITING.');
  process.exit(-1);
}

// typing for Express request with jwt
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: UserType;
    }
  }
}

const app = express();

// CORS for react app, assuming port 3000
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

/* ********* middlewares ********* */
// use middleware to serve static images
app.use(express.static('public'));

// middleware for parsing json body
app.use(json());

app.use(
  '/user/:id',
  jwt({
    // process.env.EXPRESS_SECRET is checked for truthiness on app startup
    // the || is to satisfy typescript
    secret: process.env.EXPRESS_SECRET || 'NOT SO SECRET',
    algorithms: ['HS256'],
    requestProperty: 'auth',
  }),
);
app.use('/user/:id', validateUser);

// note: should really validate user for editing appointments
// I'm lazy and not implementing this. Spa managers beware!

/* *********** routes ********* */

// verify login
app.post('/signin', userRoutes.auth);

// user profile protected by jwt
app.get('/user/:id', userRoutes.getById);
// app.get('/user/:id/appointments', userRoutes.getUserAppointments);
app.delete('/user/:id', userRoutes.remove);
app.patch('/user/:id', userRoutes.update);

// adding user
app.post('/user', userRoutes.create);

// get band by ID
app.get('/bands/:id', bandRoutes.getById);

// shows
app.get('/shows', showRoutes.get);
app.get('/shows/:id', showRoutes.getById);

// reservations
app.patch('/shows/:showId/hold/:holdId', showRoutes.hold);
app.patch('/shows/:showId/purchase/:purchaseId', showRoutes.purchase);
app.patch('/shows/:showId/release/:holdId', showRoutes.release);
app.patch('/shows/:showId/cancelPurchase/:purchaseId', showRoutes.release);

/* *********** END: routes ********* */

export const startUp = async (): Promise<void> => {
  // create shows relevant to current date
  await generateData();

  app.listen(3030, () =>
    // eslint-disable-next-line no-console
    console.log('Concert venue server listening on port 3030!'),
  );
};

export default app;
