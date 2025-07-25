const providers = [];

// Simulate unique checks for email, phone, license
async function findProviderByEmail(email) {
  return providers.find((p) => p.email === email);
}

async function findProviderByPhone(phone_number) {
  return providers.find((p) => p.phone_number === phone_number);
}

async function findProviderByLicense(license_number) {
  return providers.find((p) => p.license_number === license_number);
}

async function insertProvider(provider) {
  providers.push(provider);
  return provider;
}

module.exports = {
  findProviderByEmail,
  findProviderByPhone,
  findProviderByLicense,
  insertProvider,
  __providers: providers, // for test reset
};
