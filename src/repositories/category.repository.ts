import shopRepository from '@/repositories/shop.repository';
import { SystemException, Trace } from '@/core/errors';
import { ActiveStatus } from '@/enums/activeStatus.enum';
import categorySchema, { CategoryInterface } from '@/models/category.model';
import mongoose from 'mongoose';

export const categoryRepo = mongoose.model('Category', categorySchema);

const getAll = async () => {
    try {
        const categories = await categoryRepo.find().populate('menus');
        return categories;
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
        const category = await categoryRepo.findById(id).populate('menus');
        if (!category || category.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Category not found',
                statusCode: 404,
            });
        }
        return category;
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

const getByShopId = async (id: mongoose.Types.ObjectId) => {
    try {
        const categories = await categoryRepo
            .find({
                shop: id,
            })
            .populate('menus');
        return categories;
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

const create = async (
    shopId: mongoose.Types.ObjectId,
    data: CategoryInterface,
) => {
    try {
        const shop = await shopRepository.getById(shopId);
        const category = await categoryRepo.create({ ...data, shopId });
        shop.categories.push(category._id);
        await shop.save();
        return category;
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

const update = async (id: mongoose.Types.ObjectId, data: CategoryInterface) => {
    try {
        const category = await categoryRepo.findById(id);
        if (!category || category.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Category not found',
                statusCode: 404,
            });
        }
        category.set(data);
        await category.save();
        return category;
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
        const category = await categoryRepo.findById(id);
        if (!category || category.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Category not found',
                statusCode: 404,
            });
        }
        category.status = ActiveStatus.INACTIVE;
        await category.save();
        return category;
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
    getById,
    getByShopId,
    create,
    update,
    remove,
};
