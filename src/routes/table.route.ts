import express from 'express';
import * as tableHandler from '@/handlers/table.handler';

const router = express.Router();

router.post('/:shopId', tableHandler.createTable);
router.patch('/:id', tableHandler.updateTable);
router.delete('/:id', tableHandler.removeTable);

export default router;
