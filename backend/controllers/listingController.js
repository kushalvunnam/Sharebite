import FoodListing from '../models/FoodListing.js';
import DonationRequest from '../models/DonationRequest.js';

export const getListings = async (req, res, next) => {
  try {
    const { search, category, status, donorId, limit = 50, page = 1 } = req.query;

    const filter = {};

    // Search query
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }, { pickupAddress: regex }];
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Donor filter
    if (donorId) {
      filter.donorId = donorId;
    }

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    } else if (!status && !donorId) {
      // By default for public directory, show available or partially reserved
      filter.status = { $in: ['available', 'partially_reserved'] };
      // Filter out past pickup windows
      filter.pickupEnd = { $gte: new Date() };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const total = await FoodListing.countDocuments(filter);
    const listings = await FoodListing.find(filter)
      .populate('donorId', 'name organizationName phone address profileDetails')
      .sort({ listedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await FoodListing.findById(id).populate(
      'donorId',
      'name organizationName phone address profileDetails'
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      unit = 'servings',
      weightKg = 0,
      pickupAddress,
      pickupStart,
      pickupEnd,
      handlingInstructions,
      expiryGuidance,
      allergens = ['None'],
      dietaryTags = [],
      storageType,
      temperatureLog,
      packaging,
      imageUrl,
    } = req.body;

    const listing = await FoodListing.create({
      donorId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      quantity: Number(quantity),
      unit,
      weightKg: Number(weightKg) || 0,
      reservedQuantity: 0,
      pickupAddress: pickupAddress.trim(),
      pickupStart: new Date(pickupStart),
      pickupEnd: new Date(pickupEnd),
      handlingInstructions: handlingInstructions.trim(),
      expiryGuidance: expiryGuidance?.trim() || 'Consume immediately or refrigerate under 40°F',
      allergens: Array.isArray(allergens) ? allergens : [allergens],
      dietaryTags: Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags],
      storageType: storageType || 'Ambient Room Temp (Breads & Packaged)',
      temperatureLog: temperatureLog || 'Logged at preparation',
      packaging: packaging || 'Sanitized sealed food containers',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      listedAt: new Date(),
    });

    const populatedListing = await FoodListing.findById(listing._id).populate(
      'donorId',
      'name organizationName phone profileDetails'
    );

    res.status(201).json({
      success: true,
      message: 'Surplus food listing published successfully.',
      data: populatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await FoodListing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found.',
      });
    }

    // Ownership check: must be owner or admin
    const isOwner = listing.donorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not own this food listing.',
      });
    }

    const {
      title,
      description,
      category,
      quantity,
      weightKg,
      pickupAddress,
      pickupStart,
      pickupEnd,
      handlingInstructions,
      expiryGuidance,
      allergens,
      dietaryTags,
      storageType,
      temperatureLog,
      packaging,
      imageUrl,
      status,
    } = req.body;

    // Validate quantity against currently reserved portions
    if (quantity !== undefined) {
      const newQty = Number(quantity);
      if (newQty < listing.reservedQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce total quantity (${newQty}) below currently reserved portions (${listing.reservedQuantity}).`,
        });
      }
      listing.quantity = newQty;
    }

    if (title) listing.title = title.trim();
    if (description) listing.description = description.trim();
    if (category) listing.category = category;
    if (weightKg !== undefined) listing.weightKg = Number(weightKg);
    if (pickupAddress) listing.pickupAddress = pickupAddress.trim();
    if (pickupStart) listing.pickupStart = new Date(pickupStart);
    if (pickupEnd) listing.pickupEnd = new Date(pickupEnd);
    if (handlingInstructions) listing.handlingInstructions = handlingInstructions.trim();
    if (expiryGuidance) listing.expiryGuidance = expiryGuidance.trim();
    if (allergens) listing.allergens = Array.isArray(allergens) ? allergens : [allergens];
    if (dietaryTags) listing.dietaryTags = Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags];
    if (storageType) listing.storageType = storageType;
    if (temperatureLog) listing.temperatureLog = temperatureLog;
    if (packaging) listing.packaging = packaging;
    if (imageUrl) listing.imageUrl = imageUrl;
    if (status) listing.status = status;

    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing successfully updated.',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await FoodListing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found.',
      });
    }

    const isOwner = listing.donorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this listing.',
      });
    }

    // Safety check: check if accepted or active requests exist
    const activeRequests = await DonationRequest.countDocuments({
      listingId: id,
      status: { $in: ['accepted', 'pending'] },
    });

    if (activeRequests > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete listing. There are ${activeRequests} active request(s) awaiting pickup. Cancel those requests first.`,
      });
    }

    await FoodListing.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Listing successfully removed.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
