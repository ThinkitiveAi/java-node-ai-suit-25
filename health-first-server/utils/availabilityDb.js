const availabilities = [];
const slots = [];

async function insertAvailability(availability) {
  availabilities.push(availability);
  return availability;
}

async function getAvailabilityByProvider(provider_id, start_date, end_date) {
  return availabilities.filter(
    (a) =>
      a.provider_id === provider_id &&
      a.date >= start_date &&
      a.date <= end_date
  );
}

async function updateAvailability(id, updates) {
  const idx = availabilities.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  availabilities[idx] = {
    ...availabilities[idx],
    ...updates,
    updated_at: new Date(),
  };
  return availabilities[idx];
}

async function deleteAvailability(id) {
  const idx = availabilities.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  availabilities.splice(idx, 1);
  return true;
}

async function insertSlot(slot) {
  slots.push(slot);
  return slot;
}

async function getSlotsByAvailability(availability_id) {
  return slots.filter((s) => s.availability_id === availability_id);
}

async function getSlotById(slot_id) {
  return slots.find((s) => s.id === slot_id);
}

async function updateSlot(slot_id, updates) {
  const idx = slots.findIndex((s) => s.id === slot_id);
  if (idx === -1) return null;
  slots[idx] = { ...slots[idx], ...updates, updated_at: new Date() };
  return slots[idx];
}

async function deleteSlot(slot_id) {
  const idx = slots.findIndex((s) => s.id === slot_id);
  if (idx === -1) return false;
  slots.splice(idx, 1);
  return true;
}

async function searchSlots(criteria) {
  // Simple search for demo; extend for real use
  return slots.filter((s) => {
    if (criteria.date && s.slot_start_time.slice(0, 10) !== criteria.date)
      return false;
    if (criteria.status && s.status !== criteria.status) return false;
    // Add more filters as needed
    return true;
  });
}

module.exports = {
  insertAvailability,
  getAvailabilityByProvider,
  updateAvailability,
  deleteAvailability,
  insertSlot,
  getSlotsByAvailability,
  getSlotById,
  updateSlot,
  deleteSlot,
  searchSlots,
  __availabilities: availabilities,
  __slots: slots,
};
