import environment from '@/core/environment';
import { SystemException, Trace } from '@/core/errors';
import { TokenUserPayload } from '@/models/auth.model';
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(
                new SystemException({
                    trace: Trace.MIDDLEWARE,
                    message: 'Missing token',
                    statusCode: 401,
                }),
            );
        }
        // Verify the token using the secret key
        const decoded: TokenUserPayload = jwt.verify(
            token,
            environment.JWT_SECRET,
        ) as TokenUserPayload;

        //  Attach the user ID and email to the request object for further processing

        if (!decoded.userId || !decoded.phone) {
            return next(
                new SystemException({
                    trace: Trace.MIDDLEWARE,
                    message: 'Invalid token',
                    statusCode: 401,
                }),
            );
        }

        req.app.locals.user = decoded;

        next();
    } catch (err) {
        return next(
            new SystemException({
                trace: Trace.MIDDLEWARE,
                message: 'Invalid token',
                statusCode: 401,
            }),
        );
    }
};
