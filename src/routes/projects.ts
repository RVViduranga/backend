import express from 'express';
import auth from '../middleware/auth';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addFilesToProject,
  deleteProject,
  deleteFileFromProject,
  uploadProjectFiles,
} from '../controllers/projectController';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all projects for the authenticated user
router.get('/', getProjects);

// Get a single project by ID
router.get('/:id', getProjectById);

// Create a new project (with files and/or link)
router.post('/', uploadProjectFiles.array('files', 10), createProject);

// Update a project (metadata only, no files)
router.put('/:id', updateProject);

// Add files to an existing project
router.post('/:id/files', uploadProjectFiles.array('files', 10), addFilesToProject);

// Delete a project
router.delete('/:id', deleteProject);

// Delete a specific file from a project
router.delete('/:projectId/files/:fileId', deleteFileFromProject);

export default router;
