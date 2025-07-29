import mongoose from 'mongoose';

const SensorReadingSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  waterLevel: {
    type: Number,
    required: true,
  },
  rainSensor: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true, 
  },
  
}, {
  timestamps: true,
});

const SensorReading = mongoose.model('SensorReading', SensorReadingSchema);
export default SensorReading;
