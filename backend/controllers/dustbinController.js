import Dustbin from '../models/Dustbin.js';

// @desc    Get all dustbins
// @route   GET /api/dustbins
// @access  Public
export const getDustbins = async (req, res) => {
  try {
    const dustbins = await Dustbin.find({});
    res.json(dustbins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete dustbin
// @route   DELETE /api/dustbins/:id
// @access  Private
export const deleteDustbin = async (req, res) => {
  try {
    const dustbin = await Dustbin.findById(req.params.id);

    if (dustbin) {
      await Dustbin.deleteOne({ _id: req.params.id });
      res.json({ message: 'Dustbin removed' });
    } else {
      res.status(404).json({ message: 'Dustbin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new dustbin
// @route   POST /api/dustbins
// @access  Private/Admin
export const createDustbin = async (req, res) => {
  const { locationName, latitude, longitude, type } = req.body;

  try {
    const dustbin = await Dustbin.create({
      locationName,
      latitude,
      longitude,
      type,
    });

    if (dustbin) {
      res.status(201).json(dustbin);
    } else {
      res.status(400).json({ message: 'Invalid dustbin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
