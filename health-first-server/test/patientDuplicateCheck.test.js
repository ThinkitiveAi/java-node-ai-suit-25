const db = require("../utils/patientDb");

beforeEach(() => {
  db.__patients.length = 0;
});

describe("Patient Duplicate Checks", () => {
  it("should detect duplicate email", async () => {
    await db.insertPatient({ email: "a@b.com", phone_number: "1" });
    const found = await db.findPatientByEmail("a@b.com");
    expect(found).toBeDefined();
  });
  it("should detect duplicate phone", async () => {
    await db.insertPatient({ email: "x@y.com", phone_number: "123" });
    const found = await db.findPatientByPhone("123");
    expect(found).toBeDefined();
  });
});
