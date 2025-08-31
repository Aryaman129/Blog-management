import { Router } from 'express';
import { getItems, getItemBySlug } from '../controllers/itemController';

const router = Router();

// Public routes
router.get('/', getItems);
router.get('/:slug', getItemBySlug);

export default router;
