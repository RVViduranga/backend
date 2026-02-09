import { Request, Response } from 'express';
import User from '../models/User';
import Profile from '../models/Profile';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'Full name, email and password are required' });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Create profile record with fullName and email (other fields empty)
    const profile = new Profile({
      user: user._id,
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
    await profile.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '1d' }
    );
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'Full name, email and password are required' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Track if fullName or email changed for profile sync
    const fullNameChanged = fullName && fullName !== user.fullName;
    const emailChanged = email && email !== user.email;
    
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    await user.save();
    
    // Sync with Profile collection if fullName or email changed
    if (fullNameChanged || emailChanged) {
      try {
        const profile = await Profile.findOne({ user: user._id });
        if (profile) {
          if (fullNameChanged) profile.fullName = user.fullName;
          if (emailChanged) profile.email = user.email;
          await profile.save();
        }
      } catch (profileError) {
        // Log but don't fail the user update if profile sync fails
        console.error('Error syncing profile with user update:', profileError);
      }
    }
    
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's CVs
export const getCVs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from JWT token (set by auth middleware)
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
      return;
    }

    // Get user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      // Return empty array if profile not found (consistent format)
      res.status(200).json([]);
      return;
    }

    // Get CVs from cvs array
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const cvs = (profile.cvs || []).map((cv: any) => {
      const fileName = cv.fileName || 'CV';
      const fileSizeMB = cv.sizeKB ? (cv.sizeKB / 1024).toFixed(2) : '0';
      const downloadUrl = cv.url?.startsWith('http') ? cv.url : `${baseUrl}${cv.url}`;
      const format = fileName.split('.').pop()?.toUpperCase() || 'PDF';
      const uploadedDate = cv.uploadDate || new Date().toISOString();
      
      // Get the CV name, fallback to fileName
      const cvName = cv.name || fileName;
      // Get isPrimary from CV
      const isPrimary = cv.isPrimary || false;
      
      return {
        id: cv.id,
        name: cvName,
        fileName: fileName,
        uploadedDate: uploadedDate.includes('T') ? uploadedDate.split('T')[0] : uploadedDate,
        fileSize: `${fileSizeMB} MB`,
        isPrimary: isPrimary,
        format: format,
        downloadUrl: downloadUrl,
      };
    });

    res.status(200).json(cvs);
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({ success: false, data: [], message: 'Internal server error' });
  }
};

// Set primary CV
export const setPrimaryCV = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from JWT token (set by auth middleware)
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
      return;
    }

    const cvId = req.params.id;
    if (!cvId) {
      res.status(400).json({ success: false, data: null, message: 'CV ID is required' });
      return;
    }

    // Get user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      res.status(404).json({ success: false, data: null, message: 'Profile not found' });
      return;
    }

    // Update all CVs - set isPrimary based on matching ID
    if (profile.cvs && profile.cvs.length > 0) {
      profile.cvs = profile.cvs.map((cv: any) => ({
        ...cv,
        isPrimary: cv.id === cvId,
      }));

      // Mark as modified and save
      profile.markModified('cvs');
      await profile.save();
    }

    res.status(200).json({ success: true, message: 'Primary CV updated successfully' });
  } catch (error) {
    console.error('Set primary CV error:', error);
    res.status(500).json({ success: false, data: null, message: 'Internal server error' });
  }
};

// Get portfolio items

// Delete CV
export const deleteCV = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from JWT token (set by auth middleware)
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
      return;
    }

    const cvId = req.params.id;
    if (!cvId) {
      res.status(400).json({ success: false, data: null, message: 'CV ID is required' });
      return;
    }

    // Get user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      res.status(404).json({ success: false, data: null, message: 'Profile not found' });
      return;
    }

    // Find the CV in cvs array
    const cvIndex = profile.cvs?.findIndex(
      (cv: any) => cv.id === cvId
    );

    if (cvIndex === -1 || cvIndex === undefined) {
      res.status(404).json({ success: false, data: null, message: 'CV not found' });
      return;
    }

    // Get the CV file info for deletion
    const cvFile = profile.cvs[cvIndex];
    
    // Delete the physical file from server if it exists
    if (cvFile.url && !cvFile.url.startsWith('http')) {
      try {
        // Extract filename from URL (e.g., "/uploads/cv/filename.pdf" -> "filename.pdf")
        const urlParts = cvFile.url.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        // Construct path the same way upload middleware does
        const filePath = path.join(__dirname, '../uploads/cv', filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`CV file deleted: ${filePath}`);
        } else {
          console.warn(`CV file not found at: ${filePath}`);
        }
      } catch (fileError) {
        // Log but don't fail if file deletion fails
        console.error('Error deleting CV file:', fileError);
      }
    }

    // Remove CV from cvs array
    profile.cvs = profile.cvs.filter(
      (cv: any) => cv.id !== cvId
    );

    // Update cvUploaded flag if no CVs remain
    if (profile.cvs.length === 0) {
      profile.cvUploaded = false;
    }

    // Mark as modified and save
    profile.markModified('cvs');
    await profile.save();

    res.status(200).json({ success: true, message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({ success: false, data: null, message: 'Internal server error' });
  }
};

export const uploadCV = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, data: null, message: 'No file uploaded' });
      return;
    }

    // Find or create profile
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, data: null, message: 'User not found' });
        return;
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

    // Get CV name from request body
    const cvName = (req.body.name || req.file.originalname).trim();

    // Check if this is the first CV (no existing CVs)
    const existingCVs = profile.cvs || [];
    const isFirstCV = existingCVs.length === 0;

    // Create CV entry
    const fileSizeKB = Math.round(req.file.size / 1024);
    const cv = {
      id: `cv_${Date.now()}`,
      fileName: req.file.originalname,
      name: cvName, // Store the user-provided CV name
      uploadDate: new Date().toISOString(),
      url: `/uploads/cv/${req.file.filename}`,
      sizeKB: fileSizeKB,
      isPrimary: isFirstCV, // Set as primary if it's the first CV
    };

    // If this is the first CV, ensure no other CVs are marked as primary
    // (though there shouldn't be any, but just to be safe)
    if (isFirstCV && profile.cvs && profile.cvs.length > 0) {
      profile.cvs = profile.cvs.map((existingCv: any) => ({
        ...existingCv,
        isPrimary: false,
      }));
    }

    // Add to profile's cvs array
    if (!profile.cvs) {
      profile.cvs = [];
    }
    profile.cvs.push(cv);

    // Update cvUploaded flag
    profile.cvUploaded = true;

    // Save profile - use markModified to ensure array changes are saved
    profile.markModified('cvs');
    await profile.save();

    // Return CV data in format expected by frontend
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const downloadUrl = cv.url.startsWith('http') ? cv.url : `${baseUrl}${cv.url}`;

    res.status(200).json({
      success: true,
      data: {
        id: cv.id,
        name: cvName,
        fileName: cv.fileName,
        uploadedDate: cv.uploadDate.split('T')[0],
        fileSize: `${fileSizeKB} KB`,
        isPrimary: isFirstCV, // Return the actual isPrimary value
        format: path.extname(cv.fileName).toUpperCase().replace('.', '') || 'PDF',
        downloadUrl: downloadUrl,
      },
      message: 'CV uploaded successfully',
    });
  } catch (error: any) {
    console.error('CV upload error:', error);
    res.status(500).json({ success: false, data: null, message: error.message || 'Internal server error' });
  }
};
