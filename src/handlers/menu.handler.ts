import { HttpResponse } from '@/core/response';
import { NextFunction, Request, Response } from 'express';
import * as categoryRepository from '../repositories/category.repository';
import { validate, validateObjectId } from '@/utils/validate';
import shopRepository from '@/repositories/shop.repository';
import menuRepository from '@/repositories/menu.repository';
import { menuSchemaValidate } from '@/models/menu.modal';

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
        const shopId = validateObjectId(req.params.shopId);
        const data = req.body;
        const shop = await shopRepository.getById(shopId);
        //TODO: validate owner id by middleware
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
        // TODO: validate owner id by middleware
        // const shopId = validateObjectId(req.params.shopId);
        // const shop = await shopRepository.getById(shopId);
        const data = req.body;
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
        await categoryRepository.remove(id);
        return res.json(new HttpResponse('Delete category successfully'));
    } catch (error) {
        return next(error);
    }
};

export const createMenu = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const categoryId = validateObjectId(req.params.categoryId);
        const data = await validate(menuSchemaValidate, req);
        const category = await categoryRepository.getById(categoryId);
        const result = await menuRepository.create(category._id, data);
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
        await menuRepository.remove(id);
        return res.json(new HttpResponse('Delete menu successfully'));
    } catch (error) {
        return next(error);
    }
};
