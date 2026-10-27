import DonationRequest from '../models/DonationRequest.js';
import FoodListing from '../models/FoodListing.js';

export const createRequest = async (req, res, next) => {
  try {
    const { listingId, requestedQuantity, notes } = req.body;
    const qty = Number(requestedQuantity);

    const listing = await FoodListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found.',
      });
    }

    // Check expiration
    if (new Date(listing.pickupEnd) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This surplus food pickup window has expired.',
      });
    }

    // Check donor is not requesting their own food
    if (listing.donorId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'A food donor cannot request their own surplus food listing.',
      });
    }

    // Atomic reservation using conditional update
    const updatedListing = await FoodListing.findOneAndUpdate(
      {
        _id: listingId,
        status: { $in: ['available', 'partially_reserved'] },
        $expr: {
          $gte: [{ $subtract: ['$quantity', '$reservedQuantity'] }, qty],
        },
      },
      {
        $inc: { reservedQuantity: qty },
      },
      { returnDocument: 'after' }
    );

    if (!updatedListing) {
      return res.status(400).json({
        success: false,
        message: `Reservation failed. Requested portions (${qty}) exceed currently available surplus (${
          listing.quantity - listing.reservedQuantity
        } portions available).`,
      });
    }

    // Update status if fully reserved
    if (updatedListing.reservedQuantity >= updatedListing.quantity) {
      updatedListing.status = 'fully_reserved';
      await updatedListing.save();
    } else if (updatedListing.status === 'available') {
      updatedListing.status = 'partially_reserved';
      await updatedListing.save();
    }

    // Generate verification pass credentials
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const verificationCode = `SB-${Math.floor(1000 + Math.random() * 9000)}`;

    const donationRequest = await DonationRequest.create({
      listingId: updatedListing._id,
      recipientId: req.user._id,
      donorId: updatedListing.donorId,
      requestedQuantity: qty,
      status: 'pending',
      pickupConfirmationDetails: {
        otpCode,
        verificationCode,
      },
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date(),
          changedBy: req.user._id,
          note: 'Request created by recipient shelter',
        },
      ],
      notes: notes?.trim() || '',
    });

    const populatedRequest = await DonationRequest.findById(donationRequest._id)
      .populate('listingId')
      .populate('recipientId', 'name organizationName phone profileDetails')
      .populate('donorId', 'name organizationName phone address');

    res.status(201).json({
      success: true,
      message: 'Surplus food request reserved successfully. Awaiting donor confirmation.',
      data: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (req.user.role === 'recipient') {
      filter.recipientId = req.user._id;
    } else if (req.user.role === 'donor') {
      filter.donorId = req.user._id;
    }
    // Admin sees all requests if desired

    if (status) {
      filter.status = status;
    }

    const requests = await DonationRequest.find(filter)
      .populate('listingId')
      .populate('recipientId', 'name organizationName phone profileDetails')
      .populate('donorId', 'name organizationName phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await DonationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Only owning donor or admin can accept
    if (request.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the food donor can accept this request.',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept request with status "${request.status}". Only pending requests can be accepted.`,
      });
    }

    request.status = 'accepted';
    request.statusHistory.push({
      status: 'accepted',
      changedAt: new Date(),
      changedBy: req.user._id,
      note: 'Donor accepted pickup reservation',
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request accepted. Volunteer may now proceed for pickup.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = await DonationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the food donor can reject this request.',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject request with status "${request.status}".`,
      });
    }

    request.status = 'rejected';
    request.statusHistory.push({
      status: 'rejected',
      changedAt: new Date(),
      changedBy: req.user._id,
      note: reason || 'Donor rejected request',
    });

    await request.save();

    // Release reserved quantity on FoodListing
    const listing = await FoodListing.findById(request.listingId);
    if (listing) {
      listing.reservedQuantity = Math.max(0, listing.reservedQuantity - request.requestedQuantity);
      if (listing.status === 'fully_reserved') {
        listing.status = listing.reservedQuantity > 0 ? 'partially_reserved' : 'available';
      } else if (listing.reservedQuantity === 0) {
        listing.status = 'available';
      }
      await listing.save();
    }

    res.status(200).json({
      success: true,
      message: 'Request rejected. Reserved food portions returned to available inventory.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = await DonationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const isRecipient = request.recipientId.toString() === req.user._id.toString();
    const isDonor = request.donorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRecipient && !isDonor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to cancel this request.',
      });
    }

    if (!['pending', 'accepted'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel request with status "${request.status}".`,
      });
    }

    request.status = 'cancelled';
    request.statusHistory.push({
      status: 'cancelled',
      changedAt: new Date(),
      changedBy: req.user._id,
      note: reason || 'Request cancelled before pickup',
    });

    await request.save();

    // Release reserved quantity back to available
    const listing = await FoodListing.findById(request.listingId);
    if (listing) {
      listing.reservedQuantity = Math.max(0, listing.reservedQuantity - request.requestedQuantity);
      if (listing.status === 'fully_reserved') {
        listing.status = listing.reservedQuantity > 0 ? 'partially_reserved' : 'available';
      } else if (listing.reservedQuantity === 0) {
        listing.status = 'available';
      }
      await listing.save();
    }

    res.status(200).json({
      success: true,
      message: 'Request cancelled. Reserved portions released back to surplus listing.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const pickupRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await DonationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const isRecipient = request.recipientId.toString() === req.user._id.toString();
    const isDonor = request.donorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRecipient && !isDonor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden.',
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: `Request must be in "accepted" status to mark picked up. Current: "${request.status}".`,
      });
    }

    request.status = 'picked_up';
    request.statusHistory.push({
      status: 'picked_up',
      changedAt: new Date(),
      changedBy: req.user._id,
      note: 'Volunteer has arrived at kitchen and initiated pickup',
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Pickup in progress.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const completeRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { enteredOtp } = req.body;

    const request = await DonationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Only donor (or admin) can verify and complete the handoff
    const isDonor = request.donorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isDonor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the donor can verify the OTP and complete handoff.',
      });
    }

    if (!['accepted', 'picked_up'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot complete handoff for request with status "${request.status}".`,
      });
    }

    // Verify OTP code
    const storedOtp = request.pickupConfirmationDetails?.otpCode;
    if (storedOtp && (!enteredOtp || enteredOtp.trim() !== storedOtp.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please check the 6-digit code on the volunteer pickup pass.',
      });
    }

    request.status = 'completed';
    request.pickupConfirmationDetails.confirmedAt = new Date();
    request.pickupConfirmationDetails.verifiedBy = req.user._id;

    request.statusHistory.push({
      status: 'completed',
      changedAt: new Date(),
      changedBy: req.user._id,
      note: 'Handoff successfully confirmed with valid OTP code',
    });

    await request.save();

    // Check if parent listing is fully completed
    const listing = await FoodListing.findById(request.listingId);
    if (listing && listing.reservedQuantity >= listing.quantity) {
      // Check if all requests for this listing are completed
      const pendingOrAccepted = await DonationRequest.countDocuments({
        listingId: listing._id,
        status: { $in: ['pending', 'accepted', 'picked_up'] },
      });
      if (pendingOrAccepted === 0) {
        listing.status = 'completed';
        await listing.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Zero-waste handoff successfully completed and verified!',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  pickupRequest,
  completeRequest,
};
