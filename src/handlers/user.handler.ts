import { HttpResponse } from './../core/response';
import {
    userSchemaLoginValidate,
    userSchemaValidate,
} from '@/models/user.model';
import shopRepository from '@/repositories/shop.repository';
import userRepo from '@/repositories/user.repository';
import { validate, validateObjectId } from '@/utils/validate';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SystemException, Trace } from '@/core/errors';
import { generateUserToken } from '@/utils/token';
import { compareHashPassword } from '@/utils/bycrypt';
import environment from '@/core/environment';
import { decrypt } from '@/utils/crypto';

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

export const getUserByToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userPayload = req.app.locals.user;
        const user = await userRepo.getById(userPayload.userId);
        return res.json(new HttpResponse(user));
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

export const signUpUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await validate(userSchemaValidate, req);
        const password = decrypt(data.password);
        const hashedPassword = await bcrypt.hash(
            password,
            environment.BCRYPT_SALT || 10,
        );
        const user = await userRepo.create({
            ...data,
            password: hashedPassword,
        });
        const token = generateUserToken({
            userId: user._id.toString(),
            email: user.email,
            phone: user.phone,
        });
        return res.json(new HttpResponse({ ...user, token }));
    } catch (error) {
        return next(error);
    }
};

export const signInUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await validate(userSchemaLoginValidate, req);
        const password = decrypt(data.password);

        const user = await userRepo.getByPhoneOrEmail(data.username);
        if (!user?.password) {
            const error = new SystemException({
                trace: Trace.HANDLER,
                message: 'Not found password in database',
                statusCode: 500,
            });
            return next(error);
        }
        await compareHashPassword(password, user?.password);
        const token = generateUserToken({
            userId: user?._id.toString(),
            email: user?.email,
            phone: user?.phone,
        });
        return res.json(new HttpResponse({ ...user?.toObject(), token }));
    } catch (error) {
        return next(error);
    }
};
