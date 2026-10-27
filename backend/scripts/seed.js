import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import DonationRequest from '../models/DonationRequest.js';
import Report from '../models/Report.js';

dotenv.config();

/**
 * Initial Administrator Account (Single administrative seed with 0 metrics/history)
 */
const INITIAL_ADMIN = {
  name: 'David Vance',
  email: 'admin@sharebite.org',
  password: 'AdminPassword123!',
  role: 'admin',
  organizationName: 'ShareBite Platform & Safety Board',
  phone: '+1 (555) 000-1122',
  address: 'ShareBite HQ, Innovation Way, NY',
  profileDetails: {
    orgType: 'Platform Governance',
    safetyLicense: 'OVERSIGHT-2026',
    taxId: 'EIN-00-1234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  isVerified: true,
};

/**
 * Database Seed / Reset Script
 * Resets all collections to zero records and provisions only the initial system administrator.
 */
export const seedDatabase = async () => {
  try {
    console.log('[ShareBite DB] Connecting to database...');
    await connectDB();

    console.log('[ShareBite DB] Resetting collections to zero records...');
    await DonationRequest.deleteMany({});
    await FoodListing.deleteMany({});
    await Report.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } });

    // Verify or insert administrator account
    const existingAdmin = await User.findOne({ email: INITIAL_ADMIN.email });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(INITIAL_ADMIN.password, salt);

      await User.create({
        name: INITIAL_ADMIN.name,
        email: INITIAL_ADMIN.email.toLowerCase(),
        passwordHash,
        role: INITIAL_ADMIN.role,
        organizationName: INITIAL_ADMIN.organizationName,
        phone: INITIAL_ADMIN.phone,
        address: INITIAL_ADMIN.address,
        profileDetails: INITIAL_ADMIN.profileDetails,
        isVerified: INITIAL_ADMIN.isVerified,
      });

      console.log('  ✓ Initial system administrator account initialized: admin@sharebite.org');
    } else {
      console.log('  ✓ System administrator account present: admin@sharebite.org');
    }

    console.log('\n[ShareBite DB] All application data successfully reset to 0 / empty state! 🎉');
    console.log('--------------------------------------------------');
    console.log('System Administrator Default Credentials:');
    console.log('  • Email:    admin@sharebite.org');
    console.log('  • Password: AdminPassword123!');
    console.log('  • Food Listings: 0 records');
    console.log('  • Donation Requests: 0 records');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('[ShareBite DB] Error during database reset:', error);
  } finally {
    await disconnectDB();
  }
};

// Run if directly executed
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}

export default seedDatabase;
