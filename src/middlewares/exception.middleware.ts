import { SystemException, Trace } from '@/core/errors';
import { NextFunction, Request, Response } from 'express';

const exceptionFn = (
    err: any,
    _: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof SystemException) {
        res.status(err.statusCode).json({
            trace: err.trace,
            message: err.message,
            error: err.error,
        });
        return;
    }

    if (err instanceof Error) {
        res.status(500).json({
            trace: Trace.OTHER,
            message: err.message,
            error: err.name,
        });
        return;
    }

    next();
};

export default exceptionFn;
