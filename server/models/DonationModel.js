/**
 * ShareBite MongoDB Mongoose Schema for Surplus Food Donation
 * Connect to MongoDB Atlas by providing MONGO_URI in .env
 */

/* 
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide food title'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Prepared Meals', 'Bakery', 'Fresh Produce', 'Dairy & Eggs', 'Beverages', 'Packaged & Canned'],
  },
  donorId: {
    type: String,
    required: true,
  },
  donorName: {
    type: String,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
  },
  weightKg: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'in_transit', 'completed', 'expired'],
    default: 'available',
  },
  urgency: {
    type: String,
    enum: ['urgent', 'medium', 'flexible'],
    default: 'urgent',
  },
  storageType: {
    type: String,
    required: true,
  },
  temperatureLog: {
    type: String,
    required: true,
  },
  packaging: {
    type: String,
    required: true,
  },
  allergens: [String],
  dietaryTags: [String],
  pickupWindow: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude] for geospatial 5km radius queries
      default: [-73.9851, 40.7488],
    },
  },
  claimedBy: {
    type: String,
    default: null,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

donationSchema.index({ location: '2dsphere' });

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);
*/
