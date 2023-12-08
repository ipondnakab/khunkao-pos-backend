import { NextFunction, Request, Response } from 'express';
import { SystemException, Trace } from '@/core/errors';
import { HttpResponse } from '@/core/response';
import { Database } from '@/core/db';
import environment from '@/core/environment';

export const postUploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const file = req.file;
    if (!file) {
        throw next(
            new SystemException({
                trace: Trace.HANDLER,
                statusCode: 400,
                message: 'Should put File in Request!!',
            }),
        );
    }
    try {
        const url = `${environment.FORWARD_URL}/api/v1/files/${file.filename}`;
        const path = `/files/${file.filename}`;
        res.json(new HttpResponse('success!!', { url, path }));
    } catch (error) {
        next(error);
    }
};

export const getFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { filename } = req.params;

        const gfs = Database.getGfs();

        // eslint-disable-next-line no-console
        console.log({ filename });

        const file = await gfs.files.findOne({
            $or: [{ filename }, { _id: filename }],
        });
        if (!file || file.length === 0) {
            throw next(
                new SystemException({
                    trace: Trace.HANDLER,
                    statusCode: 404,
                    message: 'File not found!!',
                }),
            );
        }
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    } catch (error) {
        next(error);
    }
};
