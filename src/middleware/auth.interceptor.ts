import { type NextFunction, type Request, type Response } from 'express';
import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { Auth, type Payload } from '../services/auth.service.js';

const debug = createDebug('W7:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated auth interceptor');
  }

  authentication(req: Request, res: Response, next: NextFunction) {
    const error = new HttpError(498, 'Token expired/invalid', 'Invalid token');
    const input = req.get('Authorization');
    if (!input?.startsWith('Bearer')) {
      next(error);
      return;
    }

    const token = input.slice(7);
    try {
      const payload = Auth.verifyJwt(token);
      req.body.payload = payload;
      next();
    } catch (error) {
      next(new HttpError(498, 'Token expired/invalid', 'Invalid token'));
    }
  }

  authorizationAdmin(req: Request, res: Response, next: NextFunction) {
    const { payload } = req.body as { payload: Payload };
    const { role } = payload;
    if (role !== 'admin') {
      next(new HttpError(403, 'Forbidden', 'Not allowed'));
      return;
    }

    next();
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    const { payload } = req.body as { payload: Payload };
    const { id } = req.params;
    if (payload.id !== id) {
      next(new HttpError(403, 'Forbidden', 'Not allowed'));
    }

    next();
  }
}
