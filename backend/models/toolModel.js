const mongoose = require("mongoose");
const { toolSchema } = require("../schemas/toolSchema");

const Tool = mongoose.model("Tool", toolSchema, "tools");

module.exports = {
  Tool,
};
