import mongoose from 'mongoose';

const featureFlagsSchema = new mongoose.Schema({
  enableCodeEditor: { type: Boolean, default: true },
  enableTechnicalSections: { type: Boolean, default: true },
  enableImages: { type: Boolean, default: true },
  enableExportAdvanced: { type: Boolean, default: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','user'], default: 'user' },
  status: { type: String, enum: ['pending','active','disabled'], default: 'pending' },
  featureFlags: { type: featureFlagsSchema, default: () => ({}) },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;
