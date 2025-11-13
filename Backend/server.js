const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5175', 
    'https://code-verse-blog-4v7a.vercel.app'  
  ],
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://amogelang12')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

const authRoutes = require('./Routes/auth');
const postRoutes = require('./Routes/post');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
