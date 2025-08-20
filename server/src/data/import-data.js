const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const Review = require('../models/reviewModel');
const Listing = require("../models/listingModel");


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/mock-review.json`, 'utf-8')
);
const listings = JSON.parse(
  fs.readFileSync(`${__dirname}/mock-listing.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Review.create(reviews);
    await Listing.create(listings);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Review.deleteMany();
    await Listing.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
