import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { HttpException, BadRequestException } from './http-exception'

export const bootstrap = (port: number) => {
  const app: Express = express();

  app.use(cors({
    origin: 'http://localhost:8000',
  }))
  app.use(express.json())

  app.get('/', (_: Request, res: Response) => {
    res.sendFile(__dirname + '/tracker.js')
  });

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof HttpException)) return next(err)

    res.status(err.statusCode)
    res.json({
      statusCode: err.statusCode,
      message: err.message,
    })
  })

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });

  return app
}

export default bootstrap
