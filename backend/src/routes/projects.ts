import { Router } from 'express';
import { body } from 'express-validator';
import { createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { handleValidation } from '../middleware/validation';

const router = Router();

// Project validation
const projectValidation = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('description')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('content')
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('category')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required and must be less than 50 characters'),
  body('technologies')
    .isArray({ min: 0 })
    .withMessage('Technologies must be an array'),
  body('status')
    .optional()
    .isIn(['completed', 'in-progress', 'planned'])
    .withMessage('Status must be one of: completed, in-progress, planned'),
  body('demoUrl')
    .optional()
    .isURL()
    .withMessage('Demo URL must be a valid URL'),
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
];

// Update validation (all fields optional)
const projectUpdateValidation = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('content')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('technologies')
    .optional()
    .isArray({ min: 0 })
    .withMessage('Technologies must be an array'),
  body('status')
    .optional()
    .isIn(['completed', 'in-progress', 'planned'])
    .withMessage('Status must be one of: completed, in-progress, planned'),
  body('demoUrl')
    .optional()
    .isURL()
    .withMessage('Demo URL must be a valid URL'),
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
];

// Routes - All require authentication and admin role
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  projectValidation, 
  handleValidation, 
  createProject
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  projectUpdateValidation, 
  handleValidation, 
  updateProject
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  deleteProject
);

export default router;
