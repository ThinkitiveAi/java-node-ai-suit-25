const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { patientValidationSchema } = require("../models/patient");
const db = require("../utils/patientDb");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "30m";

const SALT_ROUNDS = 12;

exports.registerPatient = async (req, res) => {
  try {
    // Validate input
    const { error, value } = patientValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      // Format errors as field: [messages]
      const errors = {};
      error.details.forEach((e) => {
        const field = e.path[0];
        if (!errors[field]) errors[field] = [];
        errors[field].push(e.message);
      });
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    // Destructure validated values
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      date_of_birth,
      gender,
      address,
      emergency_contact,
      medical_history,
      insurance_info,
    } = value;

    // Unique checks
    if (await db.findPatientByEmail(email)) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: { email: ["Email is already registered"] },
      });
    }
    if (await db.findPatientByPhone(phone_number)) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: { phone_number: ["Phone number is already registered"] },
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create patient object
    const patient = {
      id: uuidv4(),
      first_name,
      last_name,
      email,
      phone_number,
      password_hash,
      date_of_birth,
      gender,
      address,
      emergency_contact: emergency_contact || null,
      medical_history: medical_history || [],
      insurance_info: insurance_info || null,
      email_verified: false,
      phone_verified: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db.insertPatient(patient);

    // TODO: Send verification email here

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully. Verification email sent.",
      data: {
        patient_id: patient.id,
        email: patient.email,
        phone_number: patient.phone_number,
        email_verified: patient.email_verified,
        phone_verified: patient.phone_verified,
      },
    });
  } catch (err) {
    console.error("Patient registration error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const { email, phone_number, password } = req.body;
    if ((!email && !phone_number) || !password) {
      return res.status(422).json({
        success: false,
        message: "Email/phone and password are required.",
        error_code: "VALIDATION_ERROR",
      });
    }
    // Find patient by email or phone
    let patient = null;
    if (email) patient = await db.findPatientByEmail(email);
    if (!patient && phone_number)
      patient = await db.findPatientByPhone(phone_number);
    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error_code: "INVALID_CREDENTIALS",
      });
    }
    // Check password
    const valid = await bcrypt.compare(password, patient.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error_code: "INVALID_CREDENTIALS",
      });
    }
    // Check account status
    if (!patient.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account not active",
        error_code: "ACCOUNT_NOT_ACTIVE",
      });
    }
    // JWT payload
    const payload = {
      patient_id: patient.id,
      email: patient.email,
      role: "patient",
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Remove sensitive fields
    const { password_hash, ...patientData } = patient;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        access_token: token,
        expires_in: 1800,
        token_type: "Bearer",
        patient: patientData,
      },
    });
  } catch (err) {
    console.error("Patient login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
