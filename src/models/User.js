import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
location: {
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  name: { type: String, required: true }
}


});

const user = mongoose.model('User', UserSchema);
export default user;
