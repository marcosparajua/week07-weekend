import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Auth {
    static secret = process.env.SECRET;
    static async hash(value) {
        return hash(value, 5);
    }
    static async compare(value, hash) {
        return compare(value, hash);
    }
    static signJwt(payload) {
        if (!Auth.secret) {
            throw new Error('JWT secret not found');
        }
        return jwt.sign(payload, Auth.secret);
    }
    static verifyJwt(token) {
        if (!Auth.secret) {
            throw new Error('JWT secret not found');
        }
        return jwt.verify(token, Auth.secret);
    }
}
