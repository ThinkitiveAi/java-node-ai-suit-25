const express = require("express");
const router = express.Router();

const { registerPatient } = require("../controllers/patientController");

router.post("/register", registerPatient);
router.post("/login", require("../controllers/patientController").loginPatient);

module.exports = router;
