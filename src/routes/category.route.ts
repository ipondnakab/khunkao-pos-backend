import express from 'express';
import * as categoryHandler from '@/handlers/category.handler';
import { authenticateUser } from '@/middlewares/token.middleware';

const router = express.Router();

router.get('/categories/all', categoryHandler.getAllCategories);
router.get('/categories/:shopId/all', categoryHandler.getCategoryByShopId);
router.get('/categories/:id', categoryHandler.getCategoryById);

router.post(
    '/categories/:shopId',
    authenticateUser,
    categoryHandler.createCategory,
);
router.patch(
    '/categories/:shopId/:id',
    authenticateUser,
    categoryHandler.updateCategory,
);
router.delete(
    '/categories/:shopId/:id',
    authenticateUser,
    categoryHandler.deleteCategory,
);

export default router;
