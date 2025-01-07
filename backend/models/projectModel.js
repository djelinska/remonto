const mongoose = require("mongoose");
const { projectSchema } = require("../schemas/projectSchema");

const Project = mongoose.model("Projects", projectSchema, "projects");

module.exports = { Project };
