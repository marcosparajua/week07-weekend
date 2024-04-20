import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { ErrorsMiddleware } from './middleware/errors.middleware.js';
import { type PrismaClient } from '@prisma/client';
import { UsersSqlRepo } from './services/users.sql.repo.js';
import { UsersController } from './controllers/users.controller.js';
import { UsersRouter } from './routers/users.router.js';
import { AuthInterceptor } from './middleware/auth.interceptor.js';

const debug = createDebug('W7:app');

export const createApp = () => {
  const app = express();
  return app;
};

export const startApp = (app: Express, prisma: PrismaClient) => {
  debug('Starting app');

  const authInterceptor = new AuthInterceptor();
  const userRepo = new UsersSqlRepo(prisma);
  const userController = new UsersController(userRepo);
  const userRouter = new UsersRouter(userController, authInterceptor);
  const errorMiddleware = new ErrorsMiddleware();

  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors());

  app.use('/users', userRouter.router);
  app.use(errorMiddleware.handle.bind(errorMiddleware));
};
