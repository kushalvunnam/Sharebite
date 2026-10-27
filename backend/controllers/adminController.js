import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import DonationRequest from '../models/DonationRequest.js';
import Report from '../models/Report.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      donorCount,
      recipientCount,
      adminCount,
      unverifiedCount,
      totalListings,
      activeListings,
      completedListings,
      cancelledListings,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      completedRequests,
      cancelledRequests,
      totalReports,
      pendingReports,
      resolvedReports,
      allCompletedRequests,
      allListings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'recipient' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isVerified: false }),
      FoodListing.countDocuments(),
      FoodListing.countDocuments({ status: 'available' }),
      FoodListing.countDocuments({ status: 'completed' }),
      FoodListing.countDocuments({ status: 'cancelled' }),
      DonationRequest.countDocuments(),
      DonationRequest.countDocuments({ status: 'pending' }),
      DonationRequest.countDocuments({ status: 'accepted' }),
      DonationRequest.countDocuments({ status: 'completed' }),
      DonationRequest.countDocuments({ status: 'cancelled' }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: { $in: ['reviewed', 'dismissed', 'action_taken'] } }),
      DonationRequest.find({ status: 'completed' }).select('requestedQuantity'),
      FoodListing.find().select('quantity reservedQuantity weightKg')
    ]);

    const mealsRescued = allCompletedRequests.reduce((sum, r) => sum + (r.requestedQuantity || 0), 0);
    const totalServingsAvailable = allListings.reduce((sum, l) => sum + Math.max(0, (l.quantity || 0) - (l.reservedQuantity || 0)), 0);
    const co2KgAvoided = Math.round(mealsRescued * 2.5);
    const waterLitersSaved = Math.round(mealsRescued * 410);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          donors: donorCount,
          recipients: recipientCount,
          admins: adminCount,
          unverified: unverifiedCount,
        },
        listings: {
          total: totalListings,
          available: activeListings,
          completed: completedListings,
          cancelled: cancelledListings,
          totalServingsAvailable,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          accepted: acceptedRequests,
          completed: completedRequests,
          cancelled: cancelledRequests,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports,
        },
        impact: {
          mealsRescued,
          co2KgAvoided,
          waterLitersSaved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { role, isVerified, search } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }
    if (isVerified !== undefined && isVerified !== 'all') {
      filter.isVerified = isVerified === 'true';
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { organizationName: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isVerified = isVerified !== undefined ? Boolean(isVerified) : true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} verification status set to ${user.isVerified}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const moderateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const listing = await FoodListing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Food listing not found.' });
    }

    if (status) {
      listing.status = status;
    }
    if (reason) {
      listing.description = `${listing.description}\n[Admin Moderation Notice: ${reason}]`;
    }

    await listing.save();

    res.status(200).json({
      success: true,
      message: `Listing moderated successfully. Status set to ${listing.status}.`,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const [recentUsers, recentListings, recentRequests, recentReports] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(10).select('name email role organizationName isVerified createdAt'),
      FoodListing.find().populate('donorId', 'name organizationName').sort({ createdAt: -1 }).limit(10),
      DonationRequest.find().populate('recipientId', 'name organizationName').populate('listingId', 'title').sort({ updatedAt: -1 }).limit(15),
      Report.find().populate('reporterId', 'name email').populate('listingId', 'title').sort({ createdAt: -1 }).limit(10),
    ]);

    const events = [];

    recentUsers.forEach(u => {
      events.push({
        id: `user-${u._id}`,
        timestamp: u.createdAt,
        category: 'auth',
        action: 'User Registered',
        actor: u.name,
        target: u.organizationName || u.email,
        details: `Account created with role: ${u.role.toUpperCase()}${u.isVerified ? ' (Verified)' : ' (Pending Verification)'}`,
        status: u.isVerified ? 'verified' : 'pending',
      });
    });

    recentListings.forEach(l => {
      events.push({
        id: `list-${l._id}`,
        timestamp: l.createdAt,
        category: 'listing',
        action: 'Food Surplus Listed',
        actor: l.donorId?.organizationName || l.donorId?.name || 'Kitchen Partner',
        target: l.title,
        details: `${l.quantity} portions (${l.category}) posted. Storage: ${l.storageType}`,
        status: l.status,
      });
    });

    recentRequests.forEach(r => {
      events.push({
        id: `req-${r._id}`,
        timestamp: r.updatedAt || r.createdAt,
        category: 'request',
        action: `Request ${r.status.toUpperCase()}`,
        actor: r.recipientId?.organizationName || r.recipientId?.name || 'NGO Recipient',
        target: r.listingId?.title || 'Food Batch',
        details: `Claimed ${r.requestedQuantity} portions. Current status: ${r.status}`,
        status: r.status,
      });
    });

    recentReports.forEach(rep => {
      events.push({
        id: `rep-${rep._id}`,
        timestamp: rep.createdAt,
        category: 'report',
        action: 'Safety Report Filed',
        actor: rep.reporterId?.name || 'Platform Member',
        target: rep.listingId?.title || 'Listing',
        details: `Reason: ${rep.reason}. Note: ${rep.details.slice(0, 80)}`,
        status: rep.status,
      });
    });

    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAdminStats,
  getAdminUsers,
  verifyUser,
  moderateListing,
  getAuditLogs,
};
