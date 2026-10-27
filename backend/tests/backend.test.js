import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_super_secret_key_for_unit_tests_2026';

// Import express app after env is configured
import app from '../server.js';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import DonationRequest from '../models/DonationRequest.js';

let mongod;

before(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
});

describe('ShareBite Backend API Test Suite', () => {
  let donorToken;
  let donorUser;
  let recipientToken;
  let recipientUser;
  let createdListingId;

  // 1. Health Check
  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'healthy');
      assert.strictEqual(res.body.service, 'ShareBite REST API');
      assert.ok(res.body.timestamp);
    });
  });

  // 2. Authentication & Role Security
  describe('Authentication API (/api/auth)', () => {
    it('should reject registration with admin role (security guard)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Hacker Admin',
        email: 'hacker@example.com',
        password: 'Password123!',
        role: 'admin',
      });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /Admin/);
    });

    it('should reject registration with invalid email or short password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Short Pass',
        email: 'invalid-email',
        password: '123',
        role: 'donor',
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('should register a new donor successfully and return JWT (no passwordHash)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Chef Marco Rossi',
        email: 'MARCO@VerdeOsteria.COM', // Test case normalization
        password: 'DonorPassword123!',
        role: 'donor',
        organizationName: 'Verde Artisan Osteria',
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.email, 'marco@verdeosteria.com');
      assert.strictEqual(res.body.user.role, 'donor');
      assert.strictEqual(res.body.user.passwordHash, undefined); // Never return password hash

      donorToken = res.body.token;
      donorUser = res.body.user;
    });

    it('should reject duplicate email registration with 409 Conflict', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Duplicate Marco',
        email: 'marco@verdeosteria.com',
        password: 'AnotherPassword123!',
        role: 'donor',
      });

      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
    });

    it('should register a recipient organization successfully', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Sarah Lin',
        email: 'sarah@eastsidehope.org',
        password: 'RecipientPassword123!',
        role: 'recipient',
        organizationName: 'Eastside Hope Food Rescue & Shelter',
      });

      assert.strictEqual(res.status, 201);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.role, 'recipient');

      recipientToken = res.body.token;
      recipientUser = res.body.user;
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'marco@verdeosteria.com',
        password: 'WrongPassword!',
      });

      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
    });

    it('should login successfully with valid credentials and return JWT', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'marco@verdeosteria.com',
        password: 'DonorPassword123!',
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.passwordHash, undefined);
    });

    it('should reject GET /api/auth/me without authorization token', async () => {
      const res = await request(app).get('/api/auth/me');
      assert.strictEqual(res.status, 401);
    });

    it('should return authenticated user profile for GET /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${donorToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.user.email, 'marco@verdeosteria.com');
      assert.strictEqual(res.body.user.role, 'donor');
    });
  });

  // User Profile & Settings API (/api/users)
  describe('User Profile & Settings API (/api/users)', () => {
    it('should reject GET /api/users/me without token', async () => {
      const res = await request(app).get('/api/users/me');
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
    });

    it('should return authenticated user profile on GET /api/users/me', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${donorToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.email, 'marco@verdeosteria.com');
      assert.strictEqual(res.body.user.role, 'donor');
      assert.strictEqual(res.body.user.passwordHash, undefined);
    });

    it('should reject PATCH /api/users/me with empty name', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ name: '   ' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /empty/i);
    });

    it('should reject PATCH /api/users/me with name shorter than 2 characters', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ name: 'A' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /short/i);
    });

    it('should reject PATCH /api/users/me when attempting to tamper with role, email, or password', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ role: 'admin', name: 'Marco Hacker' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /Security Notice/i);

      // Verify donor role remained unchanged
      const checkRes = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${donorToken}`);
      assert.strictEqual(checkRes.body.user.role, 'donor');
    });

    it('should update user name and preferences successfully on PATCH /api/users/me', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          name: 'Executive Chef Marco Rossi',
          preferences: {
            urgentAlerts: false,
            soundAlerts: true,
          },
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.name, 'Executive Chef Marco Rossi');
      assert.strictEqual(res.body.user.preferences.urgentAlerts, false);
      assert.strictEqual(res.body.user.preferences.soundAlerts, true);
      assert.strictEqual(res.body.user.passwordHash, undefined);

      // Verify recipient user was not affected
      const recipCheck = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${recipientToken}`);
      assert.strictEqual(recipCheck.body.user.name, 'Sarah Lin');
    });
  });

  // 3. Food Listings API
  describe('Food Listing API (/api/listings)', () => {
    it('should reject listing creation from recipient role (role check)', async () => {
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${recipientToken}`)
        .send({
          title: 'Not Allowed',
          category: 'Prepared Meals',
          quantity: 20,
        });

      assert.strictEqual(res.status, 403);
    });

    it('should reject listing with invalid quantity or missing handling instructions', async () => {
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          title: 'Invalid Pasta',
          category: 'Prepared Meals',
          quantity: 0, // Must be > 0
          pickupAddress: '123 Mulberry St',
          pickupStart: new Date(Date.now() + 3600000).toISOString(),
          pickupEnd: new Date(Date.now() + 7200000).toISOString(),
        });

      assert.strictEqual(res.status, 400);
    });

    it('should reject listing where pickupEnd occurs before pickupStart', async () => {
      const now = Date.now();
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          title: 'Reversed Dates Batch',
          category: 'Prepared Meals',
          quantity: 25,
          pickupAddress: '123 Mulberry St',
          pickupStart: new Date(now + 7200000).toISOString(),
          pickupEnd: new Date(now + 3600000).toISOString(), // earlier than start!
          handlingInstructions: 'Hot holding',
        });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.message, /pickupEnd/);
    });

    it('should create a food listing successfully when donor provides valid data', async () => {
      const now = Date.now();
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          title: 'San Marzano Penne al Forno',
          description: 'Fresh surplus banquet pans of roasted vegetable pasta.',
          category: 'Prepared Meals',
          quantity: 50,
          unit: 'portions',
          weightKg: 20,
          pickupAddress: '412 Mulberry St, Downtown',
          pickupStart: new Date(now + 3600000).toISOString(),
          pickupEnd: new Date(now + 14400000).toISOString(),
          handlingInstructions: 'Keep hot held above 140°F.',
          expiryGuidance: 'Refrigerate within 2 hours or consume hot.',
          allergens: ['Gluten', 'Dairy'],
          dietaryTags: ['Vegetarian'],
          storageType: 'Hot Holding (> 140°F / 60°C)',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.quantity, 50);
      assert.strictEqual(res.body.data.reservedQuantity, 0);
      assert.strictEqual(res.body.data.status, 'available');

      createdListingId = res.body.data._id;
    });

    it('should list available listings with category and search filter', async () => {
      const res = await request(app).get('/api/listings?category=Prepared+Meals&search=Penne');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.count >= 1);
      assert.strictEqual(res.body.data[0].title, 'San Marzano Penne al Forno');
    });

    it('should prevent non-owners from editing the listing', async () => {
      const res = await request(app)
        .patch(`/api/listings/${createdListingId}`)
        .set('Authorization', `Bearer ${recipientToken}`)
        .send({
          title: 'Malicious Change',
        });

      assert.strictEqual(res.status, 403);
    });
  });

  // 4. Donation Requests & Atomic Quantity Limits
  describe('Donation Request API (/api/requests)', () => {
    let activeRequestId;

    it('should prevent a donor from requesting their own food', async () => {
      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          listingId: createdListingId,
          requestedQuantity: 10,
        });

      // Role check: donor is not allowed to make requests (only recipients/admins)
      assert.strictEqual(res.status, 403);
    });

    it('should reject requests exceeding available portions (atomic limit guard)', async () => {
      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${recipientToken}`)
        .send({
          listingId: createdListingId,
          requestedQuantity: 9999, // Way more than the 50 available!
        });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.message, /exceed/);
    });

    it('should atomically reserve portions and generate OTP + verification code', async () => {
      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${recipientToken}`)
        .send({
          listingId: createdListingId,
          requestedQuantity: 20,
          notes: 'Eastside Hope volunteer van arriving at 6 PM',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.requestedQuantity, 20);
      assert.strictEqual(res.body.data.status, 'pending');
      assert.ok(res.body.data.pickupConfirmationDetails.otpCode);
      assert.ok(res.body.data.pickupConfirmationDetails.verificationCode);

      activeRequestId = res.body.data._id;

      // Verify listing reservedQuantity updated atomically in DB
      const listingInDb = await FoodListing.findById(createdListingId);
      assert.strictEqual(listingInDb.reservedQuantity, 20);
      assert.strictEqual(listingInDb.status, 'partially_reserved');
    });

    it('should allow donor to accept the pending request', async () => {
      const res = await request(app)
        .patch(`/api/requests/${activeRequestId}/accept`)
        .set('Authorization', `Bearer ${donorToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'accepted');
      assert.strictEqual(res.body.data.statusHistory.length, 2);
    });

    it('should allow volunteer to mark request as picked up', async () => {
      const res = await request(app)
        .patch(`/api/requests/${activeRequestId}/pickup`)
        .set('Authorization', `Bearer ${recipientToken}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'picked_up');
    });

    it('should reject completion if invalid OTP code is entered', async () => {
      const res = await request(app)
        .patch(`/api/requests/${activeRequestId}/complete`)
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          enteredOtp: '000000', // incorrect
        });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.message, /Invalid OTP/);
    });

    it('should complete handoff when donor enters the correct OTP code', async () => {
      // Fetch request to get actual OTP code
      const reqInDb = await DonationRequest.findById(activeRequestId);
      const correctOtp = reqInDb.pickupConfirmationDetails.otpCode;

      const res = await request(app)
        .patch(`/api/requests/${activeRequestId}/complete`)
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          enteredOtp: correctOtp,
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'completed');
      assert.ok(res.body.data.pickupConfirmationDetails.confirmedAt);
    });

    it('should release reserved quantity when a request is rejected or cancelled', async () => {
      // Create a second request for 15 portions
      const createRes = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${recipientToken}`)
        .send({
          listingId: createdListingId,
          requestedQuantity: 15,
        });

      assert.strictEqual(createRes.status, 201);
      const reqId = createRes.body.data._id;

      let listingInDb = await FoodListing.findById(createdListingId);
      assert.strictEqual(listingInDb.reservedQuantity, 35); // 20 previous + 15

      // Donor rejects this request
      const rejectRes = await request(app)
        .patch(`/api/requests/${reqId}/reject`)
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          reason: 'Kitchen closing early due to maintenance',
        });

      assert.strictEqual(rejectRes.status, 200);
      assert.strictEqual(rejectRes.body.data.status, 'rejected');

      // Check that the 15 portions were released back
      listingInDb = await FoodListing.findById(createdListingId);
      assert.strictEqual(listingInDb.reservedQuantity, 20); // Released 15 back!
    });
  });
});
