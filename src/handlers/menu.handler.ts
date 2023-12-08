import { HttpResponse } from '@/core/response';
import { NextFunction, Request, Response } from 'express';
import { validate, validateObjectId } from '@/utils/validate';
import menuRepository from '@/repositories/menu.repository';
import { menuSchemaValidate } from '@/models/menu.modal';
import { TokenUserPayload } from '@/models/auth.model';
import { verifyRoleInShop } from '@/utils/user';
import { UserShopRole } from '@/enums/userShopRole.enum';

export const createMenu = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await validate(menuSchemaValidate, req);
        const categoryId = validateObjectId(req.params.categoryId);
        await verifyRoleInShop(
            (res.app.locals.user as TokenUserPayload).userId,
            req.params.shopId,
            [UserShopRole.OWNER, UserShopRole.MANAGER],
        );
        const result = await menuRepository.create(categoryId, data);
        return res.json(new HttpResponse(result));
    } catch (error) {
        return next(error);
    }
};

export const getMenuById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const menu = await menuRepository.getById(id);
        return res.json(new HttpResponse(menu));
    } catch (error) {
        return next(error);
    }
};

export const updateMenu = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const data = req.body;
        await verifyRoleInShop(
            (res.app.locals.user as TokenUserPayload).userId,
            req.params.shopId,
            [UserShopRole.OWNER, UserShopRole.MANAGER],
        );
        const menu = await menuRepository.update(id, data);
        return res.json(new HttpResponse(menu));
    } catch (error) {
        return next(error);
    }
};

export const deleteMenu = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        await verifyRoleInShop(
            (res.app.locals.user as TokenUserPayload).userId,
            req.params.shopId,
            [UserShopRole.OWNER, UserShopRole.MANAGER],
        );
        await menuRepository.remove(id);
        return res.json(new HttpResponse('Delete menu successfully'));
    } catch (error) {
        return next(error);
    }
};
