// 1. Require mongoose
const mongoose = require("mongoose");

// 2. Create a schema
const todoSchema = new mongoose.Schema({
  task: String,
  category: String,
  done: {
    type: Boolean,
    default: false,
  },
});

// 3. Export created schema
module.exports = mongoose.model("Todo", todoSchema);
