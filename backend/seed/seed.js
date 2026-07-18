// Run with: npm run seed
// Creates the default admin account (from .env) and the starter list of services.
// Safe to re-run - it skips anything that already exists.

require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const mongoose = require('mongoose');

const services = [
  {
    name: 'Office & Commercial Cleaning',
    slug: 'office-commercial-cleaning',
    shortDescription: 'Daily, weekly, or one-off cleaning for offices, shops, and commercial spaces.',
    fullDescription:
      'Keep your workplace presentable and hygienic with scheduled cleaning built around your business hours - desks, floors, restrooms, kitchens, and common areas.',
    icon: 'briefcase',
    order: 1,
  },
  {
    name: 'Residential Cleaning',
    slug: 'residential-cleaning',
    shortDescription: 'Regular home cleaning for apartments, duplexes, and family houses.',
    fullDescription:
      'Routine or one-time home cleaning covering living spaces, bedrooms, kitchens, and bathrooms - done carefully and on your schedule.',
    icon: 'home',
    order: 2,
  },
  {
    name: 'Deep Cleaning',
    slug: 'deep-cleaning',
    shortDescription: 'A thorough, top-to-bottom clean for spaces that need extra attention.',
    fullDescription:
      'Beyond surface cleaning - we get into the corners, behind appliances, grout lines, and high-touch areas that routine cleaning skips.',
    icon: 'sparkles',
    order: 3,
  },
  {
    name: 'Post-Construction Cleanup',
    slug: 'post-construction-cleanup',
    shortDescription: 'Dust, debris, and residue removal after renovation or building work.',
    fullDescription:
      'Make a newly built or renovated space move-in ready - removing construction dust, paint splatter, debris, and protective film from surfaces.',
    icon: 'hard-hat',
    order: 4,
  },
  {
    name: 'Fumigation & Pest Control',
    slug: 'fumigation-pest-control',
    shortDescription: 'Safe, effective treatment to keep your space pest-free.',
    fullDescription:
      'Professional fumigation services to eliminate and prevent common household and office pests, using methods safe for occupants and pets.',
    icon: 'shield',
    order: 5,
  },
];

const seed = async () => {
  await connectDB();

  try {
    // Seed admin
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
    if (!adminExists) {
      await Admin.create({
        name: process.env.ADMIN_NAME || 'ABI Harosfaid Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`Admin account created: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log('Admin account already exists - skipping.');
    }

    // Seed services
    for (const service of services) {
      const exists = await Service.findOne({ slug: service.slug });
      if (!exists) {
        await Service.create(service);
        console.log(`Service created: ${service.name}`);
      } else {
        console.log(`Service already exists - skipping: ${service.name}`);
      }
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
