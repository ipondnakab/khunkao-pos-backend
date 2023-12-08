import { SystemException, Trace } from '@/core/errors';
import { ActiveStatus } from '@/enums/activeStatus.enum';
import shopSchema, { ShopDocument, ShopInterface } from '@/models/shop.model';
import mongoose from 'mongoose';

const shopRepo = mongoose.model('Shop', shopSchema);

const populateProps = [
    {
        path: 'categories',
        match: { status: { $eq: ActiveStatus.ACTIVE } },
        populate: {
            path: 'menus',
            match: { status: { $eq: ActiveStatus.ACTIVE } },
        },
    },
    {
        path: 'tables',
        match: { status: { $eq: ActiveStatus.ACTIVE } },
    },
    {
        path: 'owner',
    },
    {
        path: 'managers',
        match: { status: { $eq: ActiveStatus.ACTIVE } },
    },
    {
        path: 'staffs',
        match: { status: { $eq: ActiveStatus.ACTIVE } },
    },
];

const getAll = async () => {
    try {
        const shops = await shopRepo.find().populate(populateProps).exec();
        return shops;
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

const getAllActive = async () => {
    try {
        const shops = await shopRepo
            .find({ status: ActiveStatus.ACTIVE })
            .populate(populateProps)
            .exec();
        return shops;
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

const getAllInactive = async () => {
    try {
        const shops = await shopRepo
            .find({ status: ActiveStatus.INACTIVE })
            .populate(populateProps)
            .exec();
        return shops;
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

const getByOwnerId = async (id: mongoose.Types.ObjectId) => {
    try {
        const shops = await shopRepo
            .find({
                owner: id,
            })
            .populate(populateProps)
            .exec();

        return shops;
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

const getShopBySymbol = async (shopSymbol: string) => {
    try {
        const shop = await shopRepo
            .findOne({
                shopSymbol,
            })
            .populate(populateProps)
            .exec();
        return shop;
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

const getByUserId = async (id: mongoose.Types.ObjectId) => {
    try {
        const shops: ShopDocument[] = await shopRepo
            .find({
                $or: [
                    { owner: id },
                    {
                        managers: {
                            $in: [id],
                        },
                    },
                    {
                        employees: {
                            $in: [id],
                        },
                    },
                ],
            })
            .populate(populateProps)
            .exec();
        return shops;
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
        const shop: ShopDocument = await shopRepo.findById(id).populate(populateProps);
        if (!shop || shop.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Shop not found',
                statusCode: 404,
            });
        }
        return shop;
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

const create = async (data: ShopInterface) => {
    try {
        const shop = await shopRepo.create(data);
        return shop;
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

const update = async (id: mongoose.Types.ObjectId, data: ShopInterface) => {
    try {
        const shop = await shopRepo.findById(id);
        if (!shop || shop.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Shop not found',
                statusCode: 404,
            });
        }
        shop.set(data);
        await shop.save();
        return shop;
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
        const shop = await shopRepo.findById(id);
        if (!shop || shop.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Shop not found',
                statusCode: 404,
            });
        }
        shop.status = ActiveStatus.INACTIVE;
        await shop.save();
        return shop;
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
    getByOwnerId,
    getById,
    create,
    update,
    remove,
    getByUserId,
    getShopBySymbol,
};
