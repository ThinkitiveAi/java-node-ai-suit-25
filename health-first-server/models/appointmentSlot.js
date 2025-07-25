const Joi = require("joi");
const STATUS_ENUM = ["available", "booked", "cancelled", "blocked"];

const appointmentSlotSchema = Joi.object({
  availability_id: Joi.string().required(),
  provider_id: Joi.string().required(),
  slot_start_time: Joi.string().isoDate().required(),
  slot_end_time: Joi.string().isoDate().required(),
  status: Joi.string()
    .valid(...STATUS_ENUM)
    .default("available"),
  patient_id: Joi.string().optional().allow(null),
  appointment_type: Joi.string().required(),
  booking_reference: Joi.string().optional(),
});

module.exports = {
  appointmentSlotSchema,
  STATUS_ENUM,
};
