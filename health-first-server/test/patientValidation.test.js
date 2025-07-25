const { patientValidationSchema } = require("../models/patient");

describe("Patient Validation", () => {
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
    emergency_contact: {
      name: "John Smith",
      phone: "+1234567891",
      relationship: "spouse",
    },
    insurance_info: {
      provider: "Blue Cross",
      policy_number: "BC123456789",
    },
  };

  it("should validate a correct patient object", () => {
    const { error } = patientValidationSchema.validate(valid);
    expect(error).toBeUndefined();
  });

  it("should fail if email is invalid", () => {
    const invalid = { ...valid, email: "not-an-email" };
    const { error } = patientValidationSchema.validate(invalid);
    expect(error).toBeDefined();
  });

  it("should fail if password is weak", () => {
    const invalid = { ...valid, password: "weak", confirm_password: "weak" };
    const { error } = patientValidationSchema.validate(invalid);
    expect(error).toBeDefined();
  });

  it("should fail if under 13 years old", () => {
    const today = new Date();
    const recent = new Date(
      today.getFullYear() - 10,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];
    const invalid = { ...valid, date_of_birth: recent };
    const { error } = patientValidationSchema.validate(invalid);
    expect(error).toBeDefined();
  });
});
