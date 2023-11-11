import { ActiveStatus } from '@/enums/activeStatus.enum';
import mongoose from 'mongoose';
import { z } from 'zod';

const menuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    urlImages: [String],
    status: {
        type: String,
        enum: ActiveStatus,
        default: ActiveStatus.ACTIVE,
    },
    deletedAt: Date,
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        require: true,
    },
    options: [
        {
            name: String,
            choices: [String],
        },
    ],
});

export const menuSchemaValidate = z.object({
    body: z.object({
        name: z.string(),
        price: z.string().or(z.number().positive()),
        description: z.string().optional(),
        urlImages: z.array(z.string()).optional(),
        status: z.nativeEnum(ActiveStatus).optional(),
        options: z
            .array(
                z.object({
                    name: z.string(),
                    choices: z.array(z.string()),
                }),
            )
            .optional(),
    }),
});

export interface MenuInterface {
    name: string;
    price: number;
    description: string;
    urlImages: string[];
    status: ActiveStatus;
    options: {
        name: string;
        choices: string[];
    };
}

export interface MenuDocument extends MenuInterface, mongoose.Document {}

export default menuSchema;
