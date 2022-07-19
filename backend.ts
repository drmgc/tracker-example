import express, { Express, Request, Response } from 'express';
import cors from 'cors';


export const bootstrap = (port: number) => {
  const app: Express = express();

  app.use(cors({
    origin: 'http://localhost:8000',
  }))
  app.use(express.json())

  app.get('/', (_: Request, res: Response) => {
    res.sendFile(__dirname + '/tracker.js')
  });

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });

  return app
}

export default bootstrap
