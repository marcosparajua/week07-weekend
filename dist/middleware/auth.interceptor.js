import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { Auth } from '../services/auth.service.js';
const debug = createDebug('W7:auth:interceptor');
export class AuthInterceptor {
    constructor() {
        debug('Instantiated auth interceptor');
    }
    authentication(req, res, next) {
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
        }
        catch (error) {
            next(new HttpError(498, 'Token expired/invalid', 'Invalid token'));
        }
    }
    authorizationAdmin(req, res, next) {
        const { payload } = req.body;
        const { role } = payload;
        if (role !== 'admin') {
            next(new HttpError(403, 'Forbidden', 'Not allowed'));
            return;
        }
        next();
    }
    authorization(req, res, next) {
        const { payload } = req.body;
        const { id } = req.params;
        if (payload.id !== id) {
            next(new HttpError(403, 'Forbidden', 'Not allowed'));
        }
        next();
    }
}
