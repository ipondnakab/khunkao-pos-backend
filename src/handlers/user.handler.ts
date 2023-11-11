import { HttpResponse } from './../core/response';
import { userSchemaValidate } from '@/models/user.model';
import shopRepository from '@/repositories/shop.repository';
import userRepo from '@/repositories/user.repository';
import { validate, validateObjectId } from '@/utils/validate';
import { NextFunction, Request, Response } from 'express';

export const getAllUsers = async (
    _: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const users = await userRepo.getAll();
        return res.json(new HttpResponse(users));
    } catch (error) {
        return next(error);
    }
};

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await validate(userSchemaValidate, req);
        const result = await userRepo.create(data);
        return res.json(new HttpResponse(result));
    } catch (error) {
        return next(error);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const user = await userRepo.getById(id);
        const shops = await shopRepository.getByUserId(id);
        return res.json(new HttpResponse({ ...user, shops }));
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        const data = req.body;
        const user = await userRepo.update(id, data);
        return res.json(new HttpResponse(user));
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = validateObjectId(req.params.id);
        await userRepo.remove(id);
        return res.json(new HttpResponse('Delete user successfully'));
    } catch (error) {
        return next(error);
    }
};
