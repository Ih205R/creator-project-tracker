const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  getCalendarItems,
  createCalendarItem,
  updateCalendarItem,
  deleteCalendarItem
} = require('../controllers/calendarController');

router.use(authenticateUser);

router.get('/', getCalendarItems);
router.post('/', createCalendarItem);
router.put('/:id', updateCalendarItem);
router.delete('/:id', deleteCalendarItem);

module.exports = router;
