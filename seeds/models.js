// This file ensures Mongoose models are loaded for seeding (with TypeScript support)
require('ts-node').register();
const User = require('../src/models/User').default;
const Company = require('../src/models/Company').default;
const Job = require('../src/models/Job').default;
const JobPost = require('../src/models/JobPost').default;
const Application = require('../src/models/Application').default;
const MatchingData = require('../src/models/MatchingData').default;
const Notification = require('../src/models/Notification').default;
const Profile = require('../src/models/Profile').default;
const SavedJob = require('../src/models/SavedJob').default;
const Upload = require('../src/models/Upload').default;

module.exports = {
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
};