import { ActiveStatus } from '@/enums/activeStatus.enum';
import mongoose from 'mongoose';
import { z } from 'zod';

const shopSchema = new mongoose.Schema({
    shopSymbol: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    description: String,
    urlImages: [String],
    urlLogoImage: String,
    owner: { type: mongoose.Types.ObjectId, ref: 'User' },
    staffs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    managers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    status: {
        type: String,
        enum: ActiveStatus,
        default: ActiveStatus.ACTIVE,
    },
    hasTables: Boolean,
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    deletedAt: Date,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

export const shopSchemaValidate = z.object({
    body: z.object({
        name: z.string(),
        shopSymbol: z.string(),
        description: z.string().optional(),
        urlImages: z.array(z.string()).optional(),
        urlLogoImage: z.string().optional(),
        staffs: z.array(z.string()).optional(),
        managers: z.array(z.string()).optional(),
        status: z.nativeEnum(ActiveStatus).optional(),
        hasTables: z.boolean().optional(),
        tables: z.array(z.string()).optional(),
    }),
});

export interface ShopInterface {
    name: string;
    description: string;
    urlImages: string[];
    urlLogoImage: string;
    owner: string;
    staffs: string[];
    managers: string[];
    deletedAt: Date;
    status: ActiveStatus;
    tables: string[];
}

export interface ShopDocument extends ShopInterface, mongoose.Document {}

export default shopSchema;
