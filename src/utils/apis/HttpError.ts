import { HTTP_STATUS } from '../../constants';

export class HttpError extends Error {
  public statusCode: number;
  public errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', errors?: any) {
    super(HTTP_STATUS.BAD_REQUEST, message, errors);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(HTTP_STATUS.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(HTTP_STATUS.FORBIDDEN, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(HTTP_STATUS.NOT_FOUND, message);
  }
}

export class ConflictError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.CONFLICT; // 409
  }
}

export class RateLimitError extends HttpError {
  constructor(message = 'Too Many Requests') {
    super(HTTP_STATUS.TOO_MANY_REQUEST, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(HTTP_STATUS.INTERNAL_ERROR, message);
  }
}
