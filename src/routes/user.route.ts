import express from 'express';
import * as userHandler from '@/handlers/user.handler';
import { authenticateUser } from '@/middlewares/token.middleware';

const router = express.Router();

router.get('/', authenticateUser, userHandler.getUserByToken);
router.get('/all', userHandler.getAllUsers);
router.post('/create', userHandler.createUser);
router.patch('/:id', userHandler.updateUser);
router.get('/:id', userHandler.getUserById);
router.delete('/:id', userHandler.deleteUser);
router.post('/register', userHandler.signUpUser);
router.post('/login', userHandler.signInUser);

export default router;
