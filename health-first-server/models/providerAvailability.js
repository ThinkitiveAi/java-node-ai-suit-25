const Joi = require("joi");

const RECURRENCE_PATTERNS = ["daily", "weekly", "monthly"];
const STATUS_ENUM = [
  "available",
  "booked",
  "cancelled",
  "blocked",
  "maintenance",
];
const APPOINTMENT_TYPES = [
  "consultation",
  "follow_up",
  "emergency",
  "telemedicine",
];
const LOCATION_TYPES = ["clinic", "hospital", "telemedicine", "home_visit"];

const providerAvailabilitySchema = Joi.object({
  provider_id: Joi.string().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  start_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  end_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  timezone: Joi.string().required(),
  is_recurring: Joi.boolean().default(false),
  recurrence_pattern: Joi.string()
    .valid(...RECURRENCE_PATTERNS)
    .optional(),
  recurrence_end_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  slot_duration: Joi.number().integer().min(5).max(240).default(30),
  break_duration: Joi.number().integer().min(0).max(120).default(0),
  status: Joi.string()
    .valid(...STATUS_ENUM)
    .default("available"),
  max_appointments_per_slot: Joi.number().integer().min(1).max(20).default(1),
  appointment_type: Joi.string()
    .valid(...APPOINTMENT_TYPES)
    .default("consultation"),
  location: Joi.object({
    type: Joi.string()
      .valid(...LOCATION_TYPES)
      .required(),
    address: Joi.string()
      .max(200)
      .when("type", {
        is: Joi.valid("clinic", "hospital", "home_visit"),
        then: Joi.required(),
      }),
    room_number: Joi.string().max(50).optional(),
  }).required(),
  pricing: Joi.object({
    base_fee: Joi.number().precision(2).min(0),
    insurance_accepted: Joi.boolean(),
    currency: Joi.string().default("USD"),
  }).optional(),
  notes: Joi.string().max(500).optional(),
  special_requirements: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  providerAvailabilitySchema,
  RECURRENCE_PATTERNS,
  STATUS_ENUM,
  APPOINTMENT_TYPES,
  LOCATION_TYPES,
};
