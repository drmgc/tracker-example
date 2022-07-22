// track.ts -- Mongoose model of a Track

import { Schema, model } from 'mongoose';

import { ITrack } from '../track.interface';

export const trackSchema = new Schema<ITrack>(
  {
    event: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    url: { type: String, required: true },
    title: String,
    ts: { type: Date, required: true },
  },
  { collection: 'tracks' },
);

export const Track = model<ITrack>('Track', trackSchema);
