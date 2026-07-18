// Run with: npm run seed:gallery
// Adds your uploaded photo URLs to the gallery in one go.
// Safe to re-run — it skips any URL that's already been added, so running it
// twice won't create duplicates.

require('dotenv').config();
const connectDB = require('../config/db');
const GalleryImage = require('../models/GalleryImage');
const mongoose = require('mongoose');

// Add a short caption/category for each photo below once you know what each one shows.
// Leaving them blank is fine for now — you can edit captions anytime from the
// admin dashboard (Gallery -> pencil icon) without needing to touch this file again.
const photos = [
  { imageUrl: 'https://i.imgur.com/yyAdFw5.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/EtUDTfU.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/SKLSZ1l.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/uUeKMZX.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/oPFtaZE.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/Oc0DDAs.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/k3LrGqw.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/yolyBIB.jpeg', caption: '', category: 'General' },
  { imageUrl: 'https://i.imgur.com/zlRwARH.jpeg', caption: '', category: 'General' },
];

const seedGallery = async () => {
  await connectDB();
  try {
    let added = 0;
    for (const photo of photos) {
      const exists = await GalleryImage.findOne({ imageUrl: photo.imageUrl });
      if (!exists) {
        await GalleryImage.create(photo);
        console.log(`Added: ${photo.imageUrl}`);
        added++;
      } else {
        console.log(`Already exists — skipping: ${photo.imageUrl}`);
      }
    }
    console.log(`\nDone. ${added} new photo(s) added.`);
  } catch (error) {
    console.error('Error adding gallery photos:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedGallery();