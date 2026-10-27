import mongoose from 'mongoose';

const foodListingSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide listing title'],
      trim: true,
      maxlength: [140, 'Title cannot exceed 140 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the food item'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a food category'],
      enum: {
        values: [
          'Prepared Meals',
          'Bakery',
          'Fresh Produce',
          'Dairy & Eggs',
          'Beverages',
          'Packaged & Canned',
        ],
        message: '{VALUE} is not a valid food category',
      },
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      default: 'servings',
      trim: true,
    },
    weightKg: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: 0,
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Reserved quantity cannot be negative'],
    },
    preparationTime: {
      type: Date,
      default: Date.now,
    },
    listedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    pickupStart: {
      type: Date,
      required: [true, 'Pickup start time is required'],
    },
    pickupEnd: {
      type: Date,
      required: [true, 'Pickup end time is required'],
      validate: {
        validator: function (value) {
          return !this.pickupStart || value > this.pickupStart;
        },
        message: 'Pickup end time must be after pickup start time',
      },
    },
    handlingInstructions: {
      type: String,
      required: [true, 'Safe handling instructions are required'],
      trim: true,
    },
    expiryGuidance: {
      type: String,
      required: [true, 'Safe consumption window guidance is required'],
      trim: true,
    },
    allergens: {
      type: [String],
      default: ['None'],
    },
    dietaryTags: {
      type: [String],
      default: [],
    },
    storageType: {
      type: String,
      enum: {
        values: [
          'Hot Holding (> 140°F / 60°C)',
          'Refrigerated Chilled (< 40°F / 4°C)',
          'Ambient Room Temp (Breads & Packaged)',
          'Deep Frozen (< 0°F / -18°C)',
        ],
        message: '{VALUE} is not a valid storage condition',
      },
      default: 'Ambient Room Temp (Breads & Packaged)',
    },
    temperatureLog: {
      type: String,
      trim: true,
      default: 'Logged at ambient room temperature',
    },
    packaging: {
      type: String,
      trim: true,
      default: 'Sanitized food-grade sealed containers',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    },
    status: {
      type: String,
      enum: {
        values: [
          'available',
          'partially_reserved',
          'fully_reserved',
          'completed',
          'cancelled',
          'expired',
        ],
        message: '{VALUE} is not a valid listing status',
      },
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available unreserved portions
foodListingSchema.virtual('availableQuantity').get(function () {
  const avail = this.quantity - this.reservedQuantity;
  return avail > 0 ? avail : 0;
});

// Compound indexes for searching and sorting
foodListingSchema.index({ status: 1, pickupEnd: 1 });
foodListingSchema.index({ category: 1, status: 1 });
foodListingSchema.index({ donorId: 1, createdAt: -1 });

const FoodListing =
  mongoose.models.FoodListing || mongoose.model('FoodListing', foodListingSchema);

export default FoodListing;
