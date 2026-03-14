import mongoose from 'mongoose';

const touristPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
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
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  cleanlinessScore: {
    type: Number,
    default: 0
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true
    }
  }]
}, { timestamps: true });

const TouristPlace = mongoose.model('TouristPlace', touristPlaceSchema);
export default TouristPlace;
