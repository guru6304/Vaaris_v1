import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestWithId } from '../interfaces/request-with-id.interface';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction) {
    const incomingId = req.headers['x-request-id'] as string;
    const requestId = incomingId && incomingId.trim().length > 0 ? incomingId : uuidv4();

    req.requestId = requestId;
    req.startTime = Date.now();

    res.setHeader('x-request-id', requestId);

    next();
  }
}
