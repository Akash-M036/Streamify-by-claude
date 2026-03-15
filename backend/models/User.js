const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  preferences: {
    categories: {
      type: [String],
      default: ['movies', 'gaming', 'education', 'music']
    },
    favoriteGenres: {
      type: [String],
      default: []
    }
  },
  watchHistory: [{
    videoId: String,
    title: String,
    thumbnail: String,
    channelTitle: String,
    category: String,
    watchedAt: { type: Date, default: Date.now },
    watchCount: { type: Number, default: 1 }
  }],
  likedVideos: [{
    videoId: String,
    title: String,
    thumbnail: String,
    channelTitle: String,
    category: String,
    likedAt: { type: Date, default: Date.now }
  }],
  savedVideos: [{
    videoId: String,
    title: String,
    thumbnail: String,
    channelTitle: String,
    category: String,
    savedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
