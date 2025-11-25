const CalendarItem = require('../models/CalendarItem');

// Get calendar items for a date range
exports.getCalendarItems = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const items = await CalendarItem.find(query)
      .populate('projectId')
      .sort({ startDate: 1 });
    
    res.json({ items });
  } catch (error) {
    console.error('Get calendar items error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar items' });
  }
};

// Create a calendar item
exports.createCalendarItem = async (req, res) => {
  try {
    const item = await CalendarItem.create({
      ...req.body,
      userId: req.user._id
    });

    const populatedItem = await CalendarItem.findById(item._id).populate('projectId');

    res.status(201).json({ item: populatedItem });
  } catch (error) {
    console.error('Create calendar item error:', error);
    res.status(400).json({ error: 'Failed to create calendar item' });
  }
};

// Update a calendar item
exports.updateCalendarItem = async (req, res) => {
  try {
    const item = await CalendarItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('projectId');

    if (!item) {
      return res.status(404).json({ error: 'Calendar item not found' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Update calendar item error:', error);
    res.status(400).json({ error: 'Failed to update calendar item' });
  }
};

// Delete a calendar item
exports.deleteCalendarItem = async (req, res) => {
  try {
    const item = await CalendarItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({ error: 'Calendar item not found' });
    }

    res.json({ message: 'Calendar item deleted successfully' });
  } catch (error) {
    console.error('Delete calendar item error:', error);
    res.status(500).json({ error: 'Failed to delete calendar item' });
  }
};
