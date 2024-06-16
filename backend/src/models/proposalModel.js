const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: String,
  address: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bedroom: {
    type: Number,
    required: true,
  },
  bathroom: {
    type: Number,
    required: true,
  },
  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Constructor",
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      bidderName: {
        type: String,
      },
    },
  ],
  monthlyReports: [
    {
      month: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      reportText: {
        type: String,
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

mongoose.model("Proposal", proposalSchema);
