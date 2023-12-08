import environment from '@/core/environment';
import { SystemException, Trace } from '@/core/errors';
import { TokenUserPayload } from '@/models/auth.model';
import jwt from 'jsonwebtoken';

export const generateUserToken = (payload: TokenUserPayload) => {
    try {
        const token = jwt.sign(payload, environment.JWT_SECRET, {
            expiresIn: '999day',
        });
        return token;
    } catch (err) {
        throw new SystemException({
            trace: Trace.HANDLER,
            message: 'JWT sign error',
            statusCode: 400,
        });
    }
};
