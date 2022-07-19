import path from 'path'

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import backend from './backend'


function bootstrapFrontend(port: number): Express {
  const app = express();
  app.use((req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/../index.html')) // pwd = dist/
  })

  app.listen(port, () => {
    console.log(`Frontend is running at http://localhost:${port}`);
  });

  return app
}

dotenv.config();

backend(Number(process.env.BACKEND_PORT) || 8001)
bootstrapFrontend(Number(process.env.FRONTEND_PORT) || 8000)

