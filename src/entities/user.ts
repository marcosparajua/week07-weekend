export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  birthDate: string;
  role: 'admin' | 'user' | 'guest';
};

export type UserCreateDto = {
  name: string;
  email: string;
  password: string;
  birthDate: string;
};

export type UserUpdateDto = Partial<UserCreateDto>;
