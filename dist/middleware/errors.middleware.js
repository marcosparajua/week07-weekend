import createDebug from 'debug';
const debug = createDebug('W7E:errors:middleware');
export class HttpError extends Error {
    status;
    statusMessage;
    constructor(status, statusMessage, message, options) {
        super(message, options);
        this.status = status;
        this.statusMessage = statusMessage;
    }
}
export class ErrorsMiddleware {
    constructor() {
        debug('Instantiated errors middleware');
    }
    handle(error, _req, res, _next) {
        if (error instanceof HttpError) {
            debug('Error', error.message);
            res.status(error.status);
            res.json({
                status: `${error.status} ${error.statusMessage}`,
                message: error.message,
            });
            return;
        }
        debug('Request received', error.message);
        res.status(500);
        res.json({
            status: '500 Internal Server Error',
            message: error.message,
        });
    }
}
