import multer, { Multer } from 'multer';
import { Database } from './db';
import { GridFsStorage } from 'multer-gridfs-storage';

export class Storage {
    private static instance: Multer;

    static storage = new GridFsStorage({
        url: Database.connString,
        file: (_, file) => {
            const splitDotArr = file.originalname.split('.');
            const extension = splitDotArr[splitDotArr.length - 1];
            const fileName = splitDotArr
                .slice(0, splitDotArr.length - 1)
                .join('')
                .replace(/[&\\#,+()$~%.'":*?<>{}\s]/g, '');
            return {
                bucketName: Database.bucketName, // Desired name of the GridFS collection
                filename: `${fileName}-${Date.now()}.${extension}`, // Desired name of the file stored
            };
        },
    });
    static upload = multer({ storage: Storage.storage });

    constructor() {
        if (!Storage.instance) {
            Storage.getInstance();
        }
    }

    static getInstance() {
        if (!Storage.instance) {
            Storage.instance = multer({ storage: Storage.storage });
        }
        return Storage.instance;
    }
}
