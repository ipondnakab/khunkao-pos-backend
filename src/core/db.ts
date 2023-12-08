import Grid, { Grid as GridType } from 'gridfs-stream';
import environment from './environment';
import mongoose, { Mongoose } from 'mongoose';

export class Database {
    static connString = `${environment.MONGO_URL}/${environment.MONGO_DB}-${environment.STAGE}`;
    static bucketName = 'uploads';
    private static gfs: GridType;
    constructor() {}

    static async getInstance(): Promise<Mongoose> {
        if (!mongoose.connection.db) {
            await mongoose.connect(Database.connString);
            mongoose.connection.on(
                'error',
                // eslint-disable-next-line no-console
                console.error.bind(console, 'MongoDB connection error:'),
            );
            mongoose.connection.once('open', () => {
                // eslint-disable-next-line no-console
                console.log('Connected to MongoDB');
                Database.gfs = Grid(mongoose.connection.db, mongoose.mongo);
                Database.gfs.collection(Database.bucketName);
            });
        }
        return mongoose;
    }

    static getGfs(): GridType {
        if (!Database.gfs) {
            Database.gfs = Grid(mongoose.connection.db, mongoose.mongo);
            Database.gfs.collection(Database.bucketName);
        }
        return Database.gfs;
    }
}
