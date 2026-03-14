import TouristPlace from '../models/TouristPlace.js';
import GarbageReport from '../models/GarbageReport.js';
import Event from '../models/Event.js';

// @desc    Get all tourist places
// @route   GET /api/places
// @access  Public
export const getPlaces = async (req, res) => {
  try {
    const places = await TouristPlace.find({}).lean();
    const reports = await GarbageReport.find({}).lean();
    const events = await Event.find({}).lean();

    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const placesWithCounts = places.map(place => {
      const nearbyReports = reports.filter(report => 
        getDistance(place.latitude, place.longitude, report.latitude, report.longitude) <= 5
      ).length;

      const nearbyEvents = events.filter(event => 
        getDistance(place.latitude, place.longitude, event.latitude, event.longitude) <= 5
      ).length;

      return {
        ...place,
        reportCount: nearbyReports,
        eventCount: nearbyEvents
      };
    });

    res.json(placesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new tourist place
// @route   POST /api/places
// @access  Private/Admin
export const createPlace = async (req, res) => {
  const { name, location, latitude, longitude, imageUrl, cleanlinessScore, description } = req.body;

  try {
    const place = await TouristPlace.create({
      name,
      location,
      latitude,
      longitude,
      imageUrl,
      description,
      cleanlinessScore: cleanlinessScore || 0
    });

    if (place) {
      res.status(201).json(place);
    } else {
      res.status(400).json({ message: 'Invalid place data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate tourist place
// @route   POST /api/places/:id/rate
// @access  Private
export const ratePlace = async (req, res) => {
  const { rating } = req.body;

  try {
    const place = await TouristPlace.findById(req.params.id);

    if (place) {
      const alreadyRated = place.ratings.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );

      if (alreadyRated) {
        return res.status(400).json({ message: 'Place already rated' });
      }

      const newRating = {
        userId: req.user._id,
        rating,
      };

      place.ratings.push(newRating);

      // Recalculate cleanliness score
      const totalRatings = place.ratings.length;
      const totalScore = place.ratings.reduce((acc, r) => acc + r.rating, 0);
      place.cleanlinessScore = totalScore / totalRatings;

      await place.save();
      res.status(201).json({ message: 'Rating added' });
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete tourist place
// @route   DELETE /api/places/:id
// @access  Private/Admin
export const deletePlace = async (req, res) => {
  try {
    const place = await TouristPlace.findById(req.params.id);

    if (place) {
      await TouristPlace.deleteOne({ _id: req.params.id });
      res.json({ message: 'Place removed' });
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
