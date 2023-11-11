import { SystemException, Trace } from '@/core/errors';
import { ActiveStatus } from '@/enums/activeStatus.enum';
import tableSchema, { TableInterface } from '@/models/table.model';
import mongoose from 'mongoose';
import shopRepository from './shop.repository';

const tableRepo = mongoose.model('Table', tableSchema);

export const create = async (
    shopId: mongoose.Types.ObjectId,
    data: TableInterface,
) => {
    try {
        const shop = await shopRepository.getById(shopId);
        const table = await tableRepo.create({
            ...data,
            shopId: shop._id,
        });
        shop.tables.push(table._id);
        await shop.save();
        return table;
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
    data: Partial<TableInterface>,
) => {
    try {
        const table = await tableRepo.findById(id);
        if (!table || table.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Table not found',
                statusCode: 404,
            });
        }
        table.set(data);
        await table.save();
        return table;
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
        const table = await tableRepo.findById(id);
        if (!table || table.status === ActiveStatus.INACTIVE) {
            throw new SystemException({
                trace: Trace.REPOSITORY,
                message: 'Table not found',
                statusCode: 404,
            });
        }
        table.status = ActiveStatus.INACTIVE;
        await table.save();
        return table;
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
    create,
    update,
    remove,
};
