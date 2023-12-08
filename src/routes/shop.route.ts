import express from 'express';
import * as shopHandler from '@/handlers/shop.handler';
import { authenticateUser } from '@/middlewares/token.middleware';

const router = express.Router();

router.get('/all', authenticateUser, shopHandler.getAllShop);
router.get(
    '/symbol/:shopSymbol',
    authenticateUser,
    shopHandler.getShopBySymbol,
);
router.get('/:id', authenticateUser, shopHandler.getShopById);
router.post('/', authenticateUser, shopHandler.createShop);
router.post('/:id/manager', authenticateUser, shopHandler.addManager);
router.post('/:id/staff', authenticateUser, shopHandler.addStaff);
router.delete('/:id/manager', authenticateUser, shopHandler.removeManager);
router.delete('/:id/staff', authenticateUser, shopHandler.removeStaff);
router.delete('/:id', authenticateUser, shopHandler.deleteShop);

export default router;
