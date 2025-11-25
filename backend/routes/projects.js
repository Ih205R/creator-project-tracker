const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  updateProjectOrder
} = require('../controllers/projectController');

router.use(authenticateUser);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/order', updateProjectOrder);

module.exports = router;
