// http-exception.ts -- Simple implementation of HTTP exceptions. Only
// necessary ones.

export class HttpException extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad request') {
    super(400, message);
  }
}
