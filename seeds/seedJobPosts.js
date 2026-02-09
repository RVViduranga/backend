"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JobPost_1 = __importDefault(require("../src/models/JobPost"));
const Job_1 = __importDefault(require("../src/models/Job"));
const User_1 = __importDefault(require("../src/models/User"));
async function seedJobPosts() {
    await mongoose_1.default.connect('mongodb://localhost:27017/jobportal'); // Adjust connection string if needed
    // Find a job and a user to reference
    const job = await Job_1.default.findOne();
    const user = await User_1.default.findOne();
    if (!job || !user) {
        console.log('No job or user found. Please seed jobs and users first.');
        await mongoose_1.default.disconnect();
        return;
    }
    await JobPost_1.default.deleteMany({});
    await JobPost_1.default.insertMany([
        { job: job._id, postedBy: user._id },
        { job: job._id, postedBy: user._id }
    ]);
    console.log('Seeded job posts!');
    await mongoose_1.default.disconnect();
}
seedJobPosts();
