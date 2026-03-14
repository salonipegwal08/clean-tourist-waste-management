import GarbageReport from '../models/GarbageReport.js';
import User from '../models/User.js';

// @desc    Create new garbage report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  const { photo, latitude, longitude, description } = req.body;

  try {
    const report = await GarbageReport.create({
      userId: req.user._id,
      photo,
      latitude,
      longitude,
      description,
    });

    if (report) {
      // Award points to user for reporting
      const user = await User.findById(req.user._id);
      user.points += 10;
      if (user.points >= 100 && !user.badges.includes('Eco Warrior')) {
        user.badges.push('Eco Warrior');
      }
      await user.save();

      res.status(201).json(report);
    } else {
      res.status(400).json({ message: 'Invalid report data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
export const getReports = async (req, res) => {
  try {
    const reports = await GarbageReport.find({}).populate('userId', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's reports
// @route   GET /api/reports/my
// @access  Private
export const getMyReports = async (req, res) => {
  try {
    const reports = await GarbageReport.find({ userId: req.user._id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private/Admin
export const updateReportStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const report = await GarbageReport.findById(req.params.id);

    if (report) {
      report.status = status;
      const updatedReport = await report.save();

      // If status is "Cleaned", award more points to user
      if (status === 'Cleaned') {
        const user = await User.findById(report.userId);
        user.points += 20;
        if (user.points >= 50 && !user.badges.includes('Clean Reporter')) {
            user.badges.push('Clean Reporter');
        }
        await user.save();
      }

      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
