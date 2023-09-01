import type { NextFunction, Response } from 'express';

/**
 * Add `Access-Control-Allow-Private-Network` field to all responses to allow private network access
 */
export function AllowPrivateNetworkMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  res.set('Access-Control-Allow-Private-Network', 'true');
  next();
}
