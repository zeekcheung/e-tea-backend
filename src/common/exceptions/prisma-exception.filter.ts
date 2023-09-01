import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
import { PrismaErrorCodeMappping } from './prisma-exceptions';
import { pickKeysFromObject } from '@/utils/base';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const messageArray = exception.message.split('\n');
    const message = messageArray[messageArray.length - 1];

    console.log({
      ...pickKeysFromObject(exception, ['name', 'code']),
      message,
    });

    // access the underlying framework Response object and directly modify the response
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // TEST: handle prisma error code
    const prismaErrorCode = exception.code;
    const httpErrorCode =
      PrismaErrorCodeMappping[prismaErrorCode] ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(httpErrorCode).json({
      statusCode: httpErrorCode,
      message,
    });
  }
}
