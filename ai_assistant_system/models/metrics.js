import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema({
  totalTickets: { type: Number, default: 0 },
  successfulAIResponses: { type: Number, default: 0 },
  failedAIResponses: { type: Number, default: 0 },
  totalResponseTime: { type: Number, default: 0 },
  autoAssignedCount: { type: Number, default: 0 }
});

export default mongoose.model("Metrics", metricsSchema);