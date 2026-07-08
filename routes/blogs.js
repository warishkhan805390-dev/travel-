const express = require('express');
const router = express.Router();
const {
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin/all', protect, authorize('admin'), getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.get('/', getPublishedBlogs);
router.post('/', protect, authorize('admin'), createBlog);
router.put('/:id', protect, authorize('admin'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

module.exports = router;
