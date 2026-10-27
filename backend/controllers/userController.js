import User from '../models/User.js';

/**
 * GET /api/users/me
 * Retrieve the current authenticated user's profile
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/me
 * Update authenticated user's profile (name, organizationName, phone, preferences)
 * Security Guard: Never permits modifying role, email, passwordHash, or verification status.
 */
export const updateMe = async (req, res, next) => {
  try {
    const { name, organizationName, phone, preferences } = req.body;

    // Explicit security protection against tampering with sensitive fields
    const sensitiveFields = ['role', 'email', 'password', 'passwordHash', 'isVerified', '_id'];
    for (const field of sensitiveFields) {
      if (req.body[field] !== undefined) {
        return res.status(400).json({
          success: false,
          message: `Security Notice: Modifying '${field}' is not permitted via this endpoint.`,
        });
      }
    }

    // Name validation
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty. Please provide a valid full name.',
        });
      }

      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name is too short. Minimum 2 characters required.',
        });
      }

      if (trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot exceed 100 characters.',
        });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    // Apply allowed updates
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (organizationName !== undefined && typeof organizationName === 'string') {
      user.organizationName = organizationName.trim().slice(0, 150);
    }

    if (phone !== undefined && typeof phone === 'string') {
      user.phone = phone.trim().slice(0, 30);
    }

    if (preferences && typeof preferences === 'object') {
      user.preferences = {
        urgentAlerts: preferences.urgentAlerts !== undefined ? Boolean(preferences.urgentAlerts) : user.preferences?.urgentAlerts ?? true,
        soundAlerts: preferences.soundAlerts !== undefined ? Boolean(preferences.soundAlerts) : user.preferences?.soundAlerts ?? true,
        weeklyDigest: preferences.weeklyDigest !== undefined ? Boolean(preferences.weeklyDigest) : user.preferences?.weeklyDigest ?? true,
        autoRefresh: preferences.autoRefresh !== undefined ? Boolean(preferences.autoRefresh) : user.preferences?.autoRefresh ?? false,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export default { getMe, updateMe };
