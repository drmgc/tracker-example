import { Types } from 'mongoose';

export interface ITrack {
  _id: Types.ObjectId;

  event: string;
  tags: string[];
  url: string;
  title?: string;
  ts: Date;
}
