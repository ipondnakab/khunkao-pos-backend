import express from 'express';

const router = express.Router();

router.use('/health', require('./health.route').default);
router.use('/users', require('./user.route').default);
router.use('/shops', require('./shop.route').default);
router.use('/menus', require('./menu.route').default);
router.use('/tables', require('./table.route').default);

export default router;
