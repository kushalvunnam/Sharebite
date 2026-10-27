import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const getJwtSecret = () =>
  process.env.JWT_SECRET || 'sharebite_super_secure_jwt_secret_key_2026_at_least_32_chars';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'donor',
      organizationName,
      phone,
      address,
      profileDetails,
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    // Reject public assignment of admin role
    if (role.toLowerCase() === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Admin role cannot be created via public registration.',
      });
    }

    const assignedRole = role.toLowerCase() === 'recipient' ? 'recipient' : 'donor';

    // Check duplicate
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: assignedRole,
      organizationName: organizationName?.trim() || '',
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      profileDetails: profileDetails || {},
      isVerified: assignedRole === 'donor', // Demo convenience; donor is verified by default
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Successfully signed in.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user was populated by authenticate middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login, getMe };
