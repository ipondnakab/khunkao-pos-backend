import { tableSchemaValidate } from '@/models/table.model';
import { validate, validateObjectId } from '@/utils/validate';
import { NextFunction, Request, Response } from 'express';
import tableRepository from '../repositories/table.repository';
import { HttpResponse } from '@/core/response';
import shopRepository from '@/repositories/shop.repository';
import { TokenUserPayload } from '@/models/auth.model';
import { UserShopRole } from '@/enums/userShopRole.enum';
import { SystemException, Trace } from '@/core/errors';
import { StatusCodes } from 'http-status-codes';
import { getRoleInShop } from '@/utils/user';

export const createTable = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const ownerId = validateObjectId(
            (res.app.locals.user as TokenUserPayload).userId,
        );
        const shopId = validateObjectId(req.params.shopId);
        const data = await validate(tableSchemaValidate, req);
        const shop = await shopRepository.getById(shopId);
        const role = getRoleInShop(shop.toObject(), ownerId.toString());

        if (role !== UserShopRole.OWNER && role !== UserShopRole.MANAGER) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is not owner or manager',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }

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
        const data = req.body;
        const ownerId = validateObjectId(
            (res.app.locals.user as TokenUserPayload).userId,
        );
        const id = validateObjectId(req.params.id);
        const shopId = validateObjectId(req.params.shopId);
        const shop = await shopRepository.getById(shopId);
        const role = getRoleInShop(shop.toObject(), ownerId.toString());

        if (role !== UserShopRole.OWNER && role !== UserShopRole.MANAGER) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is not owner or manager',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
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
        const ownerId = validateObjectId(
            (res.app.locals.user as TokenUserPayload).userId,
        );
        const shopId = validateObjectId(req.params.shopId);
        const shop = await shopRepository.getById(shopId);
        const role = getRoleInShop(shop.toObject(), ownerId.toString());
        const id = validateObjectId(req.params.id);
        if (role !== UserShopRole.OWNER && role !== UserShopRole.MANAGER) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is not owner or manager',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        tableRepository.remove(id);
        return res.json(new HttpResponse('Delete table successfully'));
    } catch (error) {
        return next(error);
    }
};
