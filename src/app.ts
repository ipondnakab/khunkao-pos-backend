require('dotenv').config();
import express from 'express';
import { Database } from '@/core/db';
import cors from 'cors';
import exception from '@/middlewares/exception.middleware';

const app: express.Application = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/v1', require('./routes').default);

app.use(exception);

const server = async () => {
    const port: number = 8080;
    Database.getInstance();
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on ${port}`);
    });
};

server();
