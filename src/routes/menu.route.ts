import express from 'express';
import * as menuHandler from '@/handlers/menu.handler';
import { authenticateUser } from '@/middlewares/token.middleware';

const router = express.Router();

router.post('/:shopId/:categoryId', authenticateUser, menuHandler.createMenu);
router.patch('/:shopId/:id', authenticateUser, menuHandler.updateMenu);
router.delete('/:shopId/:id', authenticateUser, menuHandler.deleteMenu);

export default router;
