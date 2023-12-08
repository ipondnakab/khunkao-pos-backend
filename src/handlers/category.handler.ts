import { HttpResponse } from '@/core/response';
import { NextFunction, Request, Response } from 'express';
import categoryRepository from '../repositories/category.repository';
import { validate, validateObjectId } from '@/utils/validate';
import { TokenUserPayload } from '@/models/auth.model';
import { verifyRoleInShop } from '@/utils/user';
import { UserShopRole } from '@/enums/userShopRole.enum';
import { categorySchemaValidate } from '@/models/category.model';

export const getAllCategories = async (
    _: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const categories = await categoryRepository.getAll();
        return res.json(new HttpResponse(categories));
    } catch (error) {
        return next(error);
    }
};

export const getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const category = await categoryRepository.getById(id);
        return res.json(new HttpResponse(category));
    } catch (error) {
        return next(error);
    }
};

export const getCategoryByShopId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const shopId = validateObjectId(req.params.shopId);
        const categories = await categoryRepository.getByShopId(shopId);
        return res.json(new HttpResponse(categories));
    } catch (error) {
        return next(error);
    }
};

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await validate(categorySchemaValidate, req);

        const { shop } = await verifyRoleInShop(
            (res.app.locals.user as TokenUserPayload).userId,
            req.params.shopId,
            [UserShopRole.OWNER, UserShopRole.MANAGER],
        );

        const result = await categoryRepository.create(shop._id, data);
        return res.json(new HttpResponse(result));
    } catch (error) {
        return next(error);
    }
};

export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const data = await validate(categorySchemaValidate, req);
        await verifyRoleInShop(
            (res.app.locals.user as TokenUserPayload).userId,
            req.params.shopId,
            [UserShopRole.OWNER, UserShopRole.MANAGER],
        );
        const category = await categoryRepository.update(id, data);
        return res.json(new HttpResponse(category));
    } catch (error) {
        return next(error);
    }
};

export const deleteCategory = async (
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
        await categoryRepository.remove(id);
        return res.json(new HttpResponse('Delete category successfully'));
    } catch (error) {
        return next(error);
    }
};
