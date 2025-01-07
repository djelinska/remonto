const mongoose = require("mongoose");
const { materialSchema } = require("../schemas/materialSchema");

const Material = mongoose.model("Material", materialSchema, "materials");

module.exports = {
  Material,
};
