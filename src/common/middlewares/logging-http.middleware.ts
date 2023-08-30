import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware function for logging HTTP requests and responses.
 *
 * @param  req - The HTTP request object.
 * @param  res - The HTTP response object.
 * @param  next - The next middleware function.
 */
export const LoggingHttpMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logger = new Logger('HTTP');

  const { method, originalUrl, body } = req;
  logger.log(`[REQ] ${method} ${originalUrl}`);
  logger.log(body);

  const oldWrite = res.write;
  const oldEnd = res.end;
  const chunks = [];
  res.write = function(chunk: any) {
    chunks.push(chunk);
    // eslint-disable-next-line prefer-rest-params
    return oldWrite.apply(res, arguments);
  };
  res.end = function(chunk: any) {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }
    // eslint-disable-next-line prefer-rest-params
    return oldEnd.apply(res, arguments);
  };

  res.on('finish', () => {
    const { statusCode } = res;
    // 被 interceptor 转换后的响应
    const transformedResponse = res.locals.transformedResponse;
    // 没有被 interceptor 转换的响应
    const responseBody = Buffer.concat(chunks).toString('utf8');

    logger.log(`[RES] ${method} ${originalUrl} ${statusCode}`);
    logger.log(transformedResponse ?? responseBody);
  });

  next();
};
