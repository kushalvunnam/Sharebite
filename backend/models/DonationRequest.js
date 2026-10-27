import mongoose from 'mongoose';

const donationRequestSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: [true, 'Listing reference is required'],
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient reference is required'],
      index: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor reference is required'],
      index: true,
    },
    requestedQuantity: {
      type: Number,
      required: [true, 'Requested portion quantity is required'],
      min: [1, 'Requested quantity must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'cancelled', 'picked_up', 'completed'],
        message: '{VALUE} is not a valid request status',
      },
      default: 'pending',
      index: true,
    },
    pickupConfirmationDetails: {
      otpCode: {
        type: String,
        default: '',
      },
      verificationCode: {
        type: String,
        default: '',
      },
      confirmedAt: {
        type: Date,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: {
          type: String,
          default: '',
        },
      },
    ],
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

donationRequestSchema.index({ recipientId: 1, status: 1 });
donationRequestSchema.index({ donorId: 1, status: 1 });
donationRequestSchema.index({ listingId: 1, status: 1 });

const DonationRequest =
  mongoose.models.DonationRequest ||
  mongoose.model('DonationRequest', donationRequestSchema);

export default DonationRequest;
