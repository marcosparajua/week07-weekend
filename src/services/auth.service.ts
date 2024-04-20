import { compare, hash } from 'bcrypt';
import { type JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export type Payload = {
  id: string;
  role: string;
} & JwtPayload;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Auth {
  static secret = process.env.SECRET;

  static async hash(value: string) {
    return hash(value, 5);
  }

  static async compare(value: string, hash: string) {
    return compare(value, hash);
  }

  static signJwt(payload: Payload) {
    if (!Auth.secret) {
      throw new Error('JWT secret not found');
    }

    return jwt.sign(payload, Auth.secret);
  }

  static verifyJwt(token: string) {
    if (!Auth.secret) {
      throw new Error('JWT secret not found');
    }

    return jwt.verify(token, Auth.secret) as Payload;
  }
}
