import express from 'express';
import { saveSensorData } from '../controllers/sensorController.js';
import { analyzeAndAlert } from '../controllers/alertController.js';

const router = express.Router();

router.post('/data', saveSensorData);
router.get('/sensor/analyze', analyzeAndAlert); // Called by backend scheduler or admin


export default router;
