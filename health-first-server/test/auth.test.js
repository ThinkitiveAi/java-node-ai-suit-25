const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("../middleware/auth");
const db = require("../utils/db");

const app = express();
app.use(express.json());
app.post(
  "/api/v1/provider/login",
  require("../controllers/providerController").loginProvider
);

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

describe("Provider Login", () => {
  beforeEach(async () => {
    db.__providers.length = 0;
    // Insert a verified, active provider
    const password_hash = await bcrypt.hash("SecurePassword123!", 12);
    await db.insertProvider({
      id: "test-id",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@clinic.com",
      phone_number: "+1234567890",
      password_hash,
      specialization: "Cardiology",
      license_number: "MD123456789",
      years_of_experience: 10,
      clinic_address: {
        street: "123 Medical Center Dr",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
      verification_status: "verified",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app)
      .post("/api/v1/provider/login")
      .send({ email: "john.doe@clinic.com", password: "SecurePassword123!" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.access_token).toBeDefined();
    expect(res.body.data.provider.email).toBe("john.doe@clinic.com");
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/provider/login")
      .send({ email: "john.doe@clinic.com", password: "WrongPassword!" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error_code).toBe("INVALID_CREDENTIALS");
  });

  it("should fail with unverified account", async () => {
    db.__providers[0].verification_status = "pending";
    const res = await request(app)
      .post("/api/v1/provider/login")
      .send({ email: "john.doe@clinic.com", password: "SecurePassword123!" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error_code).toBe("ACCOUNT_NOT_VERIFIED");
  });

  it("should fail with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/provider/login")
      .send({ email: "" });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error_code).toBe("VALIDATION_ERROR");
  });

  it("should validate JWT token", () => {
    const payload = {
      provider_id: "test-id",
      email: "john.doe@clinic.com",
      role: "provider",
      specialization: "Cardiology",
      verification_status: "verified",
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    const req = { headers: { authorization: "Bearer " + token } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authenticateToken(req, res, next);
    expect(req.user.email).toBe("john.doe@clinic.com");
    expect(next).toHaveBeenCalled();
  });

  it("should handle expired JWT token", () => {
    const payload = {
      provider_id: "test-id",
      email: "john.doe@clinic.com",
      role: "provider",
      specialization: "Cardiology",
      verification_status: "verified",
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "-1s" });
    const req = { headers: { authorization: "Bearer " + token } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error_code: "TOKEN_EXPIRED" })
    );
  });
});
