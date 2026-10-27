import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter reference is required'],
      index: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: [true, 'Reported listing reference is required'],
      index: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      enum: {
        values: [
          'safety_concern',
          'inaccurate_quantity',
          'inappropriate_content',
          'expired_food',
          'other',
        ],
        message: '{VALUE} is not a valid report reason',
      },
    },
    details: {
      type: String,
      required: [true, 'Please provide detailed context for the safety report'],
      trim: true,
      maxlength: [1000, 'Details cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'reviewed', 'dismissed', 'action_taken'],
        message: '{VALUE} is not a valid report status',
      },
      default: 'pending',
      index: true,
    },
    adminAction: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
