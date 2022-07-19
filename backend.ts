import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { HttpException, BadRequestException } from './http-exception'
import { TrackerEvent, validateTrackerEvent } from './tracker-event'

export const bootstrap = (port: number) => {
  const app: Express = express();

  app.use(cors({
    origin: 'http://localhost:8000',
  }))
  app.use(express.json())

  app.get('/', (_: Request, res: Response) => {
    res.sendFile(__dirname + '/tracker.js')
  });

  app.post('/track', cors({
    methods: 'POST',
    // TODO: maxAge to avoid CORS preflight
  }), (req: Request, res: Response) => {
    if (!Array.isArray(req.body)) throw new BadRequestException('Array of events was expected')

    req.body.forEach((e: Partial<TrackerEvent>, i: number) => {
      const [ok, problems] = validateTrackerEvent(e)

      if (!(ok)) throw new BadRequestException(`Event #${i}: ${problems}`)
    })

    const events: TrackerEvent[] = req.body

    res.sendStatus(200);
    console.log('tracking', events);
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
