require('dotenv').config();
import express from 'express';
import { Database } from '@/core/db';

const app: express.Application = express();

app.use('/api/v1', require('./routes').default);

const server = async () => {
    const port: number = 8080;
    Database.getInstance();
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on ${port}`);
    });
};

server();
