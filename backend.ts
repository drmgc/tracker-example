import express, { Express, Request, Response } from 'express';

export const bootstrap = (port: number) => {
  const app: Express = express();

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/tracker.js')
  });

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });

  return app
}

export default bootstrap
