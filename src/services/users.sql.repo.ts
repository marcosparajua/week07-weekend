import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { type PrismaClient } from '@prisma/client';
import { type UserCreateDto, type UserUpdateDto } from '../entities/user.js';
import { type User } from '../entities/user.js';

const debug = createDebug('W7:users:repository');

const select = {
  id: true,
  name: true,
  email: true,
  password: true,
  birthDate: true,
  role: true,
};

export class UsersSqlRepo {
  constructor(private readonly prisma: PrismaClient) {
    debug('Instantiated user repository');
  }

  async findUser(key: string, value: unknown) {
    return this.prisma.user.findMany({
      where: {
        [key]: value,
      },
      select,
    });
  }

  async searchForLogin(key: 'email' | 'name', value: string) {
    if (!['email', 'name'].includes(key)) {
      throw new HttpError(404, 'Not found', 'Invalid parameters');
    }

    const userData = await this.prisma.user.findFirst({
      where: { [key]: value },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!userData) {
      throw new HttpError(404, 'Not Found', `Invalid ${key} or password`);
    }

    return userData;
  }

  async readAll() {
    return this.prisma.user.findMany({ select });
  }

  async readById(inputId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: inputId },
      select,
    });
    if (!user) {
      throw new HttpError(404, 'Not Found', `User ${inputId} not found`);
    }

    return user;
  }

  async create(data: UserCreateDto) {
    const newUser = this.prisma.user.create({
      data: {
        role: 'user',
        ...data,
      },
      select,
    });
    return newUser;
  }

  async update(inputId: string, data: UserUpdateDto) {
    let user: User;
    try {
      user = (await this.prisma.user.update({
        where: { id: inputId },
        data,
        select,
      })) as User;
    } catch (error) {
      throw new HttpError(404, 'Not Found', `User ${inputId}not found`);
    }

    return user;
  }

  async delete(inputId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: inputId },
      select,
    });
    if (!user) {
      throw new HttpError(404, 'Not Found', `User ${inputId} not found`);
    }

    return this.prisma.user.delete({ where: { id: inputId }, select });
  }
}
