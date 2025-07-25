const Joi = require("joi");

const GENDERS = ["male", "female", "other", "prefer_not_to_say"];

const patientValidationSchema = Joi.object({
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
  date_of_birth: Joi.date()
    .less("now")
    .iso()
    .required()
    .custom((value, helpers) => {
      const ageDifMs = Date.now() - new Date(value).getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 13) {
        return helpers.error("any.custom", {
          message: "Must be at least 13 years old",
        });
      }
      return value;
    }, "Age validation"),
  gender: Joi.string()
    .valid(...GENDERS)
    .required(),
  address: Joi.object({
    street: Joi.string().max(200).required(),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(50).required(),
    zip: Joi.string()
      .pattern(/^\d{5}(-\d{4})?$/)
      .required(),
  }).required(),
  emergency_contact: Joi.object({
    name: Joi.string().max(100),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    relationship: Joi.string().max(50),
  }).optional(),
  medical_history: Joi.array().items(Joi.string()).optional(),
  insurance_info: Joi.object({
    provider: Joi.string(),
    policy_number: Joi.string(),
  }).optional(),
});

module.exports = {
  patientValidationSchema,
  GENDERS,
};
