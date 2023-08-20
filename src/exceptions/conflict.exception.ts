import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(message: string, description: string | Record<string, any>) {
    super(message, HttpStatus.CONFLICT, {
      cause: new Error(),
      description: JSON.stringify(description),
    });
  }
}
