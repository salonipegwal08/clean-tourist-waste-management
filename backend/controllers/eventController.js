import Event from '../models/Event.js';
import User from '../models/User.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('volunteers', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  const { title, description, location, latitude, longitude, date } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      location,
      latitude,
      longitude,
      date,
    });

    if (event) {
      res.status(201).json(event);
    } else {
      res.status(400).json({ message: 'Invalid event data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join event
// @route   POST /api/events/join
// @access  Private
export const joinEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (event) {
      const alreadyJoined = event.volunteers.find(
        (v) => v.toString() === req.user._id.toString()
      );

      if (alreadyJoined) {
        return res.status(400).json({ message: 'Event already joined' });
      }

      event.volunteers.push(req.user._id);
      await event.save();

      // Award points for joining event
      const user = await User.findById(req.user._id);
      user.points += 50;
      if (user.points >= 200 && !user.badges.includes('Green Tourist')) {
        user.badges.push('Green Tourist');
      }
      await user.save();

      res.status(201).json({ message: 'Event joined' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
