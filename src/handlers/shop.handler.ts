import { SystemException, Trace } from '@/core/errors';
import { HttpResponse } from '@/core/response';
import { UserShopRole } from '@/enums/userShopRole.enum';
import { TokenUserPayload } from '@/models/auth.model';
import { ShopInterface, shopSchemaValidate } from '@/models/shop.model';
import shopRepository from '@/repositories/shop.repository';
import userRepository from '@/repositories/user.repository';
import { verifyRoleInShop } from '@/utils/user';
import { validate, validateObjectId } from '@/utils/validate';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const getRoleInShop = (shop: ShopInterface, userId: string) => {
    if (shop.owner.toString() === userId.toString()) {
        return UserShopRole.OWNER;
    }
    if (shop.managers.includes(userId)) {
        return UserShopRole.MANAGER;
    }
    if (shop.staffs.includes(userId)) {
        return UserShopRole.STAFF;
    }
    return UserShopRole.UNASSIGNED;
};

export const getAllShop = async (
    _: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userPayload = res.app.locals.user as TokenUserPayload;
        const userId = validateObjectId(userPayload.userId);
        const shops = await shopRepository.getByUserId(userId);
        const result = shops.map((item) => {
            return {
                ...item.toObject(),
                status: getRoleInShop(item.toObject(), userId.toString()),
            };
        });
        return res.json(new HttpResponse(result));
    } catch (error) {
        return next(error);
    }
};

export const createShop = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await validate(shopSchemaValidate, req);
        const userPayload = res.app.locals.user as TokenUserPayload;
        const owner = validateObjectId(userPayload.userId);
        const result = await shopRepository.create({ ...data, owner });
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
        const managerId = validateObjectId(req.body.managerId);
        const manager = await userRepository.getById(managerId);

        const { shop } = await verifyRoleInShop(
            (res.app.locals.user as TokenUserPayload).userId,
            req.params.id,
            [UserShopRole.OWNER],
        );

        if (shop.managers.includes(manager._id)) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'Manager already exists',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }

        if (shop.owner === manager._id) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is owner',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }

        shop.managers.push(manager._id);
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
        const staffId = validateObjectId(req.body.staffId);
        const staff = await userRepository.getById(staffId);

        const { shop } = await verifyRoleInShop(
            (res.app.locals.user as TokenUserPayload).userId,
            req.params.id,
            [UserShopRole.OWNER, UserShopRole.MANAGER],
        );

        if (shop.staffs.includes(staff._id)) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'Staff already exists',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        if (shop.owner === staff._id) {
            throw new SystemException({
                trace: Trace.HANDLER,
                message: 'User is owner',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }
        shop.staffs.push(staff._id);
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
