const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelper');
const { verifyGoogleToken } = require('../utils/googleAuthHelper');
const validator = require('validator');

// Validation helper function
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!validator.isEmail(email)) return 'Invalid email format';
  return null;
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
    return 'Password must include uppercase, lowercase, number, and special character';
  }
  return null;
};

const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  if (name.length > 50) return 'Name cannot exceed 50 characters';
  return null;
};

// Local Login
const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  
  if (emailError) return res.status(400).json({ message: emailError });
  if (passwordError) return res.status(400).json({ message: passwordError });

  try {
    const user = await User.findOne({ email, authProvider: 'local' });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google Login Function
const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    // Verify the Google token and extract user information
    const googleData = await verifyGoogleToken(credential);

    // Check if the user already exists in the database
    let user = await User.findOne({ providerId: googleData.sub, authProvider: 'google' });

    // If user does not exist, create a new one
    if (!user) {
      user = await User.create({
        name: googleData.name,
        email: googleData.email,
        authProvider: 'google',
        providerId: googleData.sub,
        role: 'Guest',
      });
    }

    // Generate a JWT token for the user
    const token = generateToken(user._id);

    // Respond with the token and user details
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error('Google login error:', error);
    res.status(500).json({
      message: 'Google login failed',
      error: error.message,
    });
  }
};


// Register user (local signup)
const register = async (req, res) => {
  const { name, email, password, role = 'Guest' } = req.body;
  
  // Validate inputs
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  
  if (nameError) return res.status(400).json({ message: nameError });
  if (emailError) return res.status(400).json({ message: emailError });
  if (passwordError) return res.status(400).json({ message: passwordError });

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email, authProvider: 'local' });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      authProvider: 'local',
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { 
        id: newUser._id, 
        email: newUser.email, 
        name: newUser.name, 
        role: newUser.role 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Get Current User (Protected Route)
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  login,
  googleLogin,
  register,
  getCurrentUser
};