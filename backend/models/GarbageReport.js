import mongoose from 'mongoose';

const garbageReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {
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
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Cleaned'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const GarbageReport = mongoose.model('GarbageReport', garbageReportSchema);
export default GarbageReport;
