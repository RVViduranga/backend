import Profile from '../models/Profile';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

// Create a new user profile
export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json({ success: true, data: profile, message: 'Profile created successfully' });
  } catch (err) {
    next(err);
  }
};

// Search profiles (public endpoint - no auth required)
export const searchProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, location, page = 1, limit = 20 } = req.query;
    
    // Build search query
    const searchQuery: any = {};
    const conditions: any[] = [];
    
    // Search by name/headline/email - case insensitive
    if (query && typeof query === 'string' && query.trim()) {
      conditions.push({
        $or: [
          { fullName: { $regex: query.trim(), $options: 'i' } },
          { headline: { $regex: query.trim(), $options: 'i' } },
          { email: { $regex: query.trim(), $options: 'i' } },
        ]
      });
    }
    
    // Filter by location - case insensitive
    if (location && typeof location === 'string' && location.trim()) {
      conditions.push({
        $or: [
          { location: { $regex: location.trim(), $options: 'i' } },
          { city: { $regex: location.trim(), $options: 'i' } },
          { state: { $regex: location.trim(), $options: 'i' } },
          { country: { $regex: location.trim(), $options: 'i' } }
        ]
      });
    }
    
    // Combine conditions with $and if we have multiple
    if (conditions.length > 0) {
      if (conditions.length === 1) {
        Object.assign(searchQuery, conditions[0]);
      } else {
        searchQuery.$and = conditions;
      }
    }
    
    // Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    // Execute search with pagination
    // If no search conditions, return empty results (don't return all profiles)
    let profiles: any[] = [];
    let total = 0;
    
    if (Object.keys(searchQuery).length > 0) {
      profiles = await Profile.find(searchQuery)
        .populate('user', 'fullName email')
        .skip(skip)
        .limit(limitNum)
        .lean();
      
      // Get total count for pagination
      total = await Profile.countDocuments(searchQuery);
    }
    
    // Transform MongoDB documents to match frontend format
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProfiles = profiles.map((profile: any) => {
      const avatarUrl = profile.avatarUrl 
        ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${baseUrl}${profile.avatarUrl}`)
        : undefined;
      
      // Handle populated user or direct user reference
      const userId = profile.user?._id?.toString() || profile.user?.toString() || '';
      
      return {
        id: profile._id.toString(),
        userId: userId,
        fullName: profile.fullName || '',
        headline: profile.headline || undefined,
        location: profile.location || undefined,
        avatarUrl: avatarUrl,
      };
    });
    
    res.status(200).json({
      profiles: transformedProfiles,
      total: total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    next(err);
  }
};

// Get all profiles (or filter by user query parameter)
export const getProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.query;
    let profiles;
    if (user) {
      // Filter by user ID
      profiles = await Profile.find({ user });
    } else {
      // Get all profiles
      profiles = await Profile.find();
    }
    // Transform MongoDB documents to match frontend ProfileModel (id instead of _id)
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProfiles = profiles.map((profile: any) => {
      // Ensure avatarUrl is a full URL
      const avatarUrl = profile.avatarUrl 
        ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${baseUrl}${profile.avatarUrl}`)
        : '';
      
      // Transform projects with proper file URLs
      const transformedProjects = (profile.projects || []).map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        category: project.category || '',
        platform: project.platform || 'File Upload',
        isFeatured: project.isFeatured || false,
        projectLink: project.projectLink || undefined,
        uploadedDate: project.uploadedDate,
        files: (project.files || []).map((file: any) => ({
          id: file.id,
          fileName: file.fileName,
          fileType: file.fileType,
          uploadDate: file.uploadDate,
          url: file.url?.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
          sizeKB: file.sizeKB,
        })),
      }));
      
      return {
        id: profile._id.toString(),
        user: profile.user.toString(),
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone || '',
        headline: profile.headline || '',
        location: profile.location || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        country: profile.country || '',
        dateOfBirth: profile.dateOfBirth || '',
        nationality: profile.nationality || '',
        avatarUrl: avatarUrl,
        cvUploaded: profile.cvUploaded || false,
        education: profile.education || [],
        experience: profile.experience || [],
        mediaFiles: profile.mediaFiles || [],
        projects: transformedProjects,
      };
    });
    res.status(200).json({ success: true, data: transformedProfiles, message: 'Profiles fetched successfully' });
  } catch (err) {
    next(err);
  }
};

// Get profile by ID
export const getProfileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }
    
    // Transform profile to include projects with proper URLs
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProfile = {
      ...profile.toObject(),
      projects: (profile.projects || []).map((project: any) => ({
        ...project,
        files: (project.files || []).map((file: any) => ({
          ...file,
          url: file.url?.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        })),
      })),
    };
    
    res.status(200).json({ success: true, data: transformedProfile, message: 'Profile fetched successfully' });
  } catch (err) {
    next(err);
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }
    
    // Track if fullName or email changed for user sync
    const fullNameChanged = req.body.fullName !== undefined && req.body.fullName !== profile.fullName;
    const emailChanged = req.body.email !== undefined && req.body.email !== profile.email;
    
    // Update fields manually to ensure markModified is called for arrays
    if (req.body.fullName !== undefined) profile.fullName = req.body.fullName;
    if (req.body.email !== undefined) profile.email = req.body.email;
    if (req.body.phone !== undefined) profile.phone = req.body.phone;
    if (req.body.headline !== undefined) profile.headline = req.body.headline;
    if (req.body.location !== undefined) profile.location = req.body.location;
    if (req.body.address !== undefined) profile.address = req.body.address;
    if (req.body.city !== undefined) profile.city = req.body.city;
    if (req.body.state !== undefined) profile.state = req.body.state;
    if (req.body.zipCode !== undefined) profile.zipCode = req.body.zipCode;
    if (req.body.country !== undefined) profile.country = req.body.country;
    if (req.body.dateOfBirth !== undefined) profile.dateOfBirth = req.body.dateOfBirth;
    if (req.body.nationality !== undefined) profile.nationality = req.body.nationality;
    if (req.body.avatarUrl !== undefined) profile.avatarUrl = req.body.avatarUrl;
    if (req.body.cvUploaded !== undefined) profile.cvUploaded = req.body.cvUploaded;
    
    if (req.body.education !== undefined) {
      profile.education = req.body.education;
      profile.markModified('education');
    }
    if (req.body.experience !== undefined) {
      profile.experience = req.body.experience;
      profile.markModified('experience');
    }
    if (req.body.mediaFiles !== undefined) {
      profile.mediaFiles = req.body.mediaFiles;
      profile.markModified('mediaFiles');
    }
    
    await profile.save();
    
    // Sync with User collection if fullName or email changed
    if (fullNameChanged || emailChanged) {
      try {
        const user = await User.findById(profile.user);
        if (user) {
          if (fullNameChanged) user.fullName = profile.fullName;
          if (emailChanged) user.email = profile.email;
          await user.save();
        }
      } catch (userError) {
        // Log but don't fail the profile update if user sync fails
        console.error('Error syncing user with profile update:', userError);
      }
    }
    
    // Transform to match frontend format
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    // Ensure avatarUrl is a full URL
    const avatarUrl = profile.avatarUrl 
      ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${baseUrl}${profile.avatarUrl}`)
      : '';
    
    const transformedProfile = {
      id: profile._id.toString(),
      user: profile.user.toString(),
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || '',
      headline: profile.headline || '',
      location: profile.location || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      zipCode: profile.zipCode || '',
      country: profile.country || '',
      dateOfBirth: profile.dateOfBirth || '',
      nationality: profile.nationality || '',
      avatarUrl: avatarUrl,
      cvUploaded: profile.cvUploaded || false,
      education: profile.education || [],
      experience: profile.experience || [],
      mediaFiles: profile.mediaFiles || [],
    };
    res.status(200).json({ success: true, data: transformedProfile, message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Delete profile
export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: null, message: 'Profile deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Upload profile avatar
export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get userId from JWT token (set by auth middleware)
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, data: null, message: 'No file uploaded' });
    }

    // Get user's profile
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      // If profile doesn't exist, create it
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, data: null, message: 'User not found' });
      }

      // Create profile with avatar URL
      const avatarUrl = `/uploads/userprofileAvatar/${req.file.filename}`;
      const fileSizeKB = Math.round(req.file.size / 1024);
      
      // Create media file entry for profile photo
      const mediaFile = {
        id: `media_${Date.now()}`,
        fileName: req.file.originalname,
        fileType: 'Profile Photo' as const,
        uploadDate: new Date().toISOString(),
        url: avatarUrl,
        sizeKB: fileSizeKB,
        isPrimary: true, // First photo is always primary
      };
      
      profile = await Profile.create({
        user: userId,
        fullName: user.fullName,
        email: user.email,
        phone: '',
        headline: '',
        location: '',
        avatarUrl: avatarUrl,
        cvUploaded: false,
        education: [],
        experience: [],
        cvs: [],
        mediaFiles: [mediaFile],
        projects: [],
        address: '',
        city: '',
        country: '',
        dateOfBirth: '',
        nationality: '',
        state: '',
        zipCode: '',
      });

      // Transform to match frontend format
      const transformedProfile = {
        id: profile._id.toString(),
        user: profile.user.toString(),
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone || '',
        headline: profile.headline || '',
        location: profile.location || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        country: profile.country || '',
        dateOfBirth: profile.dateOfBirth || '',
        nationality: profile.nationality || '',
        avatarUrl: profile.avatarUrl,
        cvUploaded: profile.cvUploaded || false,
        education: profile.education || [],
        experience: profile.experience || [],
        mediaFiles: profile.mediaFiles || [],
      };

      return res.status(200).json({
        success: true,
        data: {
          avatarUrl: `/uploads/userprofileAvatar/${req.file.filename}`,
          profile: transformedProfile,
        },
        message: 'Avatar uploaded successfully',
      });
    }

    // Delete old avatar if exists
    if (profile.avatarUrl) {
      const oldAvatarPath = path.join(__dirname, '../uploads/userprofileAvatar', path.basename(profile.avatarUrl));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update profile with new avatar URL
    const avatarUrl = `/uploads/userprofileAvatar/${req.file.filename}`;
    const fileSizeKB = Math.round(req.file.size / 1024);
    
    // Check if there's already a primary profile photo
    const existingProfilePhotos = (profile.mediaFiles || []).filter(
      (file: any) => file.fileType === 'Profile Photo'
    );
    const hasPrimaryPhoto = existingProfilePhotos.some((file: any) => file.isPrimary);
    
    // Create media file entry for profile photo
    const mediaFile = {
      id: `media_${Date.now()}`,
      fileName: req.file.originalname,
      fileType: 'Profile Photo' as const,
      uploadDate: new Date().toISOString(),
      url: avatarUrl,
      sizeKB: fileSizeKB,
      isPrimary: !hasPrimaryPhoto, // Set as primary if no primary photo exists
    };
    
    // If setting as primary, unset other primary photos
    if (mediaFile.isPrimary && profile.mediaFiles && profile.mediaFiles.length > 0) {
      profile.mediaFiles = profile.mediaFiles.map((file: any) => ({
        ...file,
        isPrimary: file.fileType === 'Profile Photo' ? false : file.isPrimary,
      }));
    }
    
    // Add to mediaFiles array
    if (!profile.mediaFiles) {
      profile.mediaFiles = [];
    }
    profile.mediaFiles.push(mediaFile);
    
    profile.avatarUrl = avatarUrl;
    profile.markModified('mediaFiles');
    await profile.save();

    // Transform to match frontend format
    const transformedProfile = {
      id: profile._id.toString(),
      user: profile.user.toString(),
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || '',
      headline: profile.headline || '',
      location: profile.location || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      zipCode: profile.zipCode || '',
      country: profile.country || '',
      dateOfBirth: profile.dateOfBirth || '',
      nationality: profile.nationality || '',
      avatarUrl: profile.avatarUrl,
      cvUploaded: profile.cvUploaded || false,
      education: profile.education || [],
      experience: profile.experience || [],
      mediaFiles: profile.mediaFiles || [],
    };

    res.status(200).json({
      success: true,
      data: {
        avatarUrl: `/uploads/userprofileAvatar/${req.file.filename}`,
        profile: transformedProfile,
      },
      message: 'Avatar uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Upload profile media (CV or Profile Photo only)
export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, data: null, message: 'No file uploaded' });
    }

    // Find or create profile
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, data: null, message: 'User not found' });
      }
      profile = await Profile.create({
        user: userId,
        fullName: user.fullName,
        email: user.email,
        phone: '',
        headline: '',
        location: '',
        avatarUrl: '',
        cvUploaded: false,
        education: [],
        experience: [],
        cvs: [],
        mediaFiles: [],
        projects: [],
        address: '',
        city: '',
        country: '',
        dateOfBirth: '',
        nationality: '',
        state: '',
        zipCode: '',
      });
    }

    // Get file type and name from request body
    const fileType = (req.body.type || 'Profile Photo') as 'Profile Photo';
    const fileName = req.body.name || req.file.originalname;

    // Validate file type - only Profile Photo allowed (CVs use separate endpoint)
    if (fileType !== 'Profile Photo') {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'Invalid file type. Only Profile Photo is supported. Use /users/cv/upload endpoint for CVs.' 
      });
    }

    // If type is Profile Photo, ensure it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ success: false, data: null, message: 'Profile photos must be image files' });
    }

    let determinedFileType: 'Profile Photo' = 'Profile Photo';

    // Create media file entry
    const fileSizeKB = Math.round(req.file.size / 1024);
    const isPrimary = req.body.isPrimary === 'true';
    
    // If this is a Profile Photo and isPrimary is true, unset other primary photos
    // Keep old photos in the array, just mark them as non-primary
    if (determinedFileType === 'Profile Photo' && isPrimary) {
      if (profile.mediaFiles && profile.mediaFiles.length > 0) {
        profile.mediaFiles = profile.mediaFiles.map((file: any) => ({
          ...file,
          isPrimary: file.fileType === 'Profile Photo' ? false : file.isPrimary,
        }));
      }
    }
    
    const fileUrl = `/uploads/media/${req.file.filename}`;
    const mediaFile = {
      id: `media_${Date.now()}`,
      fileName: fileName,
      fileType: determinedFileType,
      uploadDate: new Date().toISOString(),
      url: fileUrl,
      sizeKB: fileSizeKB,
      isPrimary: determinedFileType === 'Profile Photo' ? isPrimary : false,
    };

    // Add to profile's mediaFiles array
    if (!profile.mediaFiles) {
      profile.mediaFiles = [];
    }
    profile.mediaFiles.push(mediaFile);
    profile.markModified('mediaFiles');
    
    // If this is a Profile Photo set as primary, also update avatarUrl with full URL
    if (determinedFileType === 'Profile Photo' && isPrimary) {
      const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
      const fullFileUrl = fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`;
      profile.avatarUrl = fullFileUrl; // Store full URL for consistency
    }

    await profile.save();

    // Return media file data with full URL
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const fullFileUrl = mediaFile.url.startsWith('http') ? mediaFile.url : `${baseUrl}${mediaFile.url}`;

    res.status(200).json({
      success: true,
      data: {
        id: mediaFile.id,
        name: fileName,
        type: 'photo', // Only Profile Photo is supported via this endpoint
        uploadDate: mediaFile.uploadDate,
        size: `${fileSizeKB} KB`,
        url: fullFileUrl,
      },
      message: 'Media file uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Delete profile photo from mediaFiles
export const deleteProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const photoId = req.params.id;
    if (!photoId) {
      return res.status(400).json({ success: false, data: null, message: 'Photo ID is required' });
    }

    // Find user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }

    // Find the photo in mediaFiles
    const photoIndex = profile.mediaFiles?.findIndex(
      (file: any) => file.id === photoId && file.fileType === 'Profile Photo'
    );

    if (photoIndex === -1 || photoIndex === undefined) {
      return res.status(404).json({ success: false, data: null, message: 'Profile photo not found' });
    }

    // Get the photo file info for deletion
    const photoFile = profile.mediaFiles[photoIndex];
    
    // Delete the physical file from server if it exists
    if (photoFile.url) {
      try {
        let filename: string;
        // Handle both relative and full URLs
        if (photoFile.url.startsWith('http')) {
          // Full URL: extract filename from URL (e.g., "http://localhost:5000/uploads/media/filename.jpg" -> "filename.jpg")
          const urlParts = photoFile.url.split('/');
          filename = urlParts[urlParts.length - 1];
        } else {
          // Relative URL: extract filename from URL (e.g., "/uploads/media/filename.jpg" -> "filename.jpg")
          const urlParts = photoFile.url.split('/');
          filename = urlParts[urlParts.length - 1];
        }
        
        // Construct path the same way upload middleware does
        const filePath = path.join(__dirname, '../uploads/media', filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Profile photo file deleted: ${filePath}`);
        } else {
          console.warn(`Profile photo file not found at: ${filePath}`);
        }
      } catch (fileError) {
        // Log but don't fail if file deletion fails
        console.error('Error deleting profile photo file:', fileError);
      }
    }

    // Remove photo from mediaFiles array
    profile.mediaFiles = profile.mediaFiles.filter(
      (file: any) => !(file.id === photoId && file.fileType === 'Profile Photo')
    );

    // If the deleted photo was primary, set the first remaining profile photo as primary
    if (photoFile.isPrimary) {
      const remainingPhotos = profile.mediaFiles.filter(
        (file: any) => file.fileType === 'Profile Photo'
      );
      if (remainingPhotos.length > 0) {
        // Set first remaining photo as primary
        profile.mediaFiles = profile.mediaFiles.map((file: any) => ({
          ...file,
          isPrimary: file.id === remainingPhotos[0].id && file.fileType === 'Profile Photo',
        }));
        // Update avatarUrl to the new primary photo
        const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
        const newPrimaryUrl = remainingPhotos[0].url.startsWith('http') 
          ? remainingPhotos[0].url 
          : `${baseUrl}${remainingPhotos[0].url}`;
        profile.avatarUrl = newPrimaryUrl;
      } else {
        // No photos left, clear avatarUrl
        profile.avatarUrl = '';
      }
    }

    // Mark as modified and save
    profile.markModified('mediaFiles');
    await profile.save();

    res.status(200).json({
      success: true,
      data: null,
      message: 'Profile photo deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Set profile photo as primary
export const setPrimaryProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const photoId = req.params.id;
    if (!photoId) {
      return res.status(400).json({ success: false, data: null, message: 'Photo ID is required' });
    }

    // Find user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }

    // Find the photo in mediaFiles
    const photo = profile.mediaFiles?.find(
      (file: any) => file.id === photoId && file.fileType === 'Profile Photo'
    );

    if (!photo) {
      return res.status(404).json({ success: false, data: null, message: 'Profile photo not found' });
    }

    // Unset all other primary profile photos and set this one as primary
    profile.mediaFiles = profile.mediaFiles.map((file: any) => ({
      ...file,
      isPrimary: file.id === photoId && file.fileType === 'Profile Photo',
    }));

    // Update avatarUrl to the new primary photo
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const newPrimaryUrl = photo.url.startsWith('http') 
      ? photo.url 
      : `${baseUrl}${photo.url}`;
    profile.avatarUrl = newPrimaryUrl;

    // Mark as modified and save
    profile.markModified('mediaFiles');
    await profile.save();

    res.status(200).json({
      success: true,
      data: null,
      message: 'Profile photo set as primary successfully',
    });
  } catch (err) {
    next(err);
  }
};

