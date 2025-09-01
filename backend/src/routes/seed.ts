import express from 'express';
import { seedDatabase } from '../controllers/seedController';

const router = express.Router();

// Manual database seeding endpoint
router.post('/seed', seedDatabase);

export default router;
