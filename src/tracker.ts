// tracker.ts -- Client-side code

interface TrackerEvent {
  event: string;
  tags: string[];
  url: string;
  ts: Date;
  title: string;
}

interface Tracker {
  track(event: string, ...tags: string[]): void;
}

const debug = (...args: unknown[]) => console.log(...args); // TODO: убрать

class Tracker implements Tracker {
  private url: string;
  private buffer: TrackerEvent[] = [];

  constructor(apiGateway: string = 'http://localhost:8001') {
    this.url = new URL('/track', apiGateway).toString();
  }

  track(event: string, ...tags: string[]) {
    debug('track', event, ...tags);

    this.buffer.push({
      event,
      tags,
      title: document.title,
      url: location.href,
      ts: new Date(),
    });

    // FIXME: проверять не отправляет ли уже?
    if (this.buffer.length >= 3) this.flush();
  }

  async flush(): Promise<void> {
    if (!this.buffer) return;
    const pickedEvents = [...this.buffer];
    this.buffer = [];

    debug('flush', pickedEvents);

    const ok = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pickedEvents),
      keepalive: true, // Lets us to send request even after the page has been closed
    })
      .then((res: Response) => res.ok)
      .catch(() => false);

    if (!ok) {
      this.buffer.push(...pickedEvents);
      setTimeout(this.flush.bind(this), 1000);
    }
  }
}

const tracker = new Tracker();
(<any>window).tracker = new Tracker();

// Ensure events sent even on page refresh or link click
window.addEventListener('beforeunload', async () => {
  tracker.flush();
  return null;
});
