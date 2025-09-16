import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: false },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 50
  },
  count: {
    type: Number,
    default: 0,
    min: 0
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  },
  category: {
    type: String,
    enum: ['technology', 'concept', 'framework', 'language', 'tool', 'skill', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
// Note: name field already has unique: true, so no need for separate index
tagSchema.index({ count: -1 });
tagSchema.index({ category: 1 });
tagSchema.index({ isActive: 1 });
tagSchema.index({ user: 1, name: 1 });

// Virtual for popularity level
tagSchema.virtual('popularity').get(function() {
  if (this.count >= 20) return 'high';
  if (this.count >= 10) return 'medium';
  if (this.count >= 5) return 'low';
  return 'minimal';
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
