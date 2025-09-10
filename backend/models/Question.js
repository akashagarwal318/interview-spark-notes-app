import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  data: {
    type: String, // Base64 encoded image data
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  round: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    // Accept predefined or custom slug (validated in middleware already)
    match: /^[a-z0-9-]{2,40}$/
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10000
  },
  code: {
    type: String,
    trim: true,
    maxlength: 5000,
    default: ''
  },
  // Store tag names as strings to keep tag management simple (seed data and routes use names)
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [imageSchema],
  favorite: {
    type: Boolean,
    default: false
  },
  review: {
    type: Boolean,
    default: false
  },
  hot: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  position: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
questionSchema.index({ round: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ favorite: 1 });
questionSchema.index({ review: 1 });
questionSchema.index({ hot: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ 
  question: 'text', 
  answer: 'text', 
  tags: 'text',
  company: 'text',
  position: 'text'
});

// Virtual for formatted creation date
questionSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Virtual for search text
questionSchema.virtual('searchText').get(function() {
  return `${this.question} ${this.answer} ${this.tags.join(' ')} ${this.company} ${this.position}`.toLowerCase();
});

// Middleware to clean tags before saving
questionSchema.pre('save', function(next) {
  if (this.round) {
    this.round = this.round.toLowerCase().trim();
  }
  if (this.tags) {
    this.tags = this.tags
      .filter(tag => tag && tag.trim())
      .map(tag => tag.trim().toLowerCase())
      .filter((tag, index, arr) => arr.indexOf(tag) === index);
  }
  if (this.images) {
    this.images = this.images.map(img => ({
      ...img,
      mimeType: img.mimeType || (img.data?.match(/^data:(image\/[^;]+);base64,/)?.[1] || 'image/png')
    }));
  }
  next();
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
