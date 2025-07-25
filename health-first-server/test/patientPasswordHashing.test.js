const bcrypt = require("bcryptjs");

describe("Patient Password Hashing", () => {
  it("should hash and verify password correctly", async () => {
    const password = "SecurePassword123!";
    const hash = await bcrypt.hash(password, 12);
    expect(hash).not.toBe(password);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);
    const wrong = await bcrypt.compare("WrongPassword!", hash);
    expect(wrong).toBe(false);
  });
});
