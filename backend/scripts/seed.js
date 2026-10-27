import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import DonationRequest from '../models/DonationRequest.js';

dotenv.config();

const SEED_USERS = [
  // Admin
  {
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
  },
  // Donors
  {
    name: 'Chef Marco Rossi',
    email: 'marco@verdeosteria.com',
    password: 'DonorPassword123!',
    role: 'donor',
    organizationName: 'Verde Artisan Osteria',
    phone: '+1 (555) 234-8901',
    address: '412 Mulberry St, Downtown (Back alley kitchen dock)',
    profileDetails: {
      orgType: 'Restaurant & Trattoria',
      safetyLicense: 'FDA-NYC #8841-A',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80',
    },
    isVerified: true,
  },
  {
    name: 'Claire Laurent',
    email: 'claire@goldenharvest.com',
    password: 'DonorPassword123!',
    role: 'donor',
    organizationName: 'Golden Harvest Boulangerie',
    phone: '+1 (555) 891-3420',
    address: '88 Pinecrest Ave, Westside',
    profileDetails: {
      orgType: 'Artisan Bakery',
      safetyLicense: 'BAKERY-CERT #4490',
      avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80',
    },
    isVerified: true,
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@terraorganics.com',
    password: 'DonorPassword123!',
    role: 'donor',
    organizationName: 'Terra Organics Grocer',
    phone: '+1 (555) 432-9081',
    address: '1050 Grand Blvd, Midtown (Receiving Bay 2)',
    profileDetails: {
      orgType: 'Supermarket & Grocer',
      safetyLicense: 'GROCER-HACCP #7821',
      avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    },
    isVerified: true,
  },
  {
    name: 'Chef Priya Sharma',
    email: 'priya@metropoliscatering.com',
    password: 'DonorPassword123!',
    role: 'donor',
    organizationName: 'Metropolis Grand Catering',
    phone: '+1 (555) 678-1234',
    address: '720 Harbor Way, Waterfront (Loading dock D)',
    profileDetails: {
      orgType: 'Corporate & Event Caterer',
      safetyLicense: 'CAT-PERMIT #9910',
      avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80',
    },
    isVerified: true,
  },
  // Recipients (3 NGOs)
  {
    name: 'Sarah Lin',
    email: 'sarah@eastsidehope.org',
    password: 'RecipientPassword123!',
    role: 'recipient',
    organizationName: 'Eastside Hope Food Rescue & Shelter',
    phone: '+1 (555) 987-6543',
    address: '320 Oak Ridge Rd, East District',
    profileDetails: {
      orgType: 'Emergency Shelter & Soup Kitchen',
      taxId: 'EIN-82-4910291 (501c3)',
      dailyCapacity: 450,
      hasRefrigeration: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    isVerified: true,
  },
  {
    name: 'Rev. Thomas Mitchell',
    email: 'thomas@breadbasket.org',
    password: 'RecipientPassword123!',
    role: 'recipient',
    organizationName: 'Community Breadbasket Hub',
    phone: '+1 (555) 765-4321',
    address: '144 Elm St, North Park',
    profileDetails: {
      orgType: 'Community Food Pantry',
      taxId: 'EIN-47-3829104 (501c3)',
      dailyCapacity: 280,
      hasRefrigeration: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    isVerified: true,
  },
  {
    name: 'Elena Gutierrez',
    email: 'elena@nourishyouth.org',
    password: 'RecipientPassword123!',
    role: 'recipient',
    organizationName: 'Nourish Families Youth Kitchen',
    phone: '+1 (555) 345-6789',
    address: '650 Riverbend Blvd, Southside',
    profileDetails: {
      orgType: 'After-school & Family Center',
      taxId: 'EIN-91-8273645 (501c3)',
      dailyCapacity: 200,
      hasRefrigeration: false,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    },
    isVerified: true,
  },
];

const getFutureDates = (startHoursAhead = 1, durationHours = 3) => {
  const now = new Date();
  const start = new Date(now.getTime() + startHoursAhead * 60 * 60 * 1000);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return { start, end };
};

const getSeedListings = (donorMap) => [
  {
    donorId: donorMap['claire@goldenharvest.com'],
    title: 'Fresh Mediterranean Herb Focaccia & Sourdough',
    description: 'Daily baked rosemary focaccia, artisan olive sourdough loaves, and whole-wheat boules packaged straight from the bake deck. Perfectly fresh and ready for immediate meal distribution.',
    category: 'Bakery',
    quantity: 65,
    unit: 'loaves',
    weightKg: 24,
    pickupAddress: '88 Pinecrest Ave, Westside (Back kitchen loading dock)',
    pickupStart: getFutureDates(1, 3).start,
    pickupEnd: getFutureDates(1, 3).end,
    handlingInstructions: 'Maintain at ambient clean dry storage. Sealed food-grade crates.',
    expiryGuidance: 'Best consumed within 48 hours or freeze.',
    allergens: ['Gluten', 'May contain sesame'],
    dietaryTags: ['Vegetarian', 'Dairy-Free', 'Vegan'],
    storageType: 'Ambient Room Temp (Breads & Packaged)',
    temperatureLog: 'Cooled from bake deck to safe ambient 70°F under standard bakery protocol.',
    packaging: 'Food-grade sanitized crates, sealed with tamper proof tape',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['marco@verdeosteria.com'],
    title: 'Roasted Vegetable & Ricotta Penne al Forno',
    description: 'Surplus banquet pans of organic penne tossed in fire-roasted San Marzano tomato sauce, sautéed zucchini, bell peppers, fresh basil, and whole milk ricotta.',
    category: 'Prepared Meals',
    quantity: 45,
    unit: 'portions',
    weightKg: 18,
    pickupAddress: '412 Mulberry St, Downtown (Side alley door, ring buzzer 3)',
    pickupStart: getFutureDates(0.5, 2).start,
    pickupEnd: getFutureDates(0.5, 2).end,
    handlingInstructions: 'Hot-holding item. Keep above 140°F (60°C) during transit.',
    expiryGuidance: 'Refrigerate within 2 hours or consume hot immediately.',
    allergens: ['Dairy', 'Gluten'],
    dietaryTags: ['Vegetarian', 'Nut-Free'],
    storageType: 'Hot Holding (> 140°F / 60°C)',
    temperatureLog: 'Held continuously at 146°F in certified hot-holding unit.',
    packaging: 'Commercial steam table aluminum pans with tight-lock lids',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['marcus@terraorganics.com'],
    title: 'Organic Salad Greens, Avocado & Citrus Crates',
    description: 'Crates of crisp romaine, baby spinach, Haas avocados, Valencia oranges, and cucumbers. Pristine condition, surplus from overstocked morning shipment.',
    category: 'Fresh Produce',
    quantity: 120,
    unit: 'servings',
    weightKg: 52,
    pickupAddress: '1050 Grand Blvd, Midtown (Receiving Bay 2)',
    pickupStart: getFutureDates(1.5, 5).start,
    pickupEnd: getFutureDates(1.5, 5).end,
    handlingInstructions: 'Keep chilled between 36°F and 41°F.',
    expiryGuidance: 'Crisp and wholesome for 4-5 days under refrigeration.',
    allergens: ['None'],
    dietaryTags: ['Vegan', 'Gluten-Free', 'Organic', 'Raw'],
    storageType: 'Refrigerated Chilled (< 40°F / 4°C)',
    temperatureLog: 'Maintained at 38°F in walk-in cold storage.',
    packaging: 'Ventilated recyclable produce lugs, pre-washed & sorted',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['priya@metropoliscatering.com'],
    title: 'Herb Crusted Chicken Breast & Wild Rice Pilaf',
    description: 'Over-catered corporate lunch. Cooked fresh, rapidly blast-chilled following FDA safety standards. Portions packed in 10-serving trays.',
    category: 'Prepared Meals',
    quantity: 80,
    unit: 'portions',
    weightKg: 35,
    pickupAddress: '720 Harbor Way, Waterfront (Loading dock D)',
    pickupStart: getFutureDates(1, 2.5).start,
    pickupEnd: getFutureDates(1, 2.5).end,
    handlingInstructions: 'Rapidly chilled to 36°F. Keep chilled in insulated cambros.',
    expiryGuidance: 'Reheat to internal 165°F before serving.',
    allergens: ['None'],
    dietaryTags: ['Halal-Certified', 'Gluten-Free'],
    storageType: 'Refrigerated Chilled (< 40°F / 4°C)',
    temperatureLog: 'Blast-chilled from 165°F to 37°F in 75 minutes. Stored at 36°F.',
    packaging: 'Insulated thermo-boxes with temperature indicator tags',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['marcus@terraorganics.com'],
    title: 'Artisan Greek Yogurt & Pasteurized Milk Packs',
    description: 'Grade-A plain and vanilla Greek yogurts and 2% milk jugs with 4 days remaining before sell-by date. Continuous cold-chain assured.',
    category: 'Dairy & Eggs',
    quantity: 50,
    unit: 'cartons',
    weightKg: 20,
    pickupAddress: '1050 Grand Blvd, Midtown',
    pickupStart: getFutureDates(2, 6).start,
    pickupEnd: getFutureDates(2, 6).end,
    handlingInstructions: 'Keep below 39°F at all times.',
    expiryGuidance: '4 days before manufacturer sell-by date.',
    allergens: ['Dairy'],
    dietaryTags: ['Vegetarian', 'Kosher', 'Gluten-Free'],
    storageType: 'Refrigerated Chilled (< 40°F / 4°C)',
    temperatureLog: 'Continuously held at 37°F in dairy refrigeration display.',
    packaging: 'Original manufacturer sealed cartons in cold crates',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['marco@verdeosteria.com'],
    title: 'Vegan Coconut Chickpea Curry with Basmati Rice',
    description: 'Hearty coconut milk, garbanzo bean, spinach, and ginger curry paired with fragrant steamed basmati rice. Warm, nutritious, and comforting.',
    category: 'Prepared Meals',
    quantity: 35,
    unit: 'portions',
    weightKg: 14,
    pickupAddress: '412 Mulberry St, Downtown',
    pickupStart: getFutureDates(1, 3).start,
    pickupEnd: getFutureDates(1, 3).end,
    handlingInstructions: 'Maintain hot holding above 140°F.',
    expiryGuidance: 'Keep hot or refrigerate within 2 hours.',
    allergens: ['Coconut'],
    dietaryTags: ['Vegan', 'Gluten-Free', 'Nut-Free', 'Halal-Certified'],
    storageType: 'Hot Holding (> 140°F / 60°C)',
    temperatureLog: 'Simmered to 195°F, hot-held at 148°F.',
    packaging: 'Sealed stainless thermal cambros with security tape',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['claire@goldenharvest.com'],
    title: 'Butter Croissants, Pain au Chocolat & Brioche',
    description: 'Assorted morning Viennoiserie baked this morning. Crisp exterior, tender crumb, packed in food-safe bakery liners.',
    category: 'Bakery',
    quantity: 55,
    unit: 'pastries',
    weightKg: 12,
    pickupAddress: '88 Pinecrest Ave, Westside',
    pickupStart: getFutureDates(0.5, 4).start,
    pickupEnd: getFutureDates(0.5, 4).end,
    handlingInstructions: 'Ambient temperature, dry environment.',
    expiryGuidance: 'Consume within 24-36 hours.',
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    dietaryTags: ['Vegetarian'],
    storageType: 'Ambient Room Temp (Breads & Packaged)',
    temperatureLog: 'Baked at 380°F, cooled on bakery racks.',
    packaging: 'Food safe pastry boxes with date label',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['marcus@terraorganics.com'],
    title: 'Freshly Pressed Cold Juices & Fruit Smoothies',
    description: 'Green goddess juices (kale, green apple, ginger, lemon) and antioxidant berry smoothies prepared fresh in the morning juice bar.',
    category: 'Beverages',
    quantity: 40,
    unit: 'bottles',
    weightKg: 15,
    pickupAddress: '1050 Grand Blvd, Midtown',
    pickupStart: getFutureDates(1, 4).start,
    pickupEnd: getFutureDates(1, 4).end,
    handlingInstructions: 'Refrigerate immediately below 38°F.',
    expiryGuidance: 'Consume within 48 hours.',
    allergens: ['None'],
    dietaryTags: ['Vegan', 'Gluten-Free', 'Raw', 'Organic'],
    storageType: 'Refrigerated Chilled (< 40°F / 4°C)',
    temperatureLog: 'Cold pressed at 40°F, blast refrigerated at 36°F.',
    packaging: 'Individually sealed BPA-free 12oz bottles in cold crates',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['priya@metropoliscatering.com'],
    title: 'Baked Ziti with Italian Herbs & Mozzarella',
    description: 'Classic baked ziti layered with rich marinara sauce, ricotta, herbs, and bubbly mozzarella cheese.',
    category: 'Prepared Meals',
    quantity: 50,
    unit: 'portions',
    weightKg: 20,
    pickupAddress: '720 Harbor Way, Waterfront',
    pickupStart: getFutureDates(2, 4).start,
    pickupEnd: getFutureDates(2, 4).end,
    handlingInstructions: 'Hot holding above 140°F.',
    expiryGuidance: 'Consume within 24 hours if refrigerated.',
    allergens: ['Gluten', 'Dairy'],
    dietaryTags: ['Vegetarian'],
    storageType: 'Hot Holding (> 140°F / 60°C)',
    temperatureLog: 'Held at 145°F continuously.',
    packaging: 'Deep aluminum catering trays with crimped lids',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
  {
    donorId: donorMap['marcus@terraorganics.com'],
    title: 'Whole Grain Cereal Boxes & Organic Oat Milk',
    description: 'Pantry staples in original sealed packaging. Overstocked shelf items with 3+ months until best-by date.',
    category: 'Packaged & Canned',
    quantity: 60,
    unit: 'units',
    weightKg: 30,
    pickupAddress: '1050 Grand Blvd, Midtown',
    pickupStart: getFutureDates(1, 8).start,
    pickupEnd: getFutureDates(1, 8).end,
    handlingInstructions: 'Dry ambient storage.',
    expiryGuidance: 'Best by date is 3 months out.',
    allergens: ['Gluten (Oats)'],
    dietaryTags: ['Vegan', 'Organic'],
    storageType: 'Ambient Room Temp (Breads & Packaged)',
    temperatureLog: 'Ambient warehouse temperature 68°F.',
    packaging: 'Factory sealed cases',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  },
];

export const seedDatabase = async () => {
  const isForce = process.argv.includes('--force');

  console.log('[ShareBite Seed] Connecting to MongoDB...');
  const conn = await connectDB();

  if (!conn) {
    console.error('[ShareBite Seed] Database connection could not be established. Ensure MONGODB_URI is set in .env.');
    process.exit(1);
  }

  try {
    const existingUsers = await User.countDocuments();
    const existingListings = await FoodListing.countDocuments();

    console.log(`[ShareBite Seed] Existing database records: ${existingUsers} users, ${existingListings} listings.`);

    if (existingUsers > 0 && !isForce) {
      console.log(
        '[ShareBite Seed] Database already contains records. To protect existing data, seeding was aborted.\n' +
        '  Run "npm run seed -- --force" if you explicitly intend to refresh seeded demo records.'
      );
      await disconnectDB();
      return;
    }

    if (isForce) {
      console.log('[ShareBite Seed] --force flag detected. Clearing previous records safely...');
      await DonationRequest.deleteMany({});
      await FoodListing.deleteMany({});
      await User.deleteMany({});
    }

    console.log('[ShareBite Seed] Inserting users (Admin, Donors, Recipients)...');
    const donorMap = {};
    const recipientIds = [];

    for (const u of SEED_USERS) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);

      const createdUser = await User.create({
        name: u.name,
        email: u.email.toLowerCase(),
        passwordHash,
        role: u.role,
        organizationName: u.organizationName,
        phone: u.phone,
        address: u.address,
        profileDetails: u.profileDetails,
        isVerified: u.isVerified,
      });

      if (u.role === 'donor') {
        donorMap[u.email] = createdUser._id;
      } else if (u.role === 'recipient') {
        recipientIds.push(createdUser._id);
      }

      console.log(`  ✓ Created ${u.role.toUpperCase()}: ${u.name} (${u.email})`);
    }

    console.log('\n[ShareBite Seed] Inserting at least 10 compliant food listings...');
    const seedListings = getSeedListings(donorMap);
    const createdListings = [];

    for (const l of seedListings) {
      const created = await FoodListing.create(l);
      createdListings.push(created);
      console.log(`  ✓ Listing: "${created.title}" [${created.category}] - ${created.quantity} portions`);
    }

    console.log('\n[ShareBite Seed] Creating sample donation requests...');
    // Create sample request for listing 0
    if (createdListings.length > 0 && recipientIds.length > 0) {
      const sampleListing = createdListings[0];
      const sampleRecipientId = recipientIds[0];

      sampleListing.reservedQuantity = 20;
      sampleListing.status = 'partially_reserved';
      await sampleListing.save();

      await DonationRequest.create({
        listingId: sampleListing._id,
        recipientId: sampleRecipientId,
        donorId: sampleListing.donorId,
        requestedQuantity: 20,
        status: 'accepted',
        pickupConfirmationDetails: {
          otpCode: '439201',
          verificationCode: 'SB-9021',
        },
        statusHistory: [
          { status: 'pending', changedAt: new Date(Date.now() - 3600000), note: 'Initial request' },
          { status: 'accepted', changedAt: new Date(), note: 'Accepted by donor kitchen' },
        ],
        notes: 'Eastside Hope volunteer team arriving with insulated van.',
      });
      console.log('  ✓ Created sample accepted donation request with OTP #439201.');
    }

    console.log('\n[ShareBite Seed] Database seeding completed successfully! 🎉');
    console.log('--------------------------------------------------');
    console.log('Default Seeded Credentials:');
    console.log('  • Admin:     admin@sharebite.org       / AdminPassword123!');
    console.log('  • Donor:     marco@verdeosteria.com    / DonorPassword123!');
    console.log('  • Recipient: sarah@eastsidehope.org    / RecipientPassword123!');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('[ShareBite Seed] Error during seeding:', error);
  } finally {
    await disconnectDB();
  }
};

// Run if directly executed
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}

export default seedDatabase;
