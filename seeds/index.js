// Main seed runner for MongoDB using Mongoose
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// Import all Mongoose models from a single models.js file
const {
  User,
  Company,
  Job,
  JobPost,
  Application,
  MatchingData,
  Notification,
  Profile,
  SavedJob,
  Upload
} = require('./models');

// Import seed data
const superadmin = require('./data/superadmin');
const companyData = require('./data/company');
const employer = require('./data/employer');
const applicants = require('./data/applicants');
const jobs = require('./data/jobs');
const jobposts = require('./data/jobposts');
const applications = require('./data/applications');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear collections
    // Drop Application collection to remove any old records with nulls or duplicates
    if (mongoose.connection.collections['applications']) {
      await mongoose.connection.collections['applications'].drop().catch(() => {});
    }
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      JobPost.deleteMany({}),
      Application.deleteMany({})
    ]);

    // Seed company
    const company = await Company.create(companyData);

    // Helper to split name into firstName and lastName
    function splitName(name) {
      if (!name) return { firstName: '', lastName: '' };
      const parts = name.split(' ');
      return {
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || ''
      };
    }

    // Seed superadmin
    await User.create({
      ...superadmin,
      ...splitName(superadmin.name),
      name: undefined // Remove name field
    });

    // Seed employer (link to company)
    await User.create({
      ...employer,
      ...splitName(employer.name),
      company: company._id,
      name: undefined
    });

    // Seed applicants
    await User.insertMany(applicants.map(app => ({
      ...app,
      ...splitName(app.name),
      name: undefined
    })));

    // Find employer user (for job seeding)
    const employerUser = await User.findOne({ email: employer.email });
    // Seed jobs (link to employer)
    const jobsWithEmployer = jobs.map(j => ({ ...j, employer: employerUser._id }));

    // Insert jobs and get their IDs
    const insertedJobs = await Job.insertMany(jobsWithEmployer);


    // Seed JobPosts (link to jobs and employer)
    const jobPostsToInsert = insertedJobs.map(job => ({
      job: job._id,
      postedBy: employerUser._id
    }));
    await JobPost.insertMany(jobPostsToInsert);

    // Seed Applications (link to jobs and applicants)
    const applicantUsers = await User.find({ role: 'jobseeker' });
    if (insertedJobs.length > 0 && applicantUsers.length > 0) {
      // Generate unique (job, applicant) pairs for applications
      const applicationsToInsert = [];
      let appIdx = 0;
      for (let job of insertedJobs) {
        for (let applicant of applicantUsers) {
          if (appIdx >= applications.length) break;
          if (job && applicant && job._id && applicant._id) {
            applicationsToInsert.push({
              ...applications[appIdx],
              job: job._id,
              applicant: applicant._id
            });
            appIdx++;
          }
        }
      }
      if (applicationsToInsert.length > 0) {
        await Application.insertMany(applicationsToInsert);
      }
    } else {
      console.warn('Skipping Application seeding: No jobs or applicants found.');
    }

    // --- Additional Model Seeding ---
    // MatchingData: link first applicant and first job
    const matchingDataSeed = require('./data/matchingData');
    if (applicantUsers.length > 0 && insertedJobs.length > 0) {
      const matchingDataToInsert = matchingDataSeed.map(md => ({
        ...md,
        user: applicantUsers[0]._id,
        job: insertedJobs[0]._id
      }));
      await MatchingData.insertMany(matchingDataToInsert);
    }

    // Notifications: link to first applicant
    const notificationsSeed = require('./data/notifications');
    if (applicantUsers.length > 0) {
      const notificationsToInsert = notificationsSeed.map(n => ({
        ...n,
        user: applicantUsers[0]._id
      }));
      await Notification.insertMany(notificationsToInsert);
    }

    // Profiles: link to first applicant
    const profilesSeed = require('./data/profiles');
    if (applicantUsers.length > 0) {
      const profilesToInsert = profilesSeed.map(p => ({
        ...p,
        user: applicantUsers[0]._id
      }));
      await Profile.insertMany(profilesToInsert);
    }

    // SavedJobs: link first applicant and first job
    const savedJobsSeed = require('./data/savedJobs');
    if (applicantUsers.length > 0 && insertedJobs.length > 0) {
      const savedJobsToInsert = savedJobsSeed.map(sj => ({
        ...sj,
        user: applicantUsers[0]._id,
        job: insertedJobs[0]._id
      }));
      await SavedJob.insertMany(savedJobsToInsert);
    }

    // Uploads: link to first applicant
    const uploadsSeed = require('./data/uploads');
    if (applicantUsers.length > 0) {
      const uploadsToInsert = uploadsSeed.map(u => ({
        ...u,
        user: applicantUsers[0]._id
      }));
      await Upload.insertMany(uploadsToInsert);
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
