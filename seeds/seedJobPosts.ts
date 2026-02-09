import mongoose from 'mongoose';
import JobPost from '../src/models/JobPost';
import Job from '../src/models/Job';
import User from '../src/models/User';

async function seedJobPosts() {
  await mongoose.connect('mongodb://localhost:27017/jobportal'); // Adjust connection string if needed

  // Find a job and a user to reference
  const job = await Job.findOne();
  const user = await User.findOne();
  if (!job || !user) {
    console.log('No job or user found. Please seed jobs and users first.');
    await mongoose.disconnect();
    return;
  }

  await JobPost.deleteMany({});
  await JobPost.insertMany([
    { job: job._id, postedBy: user._id },
    { job: job._id, postedBy: user._id }
  ]);
  console.log('Seeded job posts!');
  await mongoose.disconnect();
}

seedJobPosts();
