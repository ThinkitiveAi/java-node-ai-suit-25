const express = require("express");
const router = express.Router();

// Controller placeholder
const { registerProvider } = require("../controllers/providerController");

router.post("/register", registerProvider);
router.post(
  "/login",
  require("../controllers/providerController").loginProvider
);

module.exports = router;
