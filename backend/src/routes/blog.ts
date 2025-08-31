import { Router } from 'express';
import { body } from 'express-validator';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/blogController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { handleValidation } from '../middleware/validation';

const router = Router();

// Blog post validation
const blogPostValidation = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('excerpt')
    .isLength({ min: 1, max: 500 })
    .withMessage('Excerpt is required and must be less than 500 characters'),
  body('content')
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('author')
    .isLength({ min: 1, max: 100 })
    .withMessage('Author is required and must be less than 100 characters'),
  body('category')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required and must be less than 50 characters'),
  body('tags')
    .isArray({ min: 0 })
    .withMessage('Tags must be an array'),
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
const blogPostUpdateValidation = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('excerpt')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('content')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  body('author')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be less than 100 characters'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('tags')
    .optional()
    .isArray({ min: 0 })
    .withMessage('Tags must be an array'),
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
  blogPostValidation, 
  handleValidation, 
  createBlogPost
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  blogPostUpdateValidation, 
  handleValidation, 
  updateBlogPost
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  deleteBlogPost
);

export default router;
