const Joi = require("joi");

// Predefined specializations (example)
const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "General Medicine",
  "Orthopedics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Urology",
];

// Joi validation schema for provider registration
const providerValidationSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[^a-zA-Z0-9]/)
    .required(),
  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
  specialization: Joi.string()
    .valid(...SPECIALIZATIONS)
    .required(),
  license_number: Joi.string().alphanum().required(),
  years_of_experience: Joi.number().integer().min(0).max(50).required(),
  clinic_address: Joi.object({
    street: Joi.string().max(200).required(),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(50).required(),
    zip: Joi.string()
      .pattern(/^\d{5}(-\d{4})?$/)
      .required(),
  }).required(),
});

module.exports = {
  providerValidationSchema,
  SPECIALIZATIONS,
};
