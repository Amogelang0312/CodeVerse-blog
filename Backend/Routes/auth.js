const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/user');
console.log('User model:', User);

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('===registration debug===')
    console.log('raw password during registration', `"${password}"`)
     console.log('password lenth during registration:', password.length)

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/debug-users', async (req, res) =>{
  const users = await User.find({})
  console.log('all users', users)
  res.json ({count: users.length, users})
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=== LOGIN DEBUG ===');
    console.log('Email:', email);
    console.log('Raw password:', password);;
    console.log('Password length:', password.length);
    console.log('Password split:', password.split(''));
    console.log('Password char codes:', [...password].map(c => c.charCodeAt(0)));
    console.log('Password characters:', password.split('').map(c => c.charCodeAt(0)));

    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Stored password hash:', user.password);
    console.log('Hash length:', user.password.length);
    console.log('=== TESTING KNOWN PASSWORDS ===');
    console.log('Testing "123456":', await bcrypt.compare('123456', user.password));
    console.log('Testing "123":', await bcrypt.compare('123', user.password));
    console.log('Testing "password":', await bcrypt.compare('password', user.password));
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Actual password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Login successful');
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;