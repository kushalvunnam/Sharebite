// Comprehensive Demo Data for ShareBite Matching Reference Design System

export const FOOD_CATEGORIES = [
  { id: "all", label: "All", icon: "Utensils" },
  { id: "Meals", label: "Meals", icon: "CookingPot" },
  { id: "Snacks", label: "Snacks", icon: "Coffee" },
  { id: "Bakery", label: "Bakery", icon: "Croissant" },
  { id: "Fruits", label: "Fruits", icon: "Apple" },
  { id: "Vegetables", label: "Vegetables", icon: "Carrot" },
  { id: "Beverages", label: "Beverages", icon: "Milk" }
];

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "No Nuts",
  "Cooked",
  "Fresh",
  "Vegan",
  "Halal-Certified",
  "Gluten-Free",
  "Dairy-Free"
];

export const STORAGE_TYPES = [
  "Hot Holding (> 140°F / 60°C)",
  "Refrigerated Chilled (< 40°F / 4°C)",
  "Ambient Room Temp (Breads & Packaged)",
  "Deep Frozen (< 0°F / -18°C)"
];

export const INITIAL_DONATIONS = [
  {
    id: "DON-201",
    title: "Veg Biryani",
    donorName: "Hotel Paradise",
    donorId: "donor-paradise",
    category: "Meals",
    badge: "Fresh",
    servings: 20,
    weightKg: 8,
    distance: "2.1 km",
    pickupWindow: "Pickup in 3 hours",
    timeRemainingMins: 180,
    rating: 4.8,
    reviewsCount: 120,
    urgency: "normal",
    status: "available",
    address: "Banjara Hills, Hyderabad, Telangana",
    storageType: "Hot Holding (> 60°C)",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80"
    ],
    description: "Freshly prepared veg biryani available for donation. In good condition and packed safely with aromatic basmati rice, farm vegetables, and mild saffron seasoning.",
    dietaryTags: ["Vegetarian", "No Nuts", "Cooked", "Fresh"],
    verificationCode: "SB-HYD-9102",
    otpCode: "749210",
    createdAt: new Date().toISOString()
  },
  {
    id: "DON-202",
    title: "Paneer Curry",
    donorName: "Spice Garden",
    donorId: "donor-spice",
    category: "Meals",
    badge: "New",
    servings: 15,
    weightKg: 6,
    distance: "3.4 km",
    pickupWindow: "Pickup in 4 hours",
    timeRemainingMins: 240,
    rating: 4.9,
    reviewsCount: 94,
    urgency: "normal",
    status: "available",
    address: "Jubilee Hills, Hyderabad, Telangana",
    storageType: "Hot Holding (> 60°C)",
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"
    ],
    description: "Rich and creamy paneer butter masala prepared by restaurant chefs. Fresh cottage cheese cubes simmered in spiced tomato gravy.",
    dietaryTags: ["Vegetarian", "Cooked", "Fresh"],
    verificationCode: "SB-HYD-8421",
    otpCode: "381920",
    createdAt: new Date().toISOString()
  },
  {
    id: "DON-203",
    title: "Idli & Sambar",
    donorName: "Sri Tiffins",
    donorId: "donor-tiffins",
    category: "Meals",
    badge: "Fresh",
    servings: 30,
    weightKg: 10,
    distance: "1.8 km",
    pickupWindow: "Pickup in 2 hours",
    timeRemainingMins: 120,
    rating: 4.7,
    reviewsCount: 88,
    urgency: "urgent",
    status: "available",
    address: "Madhapur, Hyderabad, Telangana",
    storageType: "Hot Holding (> 60°C)",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80"
    ],
    description: "Traditional South Indian steam-cooked idlis packed with hot lentil vegetable sambar and fresh coconut chutney containers.",
    dietaryTags: ["Vegetarian", "Gluten-Free", "Cooked", "Fresh"],
    verificationCode: "SB-HYD-5129",
    otpCode: "492018",
    createdAt: new Date().toISOString()
  },
  {
    id: "DON-204",
    title: "Bread Packets",
    donorName: "FreshBake",
    donorId: "donor-freshbake",
    category: "Bakery",
    badge: "Fresh",
    servings: 50,
    weightKg: 12,
    distance: "2.5 km",
    pickupWindow: "Pickup in 5 hours",
    timeRemainingMins: 300,
    rating: 4.9,
    reviewsCount: 156,
    urgency: "normal",
    status: "available",
    address: "Gachibowli, Hyderabad, Telangana",
    storageType: "Ambient Room Temp",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
    ],
    description: "Freshly baked whole wheat sandwich loaves, milk bread packs, and artisan burger buns surplus from daily morning bakery batch.",
    dietaryTags: ["Vegetarian", "Fresh", "Nut-Free"],
    verificationCode: "SB-HYD-3190",
    otpCode: "820149",
    createdAt: new Date().toISOString()
  },
  {
    id: "DON-205",
    title: "Fruits Box",
    donorName: "Nature Mart",
    donorId: "donor-naturemart",
    category: "Fruits",
    badge: "Fresh",
    servings: 60,
    weightKg: 25,
    distance: "3.1 km",
    pickupWindow: "Pickup in 6 hours",
    timeRemainingMins: 360,
    rating: 4.8,
    reviewsCount: 65,
    urgency: "normal",
    status: "available",
    address: "Kondapur, Hyderabad, Telangana",
    storageType: "Refrigerated Chilled (< 4°C)",
    imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80"
    ],
    description: "Wholesome seasonal fruit boxes including Washington apples, sweet oranges, and ripe bananas in food-grade delivery crates.",
    dietaryTags: ["Vegetarian", "Vegan", "Fresh", "Organic"],
    verificationCode: "SB-HYD-7214",
    otpCode: "109482",
    createdAt: new Date().toISOString()
  },
  {
    id: "DON-206",
    title: "Veg Pulav",
    donorName: "City Kitchen",
    donorId: "donor-citykitchen",
    category: "Meals",
    badge: "Fresh",
    servings: 18,
    weightKg: 7,
    distance: "2.8 km",
    pickupWindow: "Pickup in 4 hours",
    timeRemainingMins: 240,
    rating: 4.7,
    reviewsCount: 78,
    urgency: "normal",
    status: "available",
    address: "Hitech City, Hyderabad, Telangana",
    storageType: "Hot Holding (> 60°C)",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"
    ],
    description: "Homestyle spiced vegetable pulav cooked with carrots, green peas, beans, and fresh mint leaves. Maintained in insulated thermal hot containers.",
    dietaryTags: ["Vegetarian", "Cooked", "Fresh", "No Nuts"],
    verificationCode: "SB-HYD-6490",
    otpCode: "650193",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-201",
    title: "Surplus Request Approved",
    message: "Hotel Paradise accepted your request for Veg Biryani (20 portions). Volunteer pass ready.",
    type: "request",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "notif-202",
    title: "New Surplus Nearby",
    message: "FreshBake just listed 50 Bread Packets in Gachibowli (2.5 km away).",
    type: "listing",
    read: false,
    createdAt: new Date().toISOString()
  }
];

export const IMPACT_METRICS = {
  totalMealsRescued: 10420,
  co2PreventedTons: 4.6,
  activeDonors: 5200,
  partnerNGOs: 540,
  waterSavedLitres: 1250000,
  taxDeductionsClaimedUsd: 39500
};

export const MOCK_TESTIMONIALS = [
  {
    id: "test-1",
    author: "Chef Marco",
    role: "Executive Chef, Hotel Paradise",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    quote: "ShareBite has transformed our end-of-service surplus. Instead of discarding unserved trays of Biryani, they reach community shelters within 45 minutes."
  },
  {
    id: "test-2",
    author: "Ananya Sharma",
    role: "Director, NGO Care Foundation",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    quote: "With ShareBite, we can reliably feed over 450 children and families daily across our centers with hot, freshly prepared meals."
  }
];
