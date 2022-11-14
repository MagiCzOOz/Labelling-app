import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import mysql from 'mysql';

import pool from '../config/database';
import {
    BadRequestError,
    InternalError,
    DatabaseConnectionError,
    UnauthorizedError,
    NotFoundError,
} from '../models/customErrors';
import httpStatusCodes from '../models/httpStatusCodes';
import { authLogger } from '../utils/logger';

const saltRounds = 10;

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        next(new BadRequestError('Password and Confirm Password do not match', true));
    } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                next(new InternalError(err.message, true));
            }
            const sql = mysql.format('INSERT INTO users (username, password) VALUES (?,?);', [username, hash]);
            pool.query(sql, (err) => {
                if (err) {
                    next(new DatabaseConnectionError(err.message, true));
                }
                authLogger.info(`User ${username} successfully added.`);
                res.status(httpStatusCodes.CREATED).send({ message: 'User successfully added.' });
            });
        });
    }
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        res.status(httpStatusCodes.OK).send({ loggedIn: true, user: req.session.user });
    } else {
        next(new UnauthorizedError('User not properly authenticated.', true));
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;
    const sql = mysql.format('SELECT * FROM users WHERE username = ?;', username);
    pool.query(sql, (err, rows) => {
        if (err) {
            next(new DatabaseConnectionError(err.message, true));
        }
        if (rows.length > 0) {
            bcrypt.compare(password, rows[0].password, (error, response) => {
                if (response) {
                    const id = rows[0].id;
                    const token = jwt.sign({ id, username }, process.env.JWT_SECRET_KEY as Secret, {
                        expiresIn: '1 days',
                    });
                    req.session.user = (({ id, username }) => ({ id, username }))(rows[0]);
                    authLogger.info(`User ${req.session.user.id} successfully logged in.`);
                    res.status(httpStatusCodes.OK).send({ loggedIn: true, user: req.session.user, token: token });
                } else {
                    next(new BadRequestError('Wrong password.', true));
                }
            });
        } else {
            next(new NotFoundError("Username doesn't exist.", true));
        }
    });
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        const userId = req.session.user.id;
        req.session.destroy((err) => {
            if (err) {
                next(new InternalError(err.message, true));
            }
            authLogger.info(`User ${userId} successfully logged out.`);
            res.status(httpStatusCodes.OK).send({ loggedIn: false });
        });
    } else {
        next(new UnauthorizedError('User not properly authenticated.', true));
    }
};