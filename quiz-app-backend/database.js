// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  grade: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);

// database.js
const mongoose = require('mongoose');
const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

