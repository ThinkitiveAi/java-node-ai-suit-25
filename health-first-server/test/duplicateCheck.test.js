const db = require("../utils/db");

// Helper to reset the in-memory providers array
beforeEach(() => {
  db.__providers = [];
});

describe("Duplicate Checks", () => {
  it("should detect duplicate email", async () => {
    await db.insertProvider({
      email: "a@b.com",
      phone_number: "1",
      license_number: "L1",
    });
    const found = await db.findProviderByEmail("a@b.com");
    expect(found).toBeDefined();
  });
  it("should detect duplicate phone", async () => {
    await db.insertProvider({
      email: "x@y.com",
      phone_number: "123",
      license_number: "L2",
    });
    const found = await db.findProviderByPhone("123");
    expect(found).toBeDefined();
  });
  it("should detect duplicate license", async () => {
    await db.insertProvider({
      email: "z@w.com",
      phone_number: "456",
      license_number: "L3",
    });
    const found = await db.findProviderByLicense("L3");
    expect(found).toBeDefined();
  });
});
