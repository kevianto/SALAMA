import express from 'express';
import { getCurrentUser, registerUser } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.get('/me',authenticate, getCurrentUser); 
export default router;
