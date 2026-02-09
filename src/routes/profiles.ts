import express from 'express';
import auth from '../middleware/auth';
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  uploadAvatar,
  uploadMedia,
  deleteProfilePhoto,
  setPrimaryProfilePhoto,
  searchProfiles
} from '../controllers/profileController';
import { uploadAvatar as uploadAvatarMiddleware, uploadMedia as uploadMediaMiddleware } from '../middleware/upload';

const router = express.Router();

router.post('/', createProfile);
// Search profiles (public - no auth required, must come before /:id)
router.get('/search', searchProfiles);
router.get('/', getProfiles);
router.get('/:id', getProfileById);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

// Avatar upload (requires authentication)
router.post('/avatar', auth, uploadAvatarMiddleware.single('avatar'), uploadAvatar);

// Media routes - specific routes must come before general ones
// Delete profile photo (requires authentication) - must come before /media
router.delete('/media/photo/:id', auth, deleteProfilePhoto);

// Set profile photo as primary (requires authentication) - must come before /media
router.post('/media/photo/:id/primary', auth, setPrimaryProfilePhoto);

// Media upload (requires authentication) - CV and Profile Photo only
router.post('/media', auth, uploadMediaMiddleware.single('file'), uploadMedia);

export default router;
