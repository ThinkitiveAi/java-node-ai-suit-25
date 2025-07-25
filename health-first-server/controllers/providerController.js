const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { providerValidationSchema } = require("../models/provider");
const db = require("../utils/db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "1h";

const SALT_ROUNDS = 12;

exports.registerProvider = async (req, res) => {
  try {
    // Validate input
    const { error, value } = providerValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }
    // Destructure validated values
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      specialization,
      license_number,
      years_of_experience,
      clinic_address,
    } = value;

    // Unique checks
    if (await db.findProviderByEmail(email)) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }
    if (await db.findProviderByPhone(phone_number)) {
      return res
        .status(409)
        .json({ success: false, message: "Phone number already registered." });
    }
    if (await db.findProviderByLicense(license_number)) {
      return res.status(409).json({
        success: false,
        message: "License number already registered.",
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create provider object
    const provider = {
      id: uuidv4(),
      first_name,
      last_name,
      email,
      phone_number,
      password_hash,
      specialization,
      license_number,
      years_of_experience,
      clinic_address,
      verification_status: "pending",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db.insertProvider(provider);

    // TODO: Send verification email here

    return res.status(201).json({
      success: true,
      message: "Provider registered successfully. Verification email sent.",
      data: {
        provider_id: provider.id,
        email: provider.email,
        verification_status: provider.verification_status,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email and password are required.",
        error_code: "VALIDATION_ERROR",
      });
    }
    // Find provider by email
    const provider = await db.findProviderByEmail(email);
    if (!provider) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error_code: "INVALID_CREDENTIALS",
      });
    }
    // Check password
    const valid = await bcrypt.compare(password, provider.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error_code: "INVALID_CREDENTIALS",
      });
    }
    // Check account status
    if (!provider.is_active || provider.verification_status !== "verified") {
      return res.status(401).json({
        success: false,
        message: "Account not active or not verified",
        error_code: "ACCOUNT_NOT_VERIFIED",
      });
    }
    // JWT payload
    const payload = {
      provider_id: provider.id,
      email: provider.email,
      role: "provider",
      specialization: provider.specialization,
      verification_status: provider.verification_status,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Remove sensitive fields
    const { password_hash, ...providerData } = provider;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        access_token: token,
        expires_in: 3600,
        token_type: "Bearer",
        provider: providerData,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
