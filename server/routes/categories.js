const express = require('express');
const router = express.Router();
const auth = require('../utils/jwtMiddleware');
const Category = require('../models/Category');
const Video = require('../models/Video');

// Get all categories (public)
router.get('/list', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get categories' });
  }
});

// Create category (admin only)
router.post('/create', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, description, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = new Category({
      name,
      slug,
      description: description || '',
      icon: icon || '🎥'
    });

    await category.save();
    
    res.json({ message: 'Category created', category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, description, icon } = req.body;
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;

    await category.save();
    
    res.json({ message: 'Category updated', category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update videos in this category to 'general'
    await Video.updateMany(
      { category: category.slug },
      { $set: { category: 'general' } }
    );

    await category.deleteOne();
    
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

// Get videos by category (public)
router.get('/:slug/videos', async (req, res) => {
  try {
    const videos = await Video.find({ category: req.params.slug }).sort({ createdAt: -1 });
    res.json({ videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get videos' });
  }
});

module.exports = router;
