import { SystemException, Trace } from '@/core/errors';
import { ActiveStatus } from '@/enums/activeStatus.enum';
import menuSchema, { MenuInterface } from '@/models/menu.modal';
import mongoose from 'mongoose';
import * as categoryRepository from './category.repository';

export const menuRepository = mongoose.model('Menu', menuSchema);

export const getAll = async () => {
    try {
        const menus = await menuRepository.find();
        menus;
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
        const menu = await menuRepository.findById(id);
        if (!menu) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Menu not found',
                statusCode: 404,
            });
        }
        return menu;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const getByCategoryId = async (id: mongoose.Types.ObjectId) => {
    try {
        const menus = await menuRepository.find({
            category: id,
        });
        return menus;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const create = async (
    categoryId: mongoose.Types.ObjectId,
    data: MenuInterface,
) => {
    try {
        const category = await categoryRepository.getById(categoryId);
        const menu = await menuRepository.create({ ...data, categoryId });
        category.menus.push(menu._id);
        await category.save();
        return menu;
    } catch (error) {
        const err = error as mongoose.Error;
        throw new SystemException({
            trace: Trace.REPOSITORY,
            message: err.message,
            statusCode: 500,
        });
    }
};

export const update = async (
    id: mongoose.Types.ObjectId,
    data: Partial<MenuInterface>,
) => {
    try {
        const menu = await menuRepository.findById(id);
        if (!menu || menu.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Menu not found',
                statusCode: 404,
            });
        }
        menu.set(data);
        await menu.save();
        return menu;
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
        const menu = await menuRepository.findById(id);
        if (!menu) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Menu not found',
                statusCode: 404,
            });
        }
        menu.status = ActiveStatus.INACTIVE;
        await menu.save();
        return menu;
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
    getById,
    getByCategoryId,
    create,
    update,
    remove,
};
