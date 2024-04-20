import { type Request, type Response, type NextFunction } from 'express';
import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { type UsersSqlRepo } from '../services/users.sql.repo.js';
import { type UserCreateDto, type UserUpdateDto } from '../entities/user.js';
import {
  userCreateDtoSchema,
  userUpdateDtoSchema,
} from '../entities/user.schema.js';
import { Auth } from '../services/auth.service.js';
const debug = createDebug('W7:users:controller');

export class UsersController {
  constructor(private readonly repo: UsersSqlRepo) {
    debug('Instantiated users controller');
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.readAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, name, password } = req.body as UserCreateDto;
    if ((!email && !name) || !password) {
      next(
        new HttpError(
          400,
          'Bad Request',
          'Email/name and password are required',
        ),
      );
      return;
    }

    const error = new HttpError(401, 'Unauthorized', 'Invalid data');

    try {
      const user = await this.repo.searchForLogin(
        email ? 'email' : 'name',
        email || name,
      );

      if (!user) {
        next(
          new HttpError(
            404,
            'Not Found',
            `Invalid ${email ? 'email' : 'name'} or password`,
          ),
        );
        return;
      }

      if (!(await Auth.compare(password, user.password))) {
        next(error);
        return;
      }

      const userToken = Auth.signJwt({ id: user.id, role: user.role });
      res.status(200).json({ token: userToken });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this.repo.readById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body as UserCreateDto;
    if (!data.password || typeof data.password !== 'string') {
      next(
        new HttpError(
          400,
          'Bad Request',
          'Password is required and must be a string',
        ),
      );
      return;
    }

    data.password = await Auth.hash(data.password);

    const { error }: { error: Error | undefined; value: UserCreateDto } =
      userCreateDtoSchema.validate(data, {
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
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = req.body as UserUpdateDto;
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
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this.repo.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
