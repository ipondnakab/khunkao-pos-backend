import { SystemException, Trace } from '@/core/errors';
import bcrypt from 'bcrypt';

export const encodePassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
};

export const compareHashPassword = async (password: string, hash: string) => {
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
        throw new SystemException({
            trace: Trace.HANDLER,
            message: 'Wrong password',
            statusCode: 400,
        });
    }
    return isMatch;
};
