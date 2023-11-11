import { ActiveStatus } from '@/enums/activeStatus.enum';
import mongoose from 'mongoose';
import { z } from 'zod';

const categorySchema = new mongoose.Schema({
    name: String,
    color: String,
    status: {
        type: String,
        enum: ActiveStatus,
        default: ActiveStatus.ACTIVE,
    },
    shopId: { type: mongoose.Types.ObjectId, ref: 'Shop', require: true },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
});

export const categorySchemaValidate = z.object({
    body: z.object({
        name: z.string(),
        color: z.string(),
    }),
});

export interface CategoryInterface {
    name: string;
    color: string;
    status: ActiveStatus;
}

export interface CategoryDocument
    extends CategoryInterface,
        mongoose.Document {}

export default categorySchema;
