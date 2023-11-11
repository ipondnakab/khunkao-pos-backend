import mongoose from 'mongoose';
import { z } from 'zod';
import { ActiveStatus } from '@/enums/activeStatus.enum';

const tableSchema = new mongoose.Schema({
    name: String,
    status: {
        type: String,
        enum: ActiveStatus,
        default: ActiveStatus.ACTIVE,
    },
    shopId: { type: mongoose.Types.ObjectId, ref: 'Shop', require: true },
    description: String,
});

export const tableSchemaValidate = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
});

export interface TableInterface {
    name: string;
    description: string;
    status: ActiveStatus;
}

export interface TableDocument extends TableInterface, mongoose.Document {}

export default tableSchema;
