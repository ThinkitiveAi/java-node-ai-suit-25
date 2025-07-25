const patients = [];

async function findPatientByEmail(email) {
  return patients.find((p) => p.email === email);
}

async function findPatientByPhone(phone_number) {
  return patients.find((p) => p.phone_number === phone_number);
}

async function insertPatient(patient) {
  patients.push(patient);
  return patient;
}

module.exports = {
  findPatientByEmail,
  findPatientByPhone,
  insertPatient,
  __patients: patients, // for test reset
};
