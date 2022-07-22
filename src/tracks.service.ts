// tracker-service.ts - Services for interactions with data base. For
// sake of simplicity, I implemented only necessery methods.

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
