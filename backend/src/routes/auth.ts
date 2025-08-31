import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, getProfile } from '../controllers/authController';
import { handleValidation } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Register validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .isAlphanumeric()
    .withMessage('Username must be 3-30 characters long and contain only letters and numbers'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Routes
router.post('/login', loginValidation, handleValidation, login);
router.post('/register', registerValidation, handleValidation, register);
router.get('/profile', authenticateToken, getProfile);

export default router;
