import mongoose from 'mongoose';

const SensorReadingSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  waterLevel: Number,
  rainSensor: Number,
  interpretation: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SensorReading = mongoose.model('SensorReading', SensorReadingSchema);
export default SensorReading ;
