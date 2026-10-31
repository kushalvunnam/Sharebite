import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

let isConnected = false;
let memoryServerInstance = null;

// Explicit initial accounts for all three primary roles (Donor, NGO/Recipient, Admin)
export const DEMO_ACCOUNTS = [
  {
    name: 'David Vance',
    email: 'david.safety@sharebite.org',
    plainPassword: 'AdminPassword123!',
    role: 'admin',
    organizationName: 'ShareBite Operations & Food Safety Board',
    phone: '+1 (555) 000-1122',
    address: 'ShareBite HQ, Innovation Way, NY',
    isVerified: true,
    profileDetails: {
      orgType: 'Platform Oversight',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    name: 'System Administrator',
    email: 'admin@sharebite.org',
    plainPassword: 'AdminPassword123!',
    role: 'admin',
    organizationName: 'ShareBite Operations & Food Safety Board',
    phone: '+1 (555) 000-1122',
    address: 'ShareBite HQ, Innovation Way, NY',
    isVerified: true,
    profileDetails: {
      orgType: 'Platform Oversight',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    name: 'Chef Marco Rossi',
    email: 'marco@verdeosteria.com',
    plainPassword: 'DonorPassword123!',
    role: 'donor',
    organizationName: 'Verde Artisan Osteria',
    phone: '+1 (555) 234-5678',
    address: '412 Mulberry St, Downtown',
    isVerified: true,
    profileDetails: {
      orgType: 'Restaurant & Trattoria',
      safetyLicense: 'FDA-Verified-2910-A',
      taxId: 'EIN-84-2910291',
      dailyCapacity: 250,
      hasRefrigeration: true,
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    name: 'Sarah Lin',
    email: 'sarah@eastsidehope.org',
    plainPassword: 'ShelterPassword123!',
    role: 'recipient',
    organizationName: 'Eastside Hope Food Rescue & Shelter',
    phone: '+1 (555) 876-5432',
    address: '320 Oak Ridge Rd, East District',
    isVerified: true,
    profileDetails: {
      orgType: 'Non-Profit / Food Bank',
      safetyLicense: '501c3-Verified',
      taxId: 'EIN-82-4910291',
      dailyCapacity: 350,
      hasRefrigeration: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  },
];

export const seedInitialAccounts = async () => {
  try {
    for (const acc of DEMO_ACCOUNTS) {
      const normalizedEmail = acc.email.toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(acc.plainPassword, salt);
        const { plainPassword, ...userData } = acc;
        await User.create({
          ...userData,
          email: normalizedEmail,
          passwordHash,
        });
        console.log(`[ShareBite DB] Provisioned essential account: ${normalizedEmail} (${acc.role})`);
      }
    }
  } catch (err) {
    console.warn('[ShareBite DB] Initial accounts provisioning warning:', err.message);
  }
};

// Disable command buffering so queries fail fast when disconnected rather than hanging
mongoose.set('bufferCommands', false);

export const sanitizeMongoUri = (rawUri) => {
  if (!rawUri || typeof rawUri !== 'string') return rawUri;
  const match = rawUri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/);
  if (!match) return rawUri;
  const [, protocol, username, password, rest] = match;
  let cleanPass;
  try {
    cleanPass = encodeURIComponent(decodeURIComponent(password));
  } catch {
    cleanPass = encodeURIComponent(password);
  }
  let cleanUser;
  try {
    cleanUser = encodeURIComponent(decodeURIComponent(username));
  } catch {
    cleanUser = encodeURIComponent(username);
  }
  return `${protocol}${cleanUser}:${cleanPass}@${rest}`;
};

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  let mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    mongoUri = sanitizeMongoUri(mongoUri);
  }

  // In production, strictly require persistent MONGODB_URI and never spin up MongoMemoryServer
  if (isProduction) {
    if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
      console.error(
        '[ShareBite DB] FATAL: Production environment requires a valid persistent MONGODB_URI. In-memory MongoMemoryServer fallback is disabled in production.'
      );
      isConnected = false;
      return null;
    }
  } else {
    // In development or test, allow in-memory MongoMemoryServer if URI is absent or placeholder
    if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!memoryServerInstance) {
          memoryServerInstance = await MongoMemoryServer.create();
        }
        mongoUri = memoryServerInstance.getUri();
        console.log('[ShareBite DB] Local in-memory MongoDB online for development/testing.');
      } catch (err) {
        console.warn('[ShareBite DB] Could not start in-memory Mongo server:', err.message);
        isConnected = false;
        return null;
      }
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[ShareBite DB] Persistent MongoDB Atlas connected: ${conn.connection.host}/${conn.connection.name}`);

    // Seed default accounts using find-before-create
    await seedInitialAccounts();

    return conn.connection;
  } catch (error) {
    console.error('[ShareBite DB] Persistent MongoDB connection error:', error.message);
    isConnected = false;

    // IN PRODUCTION: NEVER fall back to MongoMemoryServer
    if (isProduction) {
      console.error(
        '[ShareBite DB] FATAL: Failed to connect to persistent MongoDB Atlas in production. In-memory fallback is disabled in production to guarantee data persistence.'
      );
      return null;
    }

    // In development/test, fallback to in-memory MongoDB so developer can test offline
    if (!memoryServerInstance) {
      try {
        console.log('[ShareBite DB] Attempting dev-only fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const fallbackUri = memoryServerInstance.getUri();
        const fallbackConn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log('[ShareBite DB] Dev fallback in-memory MongoDB connected successfully.');
        await seedInitialAccounts();
        return fallbackConn.connection;
      } catch (fallbackErr) {
        console.error('[ShareBite DB] Dev fallback in-memory Mongo server failed:', fallbackErr.message);
      }
    }
    return null;
  }
};

export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
      memoryServerInstance = null;
    }
    console.log('[ShareBite DB] MongoDB disconnected');
  }
};

export const isMemoryFallback = () => {
  return Boolean(memoryServerInstance);
};

export const getDBStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateIndex = mongoose.connection.readyState;
  return states[stateIndex] || 'unknown';
};

export default connectDB;
