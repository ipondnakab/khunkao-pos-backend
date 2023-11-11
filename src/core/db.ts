import mongoose, { Mongoose } from 'mongoose';
export class Database {
    private static instance: Mongoose;

    constructor() {
        if (!Database.instance) {
            Database.getInstance();
        }
    }

    static async getInstance(): Promise<Mongoose> {
        if (!Database.instance) {
            Database.instance = await mongoose.connect(
                'mongodb://localhost:27017/khunkao-pos',
            );
        }
        return Database.instance;
    }
}
