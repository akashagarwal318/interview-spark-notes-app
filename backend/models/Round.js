import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, lowercase: true, trim: true },
  label: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

roundSchema.index({ name: 1 }, { unique: true });

const Round = mongoose.model('Round', roundSchema);
export default Round;