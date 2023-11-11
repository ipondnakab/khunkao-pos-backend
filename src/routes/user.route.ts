import express from 'express';
import * as userHandler from '@/handlers/user.handler';

const router = express.Router();

router.get('/all', userHandler.getAllUsers);
router.post('/', userHandler.createUser);
router.patch('/:id', userHandler.updateUser);
router.get('/:id', userHandler.getUserById);
router.delete('/:id', userHandler.deleteUser);

export default router;
