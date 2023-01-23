const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    lastMsg:{
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);