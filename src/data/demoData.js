// Clean zero-state initial definitions for ShareBite platform

export const INITIAL_DONORS = [];

export const INITIAL_RECIPIENTS = [];

export const INITIAL_DONATIONS = [];

export const INITIAL_NOTIFICATIONS = [];

export const FOOD_CATEGORIES = [
  { id: "all", label: "All Surplus", icon: "Utensils", count: 0 },
  { id: "Prepared Meals", label: "Prepared Meals", icon: "CookingPot", count: 0 },
  { id: "Bakery", label: "Bakery & Breads", icon: "Croissant", count: 0 },
  { id: "Fresh Produce", label: "Fresh Produce", icon: "Carrot", count: 0 },
  { id: "Dairy & Eggs", label: "Dairy & Eggs", icon: "Milk", count: 0 },
  { id: "Beverages", label: "Fresh Drinks", icon: "Coffee", count: 0 }
];

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Halal-Certified",
  "Kosher",
  "Gluten-Free",
  "Nut-Free",
  "Dairy-Free",
  "Organic"
];

export const STORAGE_TYPES = [
  "Hot Holding (> 140°F / 60°C)",
  "Refrigerated Chilled (< 40°F / 4°C)",
  "Ambient Room Temp (Breads & Packaged)",
  "Deep Frozen (< 0°F / -18°C)"
];

export const IMPACT_METRICS = {
  totalMealsRescued: 0,
  co2PreventedTons: 0,
  activeDonors: 0,
  partnerNGOs: 0,
  waterSavedLitres: 0,
  taxDeductionsClaimedUsd: 0
};

export const MOCK_TESTIMONIALS = [];
