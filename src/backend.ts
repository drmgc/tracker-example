// backend.ts -- Basic setup of the backend service

import { connect as connectMongo } from 'mongoose';

import express, { Express, Request, Response, NextFunction } from 'express';

import apiRouter from './api';

export const bootstrap = async (port: number) => {
  const app: Express = express();

  await connectMongo(process.env.MONGOOSE_URL || 'mongodb://localhost:27017/tracker');

  app.get('/', (_: Request, res: Response) => {
    res.sendFile(__dirname + '/tracker.js');
  });

  app.use(apiRouter);

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });

  return app;
};

export default bootstrap;
