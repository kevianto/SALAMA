import express from 'express';
import { receiveSensorData } from '../controllers/sensorController.js';
// import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/data', receiveSensorData);

export default router;
