import { Track } from './models/track';

import { ITrack } from './track.interface';

export class TracksService {
  async create({ event, tags, url, title, ts }: Omit<ITrack, '_id'>): Promise<ITrack> {
    const track = new Track({
      event,
      tags,
      url,
      title,
      ts,
    });

    await track.save();

    return track;
  }
}
