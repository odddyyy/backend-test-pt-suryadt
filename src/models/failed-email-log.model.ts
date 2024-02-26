import mongoose from "mongoose";

const failedEmailLogSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  time: {
    type: Date,
  }
});

const failedEmailLog = mongoose.model('failed_email_log', failedEmailLogSchema);

export default failedEmailLog;