import mongoose from 'mongoose';

const dustbinSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['recycle', 'normal'],
    required: true
  }
}, { timestamps: true });

const Dustbin = mongoose.model('Dustbin', dustbinSchema);
export default Dustbin;
