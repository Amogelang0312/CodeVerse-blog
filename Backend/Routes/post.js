const express = require('express');
const auth = require('../Middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/test', (req, res) => {
  console.log('=== SIMPLE POST TEST HIT ===');
  res.json({ message: 'Simple POST test works!' });
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('=== CREATE POST STARTED ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User ID:', req.userId);

    const { title, subtitle, content } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ 
        message: 'Title and content are required' 
      });
    }

    let imageUrl = null;
    
    if (req.file) {
      console.log('Starting Cloudinary upload...');
      const cloudinary = require('../Config/cloudinary');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog-posts'
      });
      imageUrl = result.secure_url;
      console.log('Cloudinary success:', imageUrl);
      
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
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
    console.log('CREATE POST ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const BlogPost = require('../Models/blogPost');
    const posts = await BlogPost.find().populate('author', 'username');
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('DELETE route hit - Post ID:', req.params.id);
    
    const BlogPost = require('../Models/blogPost');
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ message: 'Post not found' });
    }
    
    console.log('Post author:', post.author);
    console.log('Request user ID:', req.userId);
    
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await BlogPost.findByIdAndDelete(req.params.id);
    console.log('Post deleted successfully');
    res.json({ message: 'Post deleted successfully' });
    
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('✏️ UPDATE route hit - Post ID:', req.params.id);
    console.log('Update body:', req.body);
    console.log('Update file:', req.file);

    const { title, subtitle, content } = req.body;
    const BlogPost = require('../Models/blogPost');
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }
    post.title = title || post.title;
    post.subtitle = subtitle || post.subtitle;
    post.content = content || post.content;

    if (req.file) {
      console.log('Updating image...');
      const cloudinary = require('../Config/cloudinary');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog-posts'
      });
      post.imageUrl = result.secure_url;
      
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }

    await post.save();
    await post.populate('author', 'username');

    console.log('Post updated successfully');
    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;