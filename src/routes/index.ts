import express from 'express';

const router = express.Router();

router.use('/health', require('./health').default);

export default router;
