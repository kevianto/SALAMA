import express from 'express';
import { receiveSensorData } from '../controllers/sensorController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/data', authenticate,receiveSensorData);

export default router;
