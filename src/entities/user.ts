export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  birthDate?: Date;
  role: 'admin' | 'user' | 'guest';
};

export type UserCreateDto = {
  name: string;
  email: string;
  password: string;
  birthDate?: Date;
};

export type UserUpdateDto = Partial<UserCreateDto>;
