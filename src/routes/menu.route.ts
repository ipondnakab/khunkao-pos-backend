import express from 'express';
import * as menuHandler from '@/handlers/menu.handler';

const router = express.Router();

router.get('/categories/all', menuHandler.getAllCategories);
router.get('/categories/:shopId/all', menuHandler.getCategoryByShopId);
router.get('/categories/:id', menuHandler.getCategoryById);

router.post('/categories/:shopId', menuHandler.createCategory);
router.patch('/categories/:id', menuHandler.updateCategory);
router.delete('/categories/:id', menuHandler.deleteCategory);

router.post('/:categoryId', menuHandler.createMenu);
router.patch('/:id', menuHandler.updateMenu);
router.delete('/:id', menuHandler.deleteMenu);

export default router;
