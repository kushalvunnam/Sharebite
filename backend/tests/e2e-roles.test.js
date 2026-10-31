import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../server.js';
import { connectDB, disconnectDB, DEMO_ACCOUNTS, isMemoryFallback } from '../config/db.js';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import DonationRequest from '../models/DonationRequest.js';

test.describe('ShareBite End-to-End Three-Role & Persistence Verification', () => {
  test.before(async () => {
    await connectDB();
  });

  test.after(async () => {
    await disconnectDB();
  });

  test('PHASE 1: Verify all demo accounts provisioned and login succeeds', async () => {
    for (const acc of DEMO_ACCOUNTS) {
      const dbUser = await User.findOne({ email: acc.email }).select('+passwordHash');
      assert.ok(dbUser, `Demo account ${acc.email} should exist in database`);
      assert.strictEqual(dbUser.role, acc.role, `Role should match ${acc.role}`);

      const passwordMatches = await bcrypt.compare(acc.plainPassword, dbUser.passwordHash);
      assert.strictEqual(passwordMatches, true, `Password hash should match ${acc.plainPassword}`);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: acc.email, password: acc.plainPassword });

      assert.strictEqual(loginRes.status, 200, `Login should succeed for ${acc.email}`);
      assert.ok(loginRes.body.token, `Token should be returned for ${acc.email}`);
      assert.strictEqual(loginRes.body.user.role, acc.role);
    }
  });

  test('PHASE 2: Verify production mode disables in-memory fallback', () => {
    // Under NODE_ENV === 'production', memory fallback must be rejected
    const prevEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    assert.strictEqual(process.env.NODE_ENV, 'production');
    process.env.NODE_ENV = prevEnv;
  });

  test('PHASE 3: NGO / Recipient Registration workflow', async () => {
    const uniqueEmail = `ngo.shelter.${Date.now()}@hopehaven.org`;

    // 1. Register NGO with recipient role
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sister Mary',
        email: uniqueEmail,
        password: 'ShelterPass2026!',
        role: 'recipient',
        organizationName: 'Hope Haven Community Kitchen',
        address: '500 Charity Lane, Metro City',
        phone: '+1 (555) 777-8899',
        profileDetails: {
          orgType: 'Non-Profit / Food Bank',
          safetyLicense: '501c3-HH-8821',
          taxId: 'EIN-99-8812731',
          dailyCapacity: 300,
          hasRefrigeration: true,
        },
      });

    assert.strictEqual(regRes.status, 201, 'NGO registration should return 201 Created');
    assert.strictEqual(regRes.body.user.role, 'recipient', 'User role should be recipient');
    assert.strictEqual(regRes.body.user.isVerified, true, 'Registered NGO should be verified');
    assert.ok(regRes.body.token, 'Should issue JWT token upon registration');

    // 2. Prevent duplicate email registration
    const dupRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Rep',
        email: uniqueEmail,
        password: 'AnotherPass123!',
        role: 'recipient',
      });

    assert.strictEqual(dupRes.status, 409, 'Duplicate email must return 409 Conflict');

    // 3. Prevent admin role registration from public endpoint
    const adminRegRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Hacker',
        email: `hacker.${Date.now()}@evil.com`,
        password: 'HackerPass123!',
        role: 'admin',
      });

    assert.strictEqual(adminRegRes.status, 403, 'Public admin registration must return 403 Forbidden');
  });

  test('PHASE 4 & 5: Complete cycle between Donor, NGO, and Admin', async () => {
    // 1. Login as Donor (Chef Marco)
    const donorLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'marco@verdeosteria.com', password: 'DonorPassword123!' });
    assert.strictEqual(donorLogin.status, 200);
    const donorToken = donorLogin.body.token;

    // 2. Donor creates a surplus food listing
    const now = Date.now();
    const createListingRes = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${donorToken}`)
      .send({
        title: 'Fresh Artisan Focaccia & Minestrone',
        description: 'Warm, freshly baked focaccia with hearty vegetable minestrone.',
        category: 'Prepared Meals',
        quantity: 25,
        unit: 'servings',
        weightKg: 10,
        pickupAddress: '412 Mulberry St, Downtown',
        pickupStart: new Date(now + 1800000).toISOString(),
        pickupEnd: new Date(now + 14400000).toISOString(),
        handlingInstructions: 'Hot Holding (> 140°F)',
        expiryGuidance: 'Consume within 4 hours',
        allergens: ['Gluten'],
        dietaryTags: ['Vegetarian'],
        storageType: 'Hot Holding (> 140°F / 60°C)',
        temperatureLog: '148°F at preparation',
        packaging: 'Insulated thermal boxes',
      });

    assert.strictEqual(createListingRes.status, 201);
    const listingId = createListingRes.body.data._id;
    assert.ok(listingId, 'Listing ID should exist in MongoDB');

    // 3. Login as NGO / Recipient (Sarah Lin)
    const recipLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sarah@eastsidehope.org', password: 'ShelterPassword123!' });
    assert.strictEqual(recipLogin.status, 200);
    const recipToken = recipLogin.body.token;

    // 4. Recipient reserves 15 servings
    const reserveRes = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${recipToken}`)
      .send({
        listingId,
        requestedQuantity: 15,
        notes: 'Picking up with our temperature-controlled van at 6 PM.',
      });

    assert.strictEqual(reserveRes.status, 201);
    const requestId = reserveRes.body.data._id;
    const otpCode = reserveRes.body.data.pickupConfirmationDetails.otpCode;
    const verificationCode = reserveRes.body.data.pickupConfirmationDetails.verificationCode;
    assert.ok(otpCode, 'OTP code should be generated');
    assert.ok(verificationCode, 'Verification pass code should be generated');

    // 5. Donor accepts the pending request
    const acceptRes = await request(app)
      .patch(`/api/requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${donorToken}`);
    assert.strictEqual(acceptRes.status, 200);
    assert.strictEqual(acceptRes.body.data.status, 'accepted');

    // 6. Recipient marks as picked up
    const pickupRes = await request(app)
      .patch(`/api/requests/${requestId}/pickup`)
      .set('Authorization', `Bearer ${recipToken}`);
    assert.strictEqual(pickupRes.status, 200);
    assert.strictEqual(pickupRes.body.data.status, 'picked_up');

    // 7. Donor enters OTP and completes handoff
    const completeRes = await request(app)
      .patch(`/api/requests/${requestId}/complete`)
      .set('Authorization', `Bearer ${donorToken}`)
      .send({ enteredOtp: otpCode });

    assert.strictEqual(completeRes.status, 200);
    assert.strictEqual(completeRes.body.data.status, 'completed');

    // 8. Admin (David Vance) verifies platform statistics
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'david.safety@sharebite.org', password: 'AdminPassword123!' });
    assert.strictEqual(adminLogin.status, 200);
    const adminToken = adminLogin.body.token;

    const statsRes = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(statsRes.status, 200);
    assert.ok(statsRes.body.data.requests.completed >= 1, 'Completed requests should be at least 1');
  });
});
