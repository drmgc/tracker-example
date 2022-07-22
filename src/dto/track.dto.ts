export interface TrackDto {
  event: string;
  tags: string[];
  url: string;
  ts: Date | string;
  title: string;
}

export function validateTrackDto(e: unknown): [true, null] | [false, string] {
  if (typeof e != 'object') return [false, `An object is expected`];

  const { event, tags, url, ts, title } = <Partial<TrackDto>>e;
  if (typeof event !== 'string') return [false, `Event name is expected`];
  if (!event || event.length > 32) return [false, `Event name should be 1 to 32 symbols long`];

  if (typeof url !== 'string') return [false, `URL is expected`];
  if (!url || url.length > 128) return [false, `URL should be 1 to 128 symbols`];

  if (typeof title !== 'string') return [false, `Title is expected`];

  if (!ts || isNaN(new Date(ts).getTime())) return [false, 'Valid date is expected'];

  if (!tags || !Array.isArray(tags)) return [false, 'Tags is expected to be an array'];

  if (!(<unknown[]>tags).every((s) => typeof s == 'string' && s.length < 32)) {
    return [false, 'Tags are expected to be strings 1-32 characters long'];
  }

  return [true, null];
}
