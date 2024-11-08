const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
  company: {
    type: String, 
    required: [true, 'Please provide the company'],
  }, 
  position: {
    type: String, 
    required: [true, 'Please provide your position'], 
  }, 
  status: {
    type: String, 
    enum: ['pending', 'interviewing', 'accepted'], 
    default: 'pending'
  }, 
  createdBy: {
    type: mongoose.Types.ObjectId, 
    required: [true, 'Need created user']
  }
}, {timestamps: true});

const Jobs = mongoose.model('Jobs', JobSchema);

module.exports = Jobs;