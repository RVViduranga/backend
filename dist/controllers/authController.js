"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.googleAuth = exports.refreshToken = exports.logout = exports.login = exports.register = exports.signin = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '1d' });
        res.status(200).json({
            message: 'Signin successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.signin = signin;
// Alias for compatibility with routes/auth.ts
var userController_1 = require("./userController");
Object.defineProperty(exports, "register", { enumerable: true, get: function () { return userController_1.signup; } });
var authController_1 = require("./authController");
Object.defineProperty(exports, "login", { enumerable: true, get: function () { return authController_1.signin; } });
const logout = async (req, res) => {
    // For JWT, logout is handled client-side (token removal). Optionally, implement token blacklist here.
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
// Example: expects { refreshToken }
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret');
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }
        const newToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '1d' });
        res.status(200).json({ token: newToken });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};
exports.refreshToken = refreshToken;
// Example: expects { tokenId } from Google client
const googleAuth = async (req, res) => {
    // You would verify the Google token here using google-auth-library or similar
    // For now, just return not implemented
    res.status(501).json({ message: 'Google OAuth not implemented' });
};
exports.googleAuth = googleAuth;
// Example: expects { email }
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    // Here you would generate a reset token and send an email
    // For now, just return success
    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
};
exports.forgotPassword = forgotPassword;
// Example: expects { token, newPassword }
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        res.status(400).json({ message: 'Token and new password are required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET_SECRET || 'default_reset_secret');
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
exports.resetPassword = resetPassword;
// Example: expects { currentPassword, newPassword }, user must be authenticated
const changePassword = async (req, res) => {
    const userId = req.user?.userId; // You should have auth middleware to set req.user
    const { currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
        res.status(400).json({ message: 'Current and new password required' });
        return;
    }
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.changePassword = changePassword;
