import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { userCreateDtoSchema, userUpdateDtoSchema, } from '../entities/user.schema.js';
import { Auth } from '../services/auth.service.js';
const debug = createDebug('W7:users:controller');
export class UsersController {
    repo;
    constructor(repo) {
        this.repo = repo;
        debug('Instantiated users controller');
    }
    async getAll(req, res, next) {
        try {
            const result = await this.repo.readAll();
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        const { email, name, password } = req.body;
        if ((!email && !name) || !password) {
            next(new HttpError(400, 'Bad Request', 'Email/name and password are required'));
            return;
        }
        const error = new HttpError(401, 'Unauthorized', 'Invalid data');
        try {
            const user = await this.repo.searchForLogin(email ? 'email' : 'name', email || name);
            if (!user) {
                next(new HttpError(404, 'Not Found', `Invalid ${email ? 'email' : 'name'} or password`));
                return;
            }
            if (!(await Auth.compare(password, user.password))) {
                next(error);
                return;
            }
            const userToken = Auth.signJwt({ id: user.id, role: user.role });
            res.status(200).json({ token: userToken });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        const { id } = req.params;
        try {
            const result = await this.repo.readById(id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        const data = req.body;
        if (!data.password || typeof data.password !== 'string') {
            next(new HttpError(400, 'Bad Request', 'Password is required and must be a string'));
            return;
        }
        data.password = await Auth.hash(data.password);
        const { error } = userCreateDtoSchema.validate(data, {
            abortEarly: false,
        });
        if (error) {
            next(new HttpError(406, 'Not Acceptable', error.message));
            return;
        }
        try {
            const result = await this.repo.create(data);
            res.status(201);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        const { id } = req.params;
        const data = req.body;
        if (data.password && typeof data.password === 'string') {
            data.password = await Auth.hash(data.password);
        }
        const { error } = userUpdateDtoSchema.validate(data, {
            abortEarly: false,
        });
        if (error) {
            next(new HttpError(406, 'Not Acceptable', error.message));
            return;
        }
        try {
            const result = await this.repo.update(id, data);
            res.status(202);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const result = await this.repo.delete(id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
