import Profile from '../models/Profile';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Configure multer for project file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/projectsAndSamples');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const uploadProjectFiles = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  },
});

// Create a new project (with files and/or link)
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const { title, description, category, platform, isFeatured, projectLink } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Project title is required' });
    }

    // Handle file uploads if any
    const files: any[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const fileType = file.mimetype.startsWith('image/') ? 'Project Image' : 'Project Document';
        const fileSizeKB = Math.round(file.size / 1024);
        const fileUrl = `/uploads/projectsAndSamples/${file.filename}`;
        const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
        const fullFileUrl = `${baseUrl}${fileUrl}`;

        files.push({
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.originalname,
          fileType,
          uploadDate: new Date().toISOString(),
          url: fullFileUrl,
          sizeKB: fileSizeKB,
        });
      }
    }

    // Validate that at least one file or link is provided
    const link = projectLink && projectLink.trim() ? projectLink.trim() : undefined;
    if (files.length === 0 && !link) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'At least one file or project link is required' 
      });
    }

    // Find or create user's profile
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

    // Create project object
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const project = {
      id: projectId,
      title: title.trim(),
      description: description || '',
      category: category || '',
      platform: platform || 'File Upload',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      projectLink: link,
      files: files,
      uploadedDate: new Date().toISOString(),
    };

    // Add project to profile's projects array
    if (!profile.projects) {
      profile.projects = [];
    }
    profile.projects.push(project);
    profile.markModified('projects');
    await profile.save();

    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      platform: project.platform,
      isFeatured: project.isFeatured,
      projectLink: project.projectLink,
      files: project.files.map((file: any) => ({
        id: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        uploadDate: file.uploadDate,
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        sizeKB: file.sizeKB,
      })),
      uploadedDate: project.uploadedDate,
    };

    res.status(201).json({
      success: true,
      data: transformedProject,
      message: 'Project created successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Get all projects for the authenticated user
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Projects fetched successfully',
      });
    }

    const projects = (profile.projects || []).sort((a: any, b: any) => 
      new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
    );

    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProjects = projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      description: project.description || '',
      category: project.category || '',
      platform: project.platform || 'File Upload',
      isFeatured: project.isFeatured || false,
      projectLink: project.projectLink || undefined,
      files: project.files.map((file: any) => ({
        id: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        uploadDate: file.uploadDate,
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        sizeKB: file.sizeKB,
      })),
      uploadedDate: project.uploadedDate,
    }));

    res.status(200).json({
      success: true,
      data: transformedProjects,
      message: 'Projects fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }

    const project = (profile.projects || []).find((p: any) => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      category: project.category || '',
      platform: project.platform || 'File Upload',
      isFeatured: project.isFeatured || false,
      projectLink: project.projectLink || undefined,
      files: project.files.map((file: any) => ({
        id: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        uploadDate: file.uploadDate,
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        sizeKB: file.sizeKB,
      })),
      uploadedDate: project.uploadedDate,
    };

    res.status(200).json({
      success: true,
      data: transformedProject,
      message: 'Project fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }

    const projectIndex = (profile.projects || []).findIndex((p: any) => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const project = profile.projects[projectIndex];

    // Update fields
    if (req.body.title !== undefined) project.title = req.body.title.trim();
    if (req.body.description !== undefined) project.description = req.body.description;
    if (req.body.category !== undefined) project.category = req.body.category;
    if (req.body.platform !== undefined) project.platform = req.body.platform;
    if (req.body.isFeatured !== undefined) project.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    if (req.body.projectLink !== undefined) project.projectLink = req.body.projectLink || undefined;

    profile.projects[projectIndex] = project;
    profile.markModified('projects');
    await profile.save();

    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      category: project.category || '',
      platform: project.platform || 'File Upload',
      isFeatured: project.isFeatured || false,
      projectLink: project.projectLink || undefined,
      files: project.files.map((file: any) => ({
        id: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        uploadDate: file.uploadDate,
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        sizeKB: file.sizeKB,
      })),
      uploadedDate: project.uploadedDate,
    };

    res.status(200).json({
      success: true,
      data: transformedProject,
      message: 'Project updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Add files to an existing project
export const addFilesToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }

    const projectIndex = (profile.projects || []).findIndex((p: any) => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const project = profile.projects[projectIndex];

    // Handle file uploads
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files as Express.Multer.File[]) {
        const fileType = file.mimetype.startsWith('image/') ? 'Project Image' : 'Project Document';
        const fileSizeKB = Math.round(file.size / 1024);
        const fileUrl = `/uploads/projectsAndSamples/${file.filename}`;
        const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
        const fullFileUrl = `${baseUrl}${fileUrl}`;

        project.files.push({
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.originalname,
          fileType,
          uploadDate: new Date().toISOString(),
          url: fullFileUrl,
          sizeKB: fileSizeKB,
        });
      }
      profile.projects[projectIndex] = project;
      profile.markModified('projects');
      await profile.save();
    }

    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      category: project.category || '',
      platform: project.platform || 'File Upload',
      isFeatured: project.isFeatured || false,
      projectLink: project.projectLink || undefined,
      files: project.files.map((file: any) => ({
        id: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        uploadDate: file.uploadDate,
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        sizeKB: file.sizeKB,
      })),
      uploadedDate: project.uploadedDate,
    };

    res.status(200).json({
      success: true,
      data: transformedProject,
      message: 'Files added to project successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }

    const projectIndex = (profile.projects || []).findIndex((p: any) => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const project = profile.projects[projectIndex];

    // Delete all physical files associated with this project
    if (project.files && project.files.length > 0) {
      for (const file of project.files) {
        if (file.url) {
          try {
            let filename: string;
            
            // Extract filename from URL (handle both full URLs and relative paths)
            if (file.url.startsWith('http://') || file.url.startsWith('https://')) {
              // Full URL: extract from path
              const urlObj = new URL(file.url);
              const pathParts = urlObj.pathname.split('/');
              filename = pathParts[pathParts.length - 1];
            } else if (file.url.startsWith('/uploads/projectsAndSamples/')) {
              // Relative URL with full path
              const urlParts = file.url.split('/');
              filename = urlParts[urlParts.length - 1];
            } else if (file.url.includes('/projectsAndSamples/')) {
              // URL contains the directory path
              const parts = file.url.split('/projectsAndSamples/');
              filename = parts[parts.length - 1].split('?')[0]; // Remove query params if any
            } else {
              // Just filename or relative path
              const urlParts = file.url.split('/');
              filename = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params if any
            }
            
            if (filename) {
              const filePath = path.join(__dirname, '../uploads/projectsAndSamples', filename);
              
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`✓ Project file deleted: ${filePath}`);
              } else {
                console.warn(`⚠ Project file not found at: ${filePath} (URL: ${file.url})`);
                // Try alternative path in case file was stored differently
                const altPath = path.join(__dirname, '../../uploads/projectsAndSamples', filename);
                if (fs.existsSync(altPath)) {
                  fs.unlinkSync(altPath);
                  console.log(`✓ Project file deleted from alternative path: ${altPath}`);
                }
              }
            } else {
              console.warn(`⚠ Could not extract filename from URL: ${file.url}`);
            }
          } catch (fileError: any) {
            console.error(`✗ Error deleting project file (URL: ${file.url}):`, fileError.message || fileError);
          }
        }
      }
    }

    // Remove project from profile's projects array
    profile.projects.splice(projectIndex, 1);
    profile.markModified('projects');
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Delete a specific file from a project
export const deleteFileFromProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }

    const { projectId, fileId } = req.params;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
    }

    const projectIndex = (profile.projects || []).findIndex((p: any) => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const project = profile.projects[projectIndex];
    const fileIndex = project.files.findIndex((file: any) => file.id === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ success: false, data: null, message: 'File not found in project' });
    }

    const file = project.files[fileIndex];

    // Delete the physical file
    if (file.url) {
      try {
        let filename: string;
        
        // Extract filename from URL (handle both full URLs and relative paths)
        if (file.url.startsWith('http://') || file.url.startsWith('https://')) {
          // Full URL: extract from path
          const urlObj = new URL(file.url);
          const pathParts = urlObj.pathname.split('/');
          filename = pathParts[pathParts.length - 1];
        } else if (file.url.startsWith('/uploads/projectsAndSamples/')) {
          // Relative URL with full path
          const urlParts = file.url.split('/');
          filename = urlParts[urlParts.length - 1];
        } else if (file.url.includes('/projectsAndSamples/')) {
          // URL contains the directory path
          const parts = file.url.split('/projectsAndSamples/');
          filename = parts[parts.length - 1].split('?')[0]; // Remove query params if any
        } else {
          // Just filename or relative path
          const urlParts = file.url.split('/');
          filename = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params if any
        }
        
        if (filename) {
          const filePath = path.join(__dirname, '../uploads/projectsAndSamples', filename);
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`✓ Project file deleted: ${filePath}`);
          } else {
            console.warn(`⚠ Project file not found at: ${filePath} (URL: ${file.url})`);
            // Try alternative path in case file was stored differently
            const altPath = path.join(__dirname, '../../uploads/projectsAndSamples', filename);
            if (fs.existsSync(altPath)) {
              fs.unlinkSync(altPath);
              console.log(`✓ Project file deleted from alternative path: ${altPath}`);
            }
          }
        } else {
          console.warn(`⚠ Could not extract filename from URL: ${file.url}`);
        }
      } catch (fileError: any) {
        console.error(`✗ Error deleting project file (URL: ${file.url}):`, fileError.message || fileError);
      }
    }

    // Remove file from project
    project.files.splice(fileIndex, 1);
    profile.projects[projectIndex] = project;
    profile.markModified('projects');
    await profile.save();

    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      category: project.category || '',
      platform: project.platform || 'File Upload',
      isFeatured: project.isFeatured || false,
      projectLink: project.projectLink || undefined,
      files: project.files.map((file: any) => ({
        id: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        uploadDate: file.uploadDate,
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        sizeKB: file.sizeKB,
      })),
      uploadedDate: project.uploadedDate,
    };

    res.status(200).json({
      success: true,
      data: transformedProject,
      message: 'File deleted from project successfully',
    });
  } catch (err) {
    next(err);
  }
};
