import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { ZodError, z } from 'zod';

export enum Trace {
    HANDLER = 'HANDLER_EXCEPTION',
    MIDDLEWARE = 'MIDDLEWARE_EXCEPTION',
    SERVICE = 'SERVICE_EXCEPTION',
    REPOSITORY = 'REPOSITORY_EXCEPTION',
    VALIDATOR = 'VALIDATOR_EXCEPTION',
    OTHER = 'OTHER_EXCEPTION',
}

const exceptionSchema = z.object({
    trace: z.nativeEnum(Trace),
    statusCode: z.number(),
    message: z.string().optional().default(''),
    error: z.any().optional().nullable(),
});

export type Exception = z.infer<typeof exceptionSchema>;

export class SystemException extends Error {
    public trace: Trace;
    public statusCode: number;
    public error?: any;

    constructor(props: Exception) {
        super();
        this.trace = props.trace;
        this.statusCode = props.statusCode;
        this.message = props.message;
        this.error = props?.error;
    }
}

export class RepositoryException extends SystemException {
    constructor(props: unknown) {
        super({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            trace: Trace.REPOSITORY,
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error: props,
        });
    }
}

export class ValidateException extends SystemException {
    constructor(props: unknown) {
        super({
            statusCode: StatusCodes.BAD_REQUEST,
            trace: Trace.VALIDATOR,
            message: (props as ZodError).message,
        });
    }
}
