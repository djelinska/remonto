const express = require("express");
const authenticateUser = require("../../middlewares/authenticateUser");

const router = express.Router({ mergeParams: true }); // to access :projectId

router.get("/", [authenticateUser], async (req, res) => {});

router.post("/", [authenticateUser], async (req, res) => {});

router.put("/:materialId", [authenticateUser], async (req, res) => {});

router.delete("/:materialId", [authenticateUser], async (req, res) => {});

module.exports = router;
