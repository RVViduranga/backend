
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '1d' }
    );
    res.status(200).json({
      message: 'Signin successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Alias for compatibility with routes/auth.ts
export { signup as register } from './userController';
export { signin as login } from './authController';



export const logout = async (req: Request, res: Response): Promise<void> => {
  // For JWT, logout is handled client-side (token removal). Optionally, implement token blacklist here.
  res.status(200).json({ message: 'Logged out successfully' });
};


// Example: expects { refreshToken }
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token required' });
    return;
  }
  try {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret');
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }
    const newToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '1d' }
    );
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};


// Example: expects { tokenId } from Google client
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  // You would verify the Google token here using google-auth-library or similar
  // For now, just return not implemented
  res.status(501).json({ message: 'Google OAuth not implemented' });
};


// Example: expects { email }
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  // Here you would generate a reset token and send an email
  // For now, just return success
  res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
};


// Example: expects { token, newPassword }
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    res.status(400).json({ message: 'Token and new password are required' });
    return;
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_RESET_SECRET || 'default_reset_secret');
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


// Example: expects { currentPassword, newPassword }, user must be authenticated
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId; // You should have auth middleware to set req.user
  const { currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) {
    res.status(400).json({ message: 'Current and new password required' });
    return;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
