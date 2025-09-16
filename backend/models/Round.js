import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: false },
  name: { type: String, required: true, lowercase: true, trim: true },
  label: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

roundSchema.index({ user: 1, name: 1 }, { unique: true });

const Round = mongoose.model('Round', roundSchema);
export default Round;