import { SystemException, Trace } from '@/core/errors';
import { HttpResponse } from '@/core/response';
import { shopSchemaValidate } from '@/models/shop.model';
import shopRepository from '@/repositories/shop.repository';
import userRepository from '@/repositories/user.repository';
import { validate, validateObjectId } from '@/utils/validate';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getAllShop = async (_: Request, res: Response) => {
    const users = await shopRepository.getAll();
    return res.json(users);
};

export const createShop = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await validate(shopSchemaValidate, req);
        //TODO: validate owner id by middleware
        validateObjectId(data.owner);
        const result = await shopRepository.create(req.body);
        return res.json(new HttpResponse(result));
    } catch (error) {
        return next(error);
    }
};

export const getShopById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const shop = await shopRepository.getById(id);
        return res.json(new HttpResponse(shop));
    } catch (error) {
        return next(error);
    }
};

export const getShopByOwnerId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const shops = await shopRepository.getByOwnerId(id);
        return res.json(new HttpResponse(shops));
    } catch (error) {
        return next(error);
    }
};

export const getShopBySymbol = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const shopSymbol = req.params.shopSymbol;
        const shop = await shopRepository.getShopBySymbol(shopSymbol);
        return res.json(new HttpResponse(shop));
    } catch (error) {
        return next(error);
    }
};

export const addManager = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const managerId = validateObjectId(req.body.managerId);
        const user = await userRepository.getById(managerId);
        const shop = await shopRepository.getById(id);
        if (shop.managers.includes(user._id)) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'Manager already exists',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        if (shop.owner === user._id) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is owner',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        shop.managers.push(user._id);
        shop.save();
        return res.json(new HttpResponse(shop));
    } catch (error) {
        return next(error);
    }
};

export const addStaff = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const managerId = validateObjectId(req.body.managerId);
        const user = await userRepository.getById(managerId);
        const shop = await shopRepository.getById(id);
        if (shop.staffs.includes(user._id)) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'Staff already exists',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        if (shop.owner === user._id) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is owner',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        shop.staffs.push(user._id);
        shop.save();
        return res.json(new HttpResponse(shop));
    } catch (error) {
        return next(error);
    }
};

export const removeManager = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const managerId = validateObjectId(req.body.managerId);
        const user = await userRepository.getById(managerId);
        const shop = await shopRepository.getById(id);
        if (!shop.managers.includes(user._id)) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'Manager not exists',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        if (shop.owner === user._id) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is owner',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        shop.managers = shop.managers.filter(
            (item) => item.toString() !== user._id.toString(),
        );
        shop.save();
        return res.json(new HttpResponse('Remove manager successfully'));
    } catch (error) {
        return next(error);
    }
};

export const removeStaff = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const managerId = validateObjectId(req.body.managerId);
        const user = await userRepository.getById(managerId);
        const shop = await shopRepository.getById(id);
        if (!shop.staffs.includes(user._id)) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'Staff not exists',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        if (shop.owner === user._id) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is owner',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        shop.staffs = shop.staffs.filter(
            (item) => item.toString() !== user._id.toString(),
        );
        shop.save();
        return res.json(new HttpResponse('Remove staff successfully'));
    } catch (error) {
        return next(error);
    }
};

export const deleteShop = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        await shopRepository.remove(id);
        return res.json(new HttpResponse('Delete shop successfully'));
    } catch (error) {
        return next(error);
    }
};
