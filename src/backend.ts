import { connect as connectMongo } from 'mongoose';

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { HttpException, BadRequestException } from './http-exception';
import { TrackerEvent, validateTrackerEvent } from './tracker-event';

import { TracksService } from './tracks.service';

export const bootstrap = async (port: number) => {
  const app: Express = express();

  await connectMongo(process.env.MONGOOSE_URL || 'mongodb://localhost:27017/tracker');

  const tracksService = new TracksService();

  app.use(
    cors({
      origin: 'http://localhost:8000',
    }),
  );
  app.use(express.json());

  app.get('/', (_: Request, res: Response) => {
    res.sendFile(__dirname + '/tracker.js');
  });

  app.post(
    '/track',
    cors({
      methods: 'POST',
      // TODO: maxAge to avoid CORS preflight
    }),
    async (req: Request, res: Response) => {
      if (!Array.isArray(req.body)) throw new BadRequestException('Array of events was expected');

      req.body.forEach((e: Partial<TrackerEvent>, i: number) => {
        const [ok, problems] = validateTrackerEvent(e);

        if (!ok) throw new BadRequestException(`Event #${i}: ${problems}`);
      });

      const events: TrackerEvent[] = req.body;

      res.sendStatus(200);

      await Promise.all(
        events.map(({ event, tags, url, ts, title }) =>
          tracksService.create({
            event,
            tags,
            url,
            title,
            ts: new Date(ts),
          }),
        ),
      );
    },
  );

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof HttpException)) return next(err);

    res.status(err.statusCode);
    res.json({
      statusCode: err.statusCode,
      message: err.message,
    });
  });

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });

  return app;
};

export default bootstrap;
