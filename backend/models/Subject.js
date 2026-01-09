import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 50
    },
    label: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    count: {
        type: Number,
        default: 0,
        min: 0
    },
    color: {
        type: String,
        default: '#6B7280', // Default gray color
        match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
subjectSchema.index({ count: -1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
