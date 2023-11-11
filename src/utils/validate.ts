import { Trace, ValidateException } from '@/core/errors';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';

export const validate = async (schema: AnyZodObject, req: Request) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return req.body;
    } catch (error) {
        const err = error as ZodError;
        throw new ValidateException({
            ...err,
            message: translate(err.errors),
            trace: Trace.VALIDATOR,
        });
    }
};

export const validateObjectId = (id: string) => {
    const validId = mongoose.isValidObjectId(id);
    if (!validId) {
        throw new ValidateException({
            message: 'Invalid id format',
            trace: Trace.VALIDATOR,
            statusCode: StatusCodes.BAD_REQUEST,
        });
    }
    return id as unknown as mongoose.Types.ObjectId;
};

export const translate = (error: ZodIssue[]): string => {
    let message: string = '';

    error.forEach((issue) => {
        const path = issue.path.join('.');
        const reason = issue.message;
        message += `${message.length > 0 ? ', ' : ''}[${path}]: ${reason}`;
    });

    return message;
};
