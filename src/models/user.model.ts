import { ActiveStatus } from '@/enums/activeStatus.enum';
import mongoose from 'mongoose';
import { z } from 'zod';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ActiveStatus,
        default: ActiveStatus.ACTIVE,
    },
    deletedAt: Date,
});

export const userSchemaValidate = z.object({
    body: z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        password: z.string(),
        phone: z.string().length(10).startsWith('0'),
        status: z.nativeEnum(ActiveStatus).optional(),
    }),
});

export const userSchemaLoginValidate = z.object({
    body: z.object({
        password: z.string(),
        username: z.string(),
    }),
});

export interface UserInterface {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    deletedAt: Date;
    status: ActiveStatus;
    password: string | undefined;
}

export interface UserDocument extends UserInterface, mongoose.Document {}

export default userSchema;
