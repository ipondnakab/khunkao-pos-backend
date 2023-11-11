import express from 'express';
import * as shopHandler from '@/handlers/shop.handler';

const router = express.Router();

router.get('/all', shopHandler.getAllShop);
router.get('/symbol/:shopSymbol', shopHandler.getShopBySymbol);
router.get('/:id', shopHandler.getShopById);
router.post('/', shopHandler.createShop);
router.post('/:id/manager', shopHandler.addManager);
router.post('/:id/staff', shopHandler.addStaff);
router.delete('/:id/manager', shopHandler.removeManager);
router.delete('/:id/staff', shopHandler.removeStaff);
router.delete('/:id', shopHandler.deleteShop);

export default router;
