// api.ts -- API routes of backend service.

import express, { Express, Request, Response, NextFunction, Router } from 'express';

import cors from 'cors';

import { HttpException, BadRequestException } from './http-exception';
import { TrackDto, validateTrackDto } from './dto/track.dto';

import { TracksService } from './tracks.service';

const tracksService = new TracksService();

const router = Router();

router.use(
  cors({
    origin: 'http://localhost:8000',
    maxAge: 300, // Avoids preflight on every request
  }),
);
router.use(express.json());

router.post('/track', async (req: Request, res: Response) => {
  if (!Array.isArray(req.body)) throw new BadRequestException('Array of events was expected');

  req.body.forEach((e: Partial<TrackDto>, i: number) => {
    const [ok, problems] = validateTrackDto(e);

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
});

router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof HttpException)) return next(err);

  res.status(err.statusCode);
  res.json({
    statusCode: err.statusCode,
    message: err.message,
  });
});

export default router;
