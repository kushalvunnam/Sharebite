import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide password hash'],
      select: false, // Do not return passwordHash in standard queries
    },
    role: {
      type: String,
      enum: {
        values: ['donor', 'recipient', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      required: [true, 'User role is required'],
      default: 'donor',
      index: true,
    },
    organizationName: {
      type: String,
      trim: true,
      maxlength: [150, 'Organization name cannot exceed 150 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    profileDetails: {
      orgType: {
        type: String,
        trim: true,
        default: 'Food Establishment',
      },
      safetyLicense: {
        type: String,
        trim: true,
        default: '',
      },
      taxId: {
        type: String,
        trim: true,
        default: '',
      },
      dailyCapacity: {
        type: Number,
        min: 0,
        default: 0,
      },
      hasRefrigeration: {
        type: Boolean,
        default: false,
      },
      avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      urgentAlerts: { type: Boolean, default: true },
      soundAlerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      autoRefresh: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Transform to safely strip any sensitive fields on serialization
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
