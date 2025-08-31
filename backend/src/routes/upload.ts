import { Router } from 'express';
import { uploadImage, getImages, deleteImage } from '../controllers/uploadController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Routes
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  uploadSingle, 
  uploadImage
);

router.get('/', getImages);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  deleteImage
);

export default router;
