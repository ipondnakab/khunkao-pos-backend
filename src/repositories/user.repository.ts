import { SystemException, Trace } from '@/core/errors';
import { ActiveStatus } from '@/enums/activeStatus.enum';
import userSchema, { UserInterface } from '@/models/user.model';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export const userRepo = mongoose.model('User', userSchema);

export const getAllInactive = async () => {
    try {
        const users = await userRepo.find(
            { status: ActiveStatus.INACTIVE },
            { password: 0 },
        );
        return users;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const getAllActive = async () => {
    try {
        const users = await userRepo.find(
            { status: ActiveStatus.ACTIVE },
            { password: 0 },
        );
        return users;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const getAll = async () => {
    try {
        const users = await userRepo.find({}, { password: 0 });
        return users;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const getById = async (id: mongoose.Types.ObjectId) => {
    try {
        const user = await userRepo.findById(id, { password: 0 });
        if (!user || user.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        return user.toObject();
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const create = async (data: UserInterface) => {
    try {
        const user = await userRepo.create(data);
        user.password = undefined;
        return user.toObject();
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const update = async (id: mongoose.Types.ObjectId, data: Partial<UserInterface>) => {
    // not allow update phone
    delete data.phone;

    try {
        const user = await userRepo.findById(id);
        if (!user || user.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        user.set(data);
        await user.save();
        const res = user.$clone();
        res.password = undefined;
        return res.toObject();
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const remove = async (id: mongoose.Types.ObjectId) => {
    try {
        const user = await userRepo.findById(id);
        if (!user || user.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        user.status = ActiveStatus.INACTIVE;
        await user.save();
        return user;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export default {
    getAll,
    getAllActive,
    getAllInactive,
    getById,
    create,
    update,
    remove,
};
