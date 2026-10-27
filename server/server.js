import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory demo store (connectable to MongoDB Atlas via MONGO_URI)
let donations = [
  {
    id: "DON-101",
    title: "Fresh Mediterranean Herb Focaccia & Sourdough",
    category: "Bakery",
    donorName: "Golden Harvest Boulangerie",
    servings: 65,
    weightKg: 24,
    status: "available",
    urgency: "urgent",
    timeRemainingMins: 45,
    pickupWindow: "Today, 5:30 PM - 7:00 PM",
    storageType: "Ambient Room Temp",
    packaging: "Sanitized crates, tamper proof sealed",
    allergens: ["Gluten"],
    dietaryTags: ["Vegetarian", "Vegan"],
    distance: "1.4 km away",
    address: "88 Pinecrest Ave, Westside",
    verificationCode: "SB-4892",
    otpCode: "749210",
    createdAt: new Date().toISOString()
  },
  {
    id: "DON-102",
    title: "Roasted Vegetable & Ricotta Penne al Forno",
    category: "Prepared Meals",
    donorName: "Verde Artisan Osteria",
    servings: 45,
    weightKg: 18,
    status: "available",
    urgency: "urgent",
    timeRemainingMins: 75,
    pickupWindow: "Today, 6:00 PM - 7:30 PM",
    storageType: "Hot Holding (> 140°F)",
    packaging: "Commercial steam pans",
    allergens: ["Dairy", "Gluten"],
    dietaryTags: ["Vegetarian"],
    distance: "1.2 km away",
    address: "412 Mulberry St, Downtown",
    verificationCode: "SB-3190",
    otpCode: "219844",
    createdAt: new Date().toISOString()
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), service: 'ShareBite API' });
});

// GET all donations
app.get('/api/donations', (req, res) => {
  const { category, status, urgency } = req.query;
  let result = [...donations];

  if (category && category !== 'all') {
    result = result.filter(d => d.category === category);
  }
  if (status) {
    result = result.filter(d => d.status === status);
  }
  if (urgency) {
    result = result.filter(d => d.urgency === urgency);
  }

  res.json({ success: true, count: result.length, data: result });
});

// POST new donation
app.post('/api/donations', (req, res) => {
  const { title, category, servings, weightKg, storageType, packaging, address, donorName } = req.body;
  
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const newDonation = {
    id: `DON-${Math.floor(100 + Math.random() * 900)}`,
    title,
    category: category || "Prepared Meals",
    donorName: donorName || "Verde Artisan Osteria",
    servings: Number(servings) || 30,
    weightKg: Number(weightKg) || 12,
    status: "available",
    urgency: "urgent",
    timeRemainingMins: 90,
    pickupWindow: "Today, 6:00 PM - 8:00 PM",
    storageType: storageType || "Refrigerated Chilled (< 40°F)",
    packaging: packaging || "Sanitized sealed containers",
    allergens: req.body.allergens || ["None"],
    dietaryTags: req.body.dietaryTags || ["Vegetarian"],
    distance: "1.2 km away",
    address: address || "412 Mulberry St, Downtown",
    verificationCode: `SB-${Math.floor(1000 + Math.random() * 9000)}`,
    otpCode: `${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString()
  };

  donations.unshift(newDonation);
  res.status(201).json({ success: true, data: newDonation });
});

// PUT claim donation
app.put('/api/donations/:id/claim', (req, res) => {
  const { id } = req.params;
  const { recipientName } = req.body;

  const item = donations.find(d => d.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  item.status = 'claimed';
  item.claimedBy = recipientName || "Eastside Hope Food Rescue";
  item.claimTime = new Date().toISOString();

  res.json({ success: true, data: item });
});

// PUT verify and complete handoff
app.put('/api/donations/:id/verify', (req, res) => {
  const { id } = req.params;
  const { enteredOtp } = req.body;

  const item = donations.find(d => d.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  if (item.otpCode && enteredOtp && item.otpCode.trim() !== enteredOtp.trim()) {
    return res.status(400).json({ success: false, message: 'Invalid OTP code provided' });
  }

  item.status = 'completed';
  item.completedAt = new Date().toISOString();

  res.json({ success: true, message: 'Handoff successfully confirmed', data: item });
});

// Impact metrics endpoint
app.get('/api/impact', (req, res) => {
  const totalMeals = donations
    .filter(d => d.status === 'completed' || d.status === 'claimed')
    .reduce((sum, d) => sum + d.servings, 48250);

  res.json({
    success: true,
    data: {
      totalMealsRescued: totalMeals,
      co2PreventedTons: (totalMeals * 0.45 * 2.5 / 1000).toFixed(1),
      waterSavedLitres: totalMeals * 50,
      activeDonors: 324,
      partnerNGOs: 146
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`ShareBite Backend Service running on port ${PORT}`);
  });
}

export default app;
