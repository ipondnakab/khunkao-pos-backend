import { SystemException, Trace } from '@/core/errors';
import { ActiveStatus } from '@/enums/activeStatus.enum';
import userSchema, { UserDocument, UserInterface } from '@/models/user.model';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export const userRepo = mongoose.model('User', userSchema);

const getAllInactive = async () => {
    try {
        const users = await userRepo.find(
            { status: ActiveStatus.INACTIVE },
            { password: 0 },
        );
        return users;
    } catch (error) {
        const err = error as mongoose.Error;
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        switch (err.name) {
            case 'CastError':
                statusCode = StatusCodes.BAD_REQUEST;
                break;
            case 'ValidationError':
                statusCode = StatusCodes.BAD_REQUEST;
                break;
            case 'MongoError':
                statusCode = StatusCodes.BAD_REQUEST;
                break;
            case 'DocumentNotFoundError':
                statusCode = StatusCodes.NOT_FOUND;
                break;
            case 'ObjectParameterError':
                statusCode = StatusCodes.BAD_REQUEST;
                break;
            case 'ObjectExpectedError':
                statusCode = StatusCodes.BAD_REQUEST;
                break;
            default:
                break;
        }

        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: statusCode,
            error: err.name,
        });
    }
};

const getAllActive = async () => {
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
            error: err.name,
        });
    }
};

const getAll = async () => {
    try {
        const users = await userRepo.find({}, { password: 0 });
        return users;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
            error: err.name,
        });
    }
};

const getById = async (id: mongoose.Types.ObjectId) => {
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
            error: err.name,
        });
    }
};

const getByPhoneOrEmail = async (username: string) => {
    try {
        const user: UserDocument = await userRepo.findOne({
            $or: [{ phone: username }, { email: username }],
        });
        if (!user || user.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        return user;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
            error: err.name,
        });
    }
};

const create = async (data: UserInterface) => {
    try {
        const user: UserDocument = (await userRepo.create<UserInterface>(
            data,
        )) as UserDocument;
        user.password = undefined;
        return user.toObject();
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
            error: err.name,
        });
    }
};

const update = async (
    id: mongoose.Types.ObjectId,
    data: Partial<UserInterface>,
) => {
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
            error: err.name,
        });
    }
};

const remove = async (id: mongoose.Types.ObjectId) => {
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
            error: err.name,
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
    getByPhoneOrEmail,
};
