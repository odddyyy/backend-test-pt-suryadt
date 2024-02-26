import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true]
  },
  lastName: {
    type: String,
    required: [true]
  },
  birthday: {
    type: Date,
    required: [true]
  },
  location: {
    type: String,
    required: [true]
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  isSentEmail: {
    type: Boolean,
    default: false,
  },
});

const user = mongoose.model('users', userSchema);

export default user;