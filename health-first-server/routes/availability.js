const express = require("express");
const router = express.Router();
const controller = require("../controllers/availabilityController");

// Create availability slots
router.post("/", controller.createAvailability);
// Get provider availability
router.get("/:provider_id/availability", controller.getProviderAvailability);
// Update specific slot
router.put("/:slot_id", controller.updateSlot);
// Delete slot
router.delete("/:slot_id", controller.deleteSlot);
// Patient search for available slots
router.get("/search", controller.searchSlots);

module.exports = router;
