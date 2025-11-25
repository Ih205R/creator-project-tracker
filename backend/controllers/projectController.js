const Project = require('../models/Project');
const { checkFreeUserLimits } = require('../middleware/auth');

// Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    // Check free user limits
    if (req.user.role === 'free_user') {
      await checkFreeUserLimits(
        Project,
        req.user._id,
        30,
        'Free users are limited to 30 projects. Upgrade to Pro for unlimited projects.'
      );
    }

    const project = await Project.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({ error: error.message || 'Failed to create project' });
  }
};

// Get a single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(400).json({ error: 'Failed to update project' });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Bulk update project order (for drag and drop)
exports.updateProjectOrder = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, status, order }

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id, userId: req.user._id },
        update: { $set: { status: update.status, order: update.order } }
      }
    }));

    await Project.bulkWrite(bulkOps);

    res.json({ message: 'Project order updated successfully' });
  } catch (error) {
    console.error('Update project order error:', error);
    res.status(500).json({ error: 'Failed to update project order' });
  }
};
