import { Router as router } from 'express';
import createDebug from 'debug';
const debug = createDebug('W7:users:router');
export class UsersRouter {
    controller;
    authInterceptor;
    router = router();
    constructor(controller, authInterceptor) {
        this.controller = controller;
        this.authInterceptor = authInterceptor;
        debug('Instantiated users router');
        this.router.post('/login', controller.login.bind(controller));
        this.router.post('/register', controller.create.bind(controller));
        this.router.get('/', controller.getAll.bind(controller));
        this.router.get('/:id', controller.getById.bind(controller));
        this.router.post('/', controller.create.bind(controller));
        this.router.patch('/:id', controller.update.bind(controller));
        this.router.delete('/:id', authInterceptor.authentication.bind(authInterceptor), controller.delete.bind(controller));
    }
}
