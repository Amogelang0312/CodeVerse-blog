const BlogPost = require('../Models/blogPost');
const fs = require('fs')
const path = require('path')
const cloudinary = require('../Config/cloudinary')

exports.createPost = async (req, res) => {
  try {
    console.log('=== STARTING POST CREATION ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { title, subtitle, content } = req.body;
    
    let imageUrl = null;

    if (req.file) {
      console.log('Starting Cloudinary upload...');
      const cloudinary = require('../Config/cloudinary');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog-posts'
      });
      imageUrl = result.secure_url;

      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      console.log('Cloudinary success:', imageUrl);
    }

    const BlogPost = require('../Models/blogPost');
    const post = new BlogPost({
      title,
      subtitle,
      content,
      imageUrl,
      author: req.userId
    });

    await post.save();
    await post.populate('author', 'username');

    console.log('Post created successfully');
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
    
  } catch (error) {
    console.log('=== ERROR DETAILS ===');
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ author: req.userId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};