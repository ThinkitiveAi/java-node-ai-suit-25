const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticatePatientToken } = require("../middleware/patientAuth");
const db = require("../utils/patientDb");
const patientController = require("../controllers/patientController");

const app = express();
app.use(express.json());
app.post("/api/v1/patient/login", patientController.loginPatient);

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

describe("Patient Login", () => {
  beforeEach(async () => {
    db.__patients.length = 0;
    // Insert an active patient
    const password_hash = await bcrypt.hash("SecurePassword123!", 12);
    await db.insertPatient({
      id: "test-id",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@email.com",
      phone_number: "+1234567890",
      password_hash,
      date_of_birth: "1990-05-15",
      gender: "female",
      address: {
        street: "456 Main Street",
        city: "Boston",
        state: "MA",
        zip: "02101",
      },
      email_verified: false,
      phone_verified: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  it("should login successfully with correct email and password", async () => {
    const res = await request(app)
      .post("/api/v1/patient/login")
      .send({ email: "jane.smith@email.com", password: "SecurePassword123!" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.access_token).toBeDefined();
    expect(res.body.data.patient.email).toBe("jane.smith@email.com");
  });

  it("should login successfully with correct phone and password", async () => {
    const res = await request(app)
      .post("/api/v1/patient/login")
      .send({ phone_number: "+1234567890", password: "SecurePassword123!" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.access_token).toBeDefined();
    expect(res.body.data.patient.phone_number).toBe("+1234567890");
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/patient/login")
      .send({ email: "jane.smith@email.com", password: "WrongPassword!" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error_code).toBe("INVALID_CREDENTIALS");
  });

  it("should fail with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/patient/login")
      .send({ email: "" });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error_code).toBe("VALIDATION_ERROR");
  });

  it("should validate JWT token", () => {
    const payload = {
      patient_id: "test-id",
      email: "jane.smith@email.com",
      role: "patient",
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
    const req = { headers: { authorization: "Bearer " + token } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authenticatePatientToken(req, res, next);
    expect(req.user.email).toBe("jane.smith@email.com");
    expect(next).toHaveBeenCalled();
  });

  it("should handle expired JWT token", () => {
    const payload = {
      patient_id: "test-id",
      email: "jane.smith@email.com",
      role: "patient",
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "-1s" });
    const req = { headers: { authorization: "Bearer " + token } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authenticatePatientToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error_code: "TOKEN_EXPIRED" })
    );
  });
});
