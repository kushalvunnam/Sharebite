export const validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password is required and must be at least 6 characters long',
    });
  }

  // Strict security requirement: Never allow public registration to assign Admin role
  if (role && role.toLowerCase() === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin accounts cannot be created via public registration. Contact platform governance.',
    });
  }

  if (role && !['donor', 'recipient'].includes(role.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Public registration must be either "donor" or "recipient".',
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email and password are required to sign in',
    });
  }

  next();
};

export const validateFoodListing = (req, res, next) => {
  const {
    title,
    category,
    quantity,
    pickupStart,
    pickupEnd,
    pickupAddress,
    handlingInstructions,
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  if (!category) {
    return res.status(400).json({ success: false, message: 'Category is required' });
  }

  const numQuantity = Number(quantity);
  if (isNaN(numQuantity) || numQuantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a positive number greater than 0',
    });
  }

  if (!pickupAddress || !pickupAddress.trim()) {
    return res.status(400).json({ success: false, message: 'Pickup address is required' });
  }

  if (!pickupStart || !pickupEnd) {
    return res.status(400).json({
      success: false,
      message: 'Both pickupStart and pickupEnd timestamps are required',
    });
  }

  const startDate = new Date(pickupStart);
  const endDate = new Date(pickupEnd);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Pickup start and end must be valid date/time strings',
    });
  }

  if (startDate >= endDate) {
    return res.status(400).json({
      success: false,
      message: 'pickupEnd must occur after pickupStart',
    });
  }

  if (!handlingInstructions || !handlingInstructions.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Safe handling and food temperature instructions are required for HACCP compliance',
    });
  }

  next();
};

export const validateDonationRequest = (req, res, next) => {
  const { listingId, requestedQuantity } = req.body;

  if (!listingId) {
    return res.status(400).json({ success: false, message: 'listingId is required' });
  }

  const qty = Number(requestedQuantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({
      success: false,
      message: 'requestedQuantity must be a positive number greater than 0',
    });
  }

  next();
};

export default {
  validateRegistration,
  validateLogin,
  validateFoodListing,
  validateDonationRequest,
};
