"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.signup = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = void 0;
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Return user with id field (not _id)
        res.status(200).json({
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserById = getUserById;
// Create user (admin only, not for signup)
const createUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }
        const hashedPassword = await require('bcryptjs').hash(password, 10);
        const user = new User_1.default({ fullName, email, password: hashedPassword });
        await user.save();
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createUser = createUser;
// Update user
const updateUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const update = {};
        if (fullName)
            update.fullName = fullName;
        if (email)
            update.email = email;
        if (password)
            update.password = await require('bcryptjs').hash(password, 10);
        const user = await User_1.default.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteUser = deleteUser;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        // Validate input
        if (!fullName || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create new user
        const user = new User_1.default({
            fullName,
            email,
            password: hashedPassword,
        });
        await user.save();
        // Create profile record with fullName and email (other fields empty)
        const Profile = (await import('../models/Profile')).default;
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
            mediaFiles: [],
        });
        await profile.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '1d' });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.signup = signup;
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select('-password');
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUsers = getUsers;
