const request = require("supertest");
const express = require("express");
const db = require("../utils/patientDb");
const patientController = require("../controllers/patientController");

const app = express();
app.use(express.json());
app.post("/api/v1/patient/register", patientController.registerPatient);

describe("Patient Registration Endpoint", () => {
  beforeEach(() => {
    db.__patients.length = 0;
  });

  const valid = {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@email.com",
    phone_number: "+1234567890",
    password: "SecurePassword123!",
    confirm_password: "SecurePassword123!",
    date_of_birth: "1990-05-15",
    gender: "female",
    address: {
      street: "456 Main Street",
      city: "Boston",
      state: "MA",
      zip: "02101",
    },
  };

  it("should register a patient successfully", async () => {
    const res = await request(app).post("/api/v1/patient/register").send(valid);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(valid.email);
  });

  it("should fail on duplicate email", async () => {
    await db.insertPatient({ ...valid, id: "1" });
    const res = await request(app).post("/api/v1/patient/register").send(valid);
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.email).toBeDefined();
  });

  it("should fail on duplicate phone", async () => {
    await db.insertPatient({ ...valid, id: "1", email: "other@email.com" });
    const res = await request(app).post("/api/v1/patient/register").send(valid);
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.phone_number).toBeDefined();
  });
});
