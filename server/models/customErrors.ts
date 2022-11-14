import httpStatusCodes from './httpStatusCodes';

export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract authRelated: boolean;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class DatabaseConnectionError extends CustomError {
    statusCode = httpStatusCodes.INTERNAL_SERVER;
    authRelated = false;
    constructor(message: string, authRelated?: boolean) {
        super(message);
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
        this.authRelated = authRelated || false;
    }
}

export class InternalError extends CustomError {
    statusCode = httpStatusCodes.INTERNAL_SERVER;
    authRelated = false;
    constructor(message: string, authRelated?: boolean) {
        super(message);
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
        this.authRelated = authRelated || false;
    }
}

export class NotFoundError extends CustomError {
    statusCode = httpStatusCodes.NOT_FOUND;
    authRelated = false;
    constructor(message: string, authRelated?: boolean) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
        this.authRelated = authRelated || false;
    }
}

export class BadRequestError extends CustomError {
    statusCode = httpStatusCodes.BAD_REQUEST;
    authRelated = false;
    constructor(message: string, authRelated?: boolean) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
        this.authRelated = authRelated || false;
    }
}

export class UnauthorizedError extends CustomError {
    statusCode = httpStatusCodes.UNAUTHORIZED;
    authRelated = false;
    constructor(message: string, authRelated?: boolean) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
        this.authRelated = authRelated || false;
    }
}
