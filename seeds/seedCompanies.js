"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Company_1 = __importDefault(require("../src/models/Company"));
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
    await mongoose_1.default.connect('mongodb://localhost:27017/jobportal'); // Adjust connection string if needed
    await Company_1.default.deleteMany({});
    await Company_1.default.insertMany(companies);
    console.log('Seeded companies!');
    await mongoose_1.default.disconnect();
}
seedCompanies();
