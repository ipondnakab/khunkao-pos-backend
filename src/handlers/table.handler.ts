import { tableSchemaValidate } from '@/models/table.model';
import { validate, validateObjectId } from '@/utils/validate';
import { NextFunction, Request, Response } from 'express';
import tableRepository from '../repositories/table.repository';
import { HttpResponse } from '@/core/response';

export const createTable = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const shopId = validateObjectId(req.params.shopId);
        const data = await validate(tableSchemaValidate, req);
        const result = await tableRepository.create(shopId, data);
        return res.json(new HttpResponse(result));
    } catch (error) {
        return next(error);
    }
};

export const updateTable = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const data = req.body;
        const table = await tableRepository.update(id, data);
        return res.json(new HttpResponse(table));
    } catch (error) {
        return next(error);
    }
};

export const removeTable = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        await tableRepository.remove(id);
        return res.json(new HttpResponse('Delete table successfully'));
    } catch (error) {
        return next(error);
    }
};
