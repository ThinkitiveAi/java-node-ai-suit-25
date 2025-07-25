const { providerValidationSchema } = require("../models/provider");

describe("Provider Validation", () => {
  it("should validate a correct provider object", () => {
    const valid = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@clinic.com",
      phone_number: "+1234567890",
      password: "SecurePassword123!",
      confirm_password: "SecurePassword123!",
      specialization: "Cardiology",
      license_number: "MD123456789",
      years_of_experience: 10,
      clinic_address: {
        street: "123 Medical Center Dr",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
    };
    const { error } = providerValidationSchema.validate(valid);
    expect(error).toBeUndefined();
  });

  it("should fail if email is invalid", () => {
    const invalid = {
      ...valid,
      email: "not-an-email",
    };
    const { error } = providerValidationSchema.validate(invalid);
    expect(error).toBeDefined();
  });

  it("should fail if password is weak", () => {
    const invalid = {
      ...valid,
      password: "weak",
      confirm_password: "weak",
    };
    const { error } = providerValidationSchema.validate(invalid);
    expect(error).toBeDefined();
  });

  it("should fail if passwords do not match", () => {
    const invalid = {
      ...valid,
      confirm_password: "DifferentPassword123!",
    };
    const { error } = providerValidationSchema.validate(invalid);
    expect(error).toBeDefined();
  });
});
