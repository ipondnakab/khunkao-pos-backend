import express from 'express';
import * as tableHandler from '@/handlers/table.handler';
import { authenticateUser } from '@/middlewares/token.middleware';

const router = express.Router();

router.post('/:shopId', authenticateUser, tableHandler.createTable);
router.patch('/:shopId/:id', authenticateUser, tableHandler.updateTable);
router.delete('/:shopId/:id', authenticateUser, tableHandler.removeTable);

export default router;
