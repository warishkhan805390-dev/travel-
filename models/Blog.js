const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please add author'],
    },
    coverImage: {
      type: String,
    },
    tags: [String],
    category: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
