import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

let isConnected = false;
let memoryServerInstance = null;

const seedInitialAccounts = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminPassHash = await bcrypt.hash('AdminPassword123!', salt);

      const accountsToSeed = [
        {
          name: 'David Vance',
          email: 'david.safety@sharebite.org',
          passwordHash: adminPassHash,
          role: 'admin',
          organizationName: 'ShareBite Operations & Food Safety Board',
          phone: '+1 (555) 000-1122',
          address: 'ShareBite HQ, Innovation Way, NY',
          isVerified: true,
        },
        {
          name: 'System Administrator',
          email: 'admin@sharebite.org',
          passwordHash: adminPassHash,
          role: 'admin',
          organizationName: 'ShareBite Operations & Food Safety Board',
          phone: '+1 (555) 000-1122',
          address: 'ShareBite HQ, Innovation Way, NY',
          isVerified: true,
        },
      ];

      // In non-production environments only, provide demo profiles for testing
      if (process.env.NODE_ENV !== 'production') {
        const donorPassHash = await bcrypt.hash('DonorPassword123!', salt);
        const recipPassHash = await bcrypt.hash('ShelterPassword123!', salt);
        accountsToSeed.push(
          {
            name: 'Chef Marco Rossi',
            email: 'marco@verdeosteria.com',
            passwordHash: donorPassHash,
            role: 'donor',
            organizationName: 'Verde Artisan Osteria',
            phone: '+1 (555) 234-5678',
            address: '412 Mulberry St, Downtown',
            isVerified: true,
          },
          {
            name: 'Sarah Lin',
            email: 'sarah@eastsidehope.org',
            passwordHash: recipPassHash,
            role: 'recipient',
            organizationName: 'Eastside Hope Food Rescue & Shelter',
            phone: '+1 (555) 876-5432',
            address: '320 Oak Ridge Rd, East District',
            isVerified: true,
          }
        );
      }

      await User.insertMany(accountsToSeed);
      console.log(`[ShareBite DB] Essential initial accounts provisioned (${accountsToSeed.length} accounts).`);
    }
  } catch (err) {
    console.warn('[ShareBite DB] Initial accounts provisioning:', err.message);
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

  let mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    mongoUri = sanitizeMongoUri(mongoUri);
  }

  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      if (!memoryServerInstance) {
        memoryServerInstance = await MongoMemoryServer.create();
      }
      mongoUri = memoryServerInstance.getUri();
      console.log('[ShareBite DB] Local in-memory MongoDB online.');
    } catch (err) {
      console.warn('[ShareBite DB] Could not start in-memory Mongo server:', err.message);
      return null;
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[ShareBite DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    // Seed default accounts
    await seedInitialAccounts();

    return conn.connection;
  } catch (error) {
    console.error('[ShareBite DB] Primary connection error:', error.message);

    // If primary remote connection failed, fallback to in-memory MongoDB so production/preview remains functional
    if (!memoryServerInstance) {
      try {
        console.log('[ShareBite DB] Attempting fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const fallbackUri = memoryServerInstance.getUri();
        const fallbackConn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log('[ShareBite DB] Fallback in-memory MongoDB connected successfully.');
        await seedInitialAccounts();
        return fallbackConn.connection;
      } catch (fallbackErr) {
        console.error('[ShareBite DB] Fallback in-memory Mongo server failed:', fallbackErr.message);
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

export const getDBStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateIndex = mongoose.connection.readyState;
  return states[stateIndex] || 'unknown';
};

export default connectDB;
