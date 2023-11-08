import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
    res.send('[KK-POS]: This is the health route for the API 👌🏻');
});

export default router;
