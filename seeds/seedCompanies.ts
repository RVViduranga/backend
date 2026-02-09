import mongoose from 'mongoose';
import Company from '../src/models/Company';

const companies = [
  {
    name: 'Demo Company',
    description: 'A demo company for seeding purposes.',
    location: '123 Demo St, City, Country',
    website: 'https://democompany.com'
  },
  {
    name: 'Tech Innovators',
    description: 'Leading tech solutions provider.',
    location: '456 Tech Ave, Silicon Valley, USA',
    website: 'https://techinnovators.com'
  },
  {
    name: 'Green Energy Corp',
    description: 'Renewable energy and sustainability.',
    location: '789 Green Rd, Berlin, Germany',
    website: 'https://greenenergy.com'
  }
];

async function seedCompanies() {
  await mongoose.connect('mongodb://localhost:27017/jobportal'); // Adjust connection string if needed
  await Company.deleteMany({});
  await Company.insertMany(companies);
  console.log('Seeded companies!');
  await mongoose.disconnect();
}

seedCompanies();
