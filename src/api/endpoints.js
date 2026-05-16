const BASE = "/api";

export const ENDPOINTS = {
  // Auth
  LOGIN:    `${BASE}/auth/login`,
  REGISTER: `${BASE}/auth/register`,

  // User
  ME:                  `${BASE}/users/me`,
  ALL_USERS:           `${BASE}/users`,
  USER_BY_ID:          (id)   => `${BASE}/users/${id}`,
  UPDATE_ROLE:         (id)   => `${BASE}/users/${id}/role`,
  TOGGLE_VERIFIED:     (id)   => `${BASE}/users/${id}/toggle-verified`,
  DELETE_USER:         (id)   => `${BASE}/users/${id}`,

  // Dashboard
  DASHBOARD: `${BASE}/dashboard`,

  // Donor
  DONOR_PROFILE:        `${BASE}/donors/profile`,
  DONOR_AVAILABILITY:   `${BASE}/donors/availability`,
  DONOR_SEARCH:         `${BASE}/donors/search`,
  ALL_DONORS:           `${BASE}/donors`,

  // Hospital
  HOSPITAL_PROFILE:    `${BASE}/hospitals/profile`,
  ALL_HOSPITALS:       `${BASE}/hospitals`,

  // Blood Requests
  CREATE_REQUEST:      `${BASE}/requests`,
  OPEN_REQUESTS:       `${BASE}/requests/open`,
  MY_REQUESTS:         `${BASE}/requests/my`,
  REQUEST_BY_ID:       (id)   => `${BASE}/requests/${id}`,
  SEARCH_REQUESTS:     `${BASE}/requests/search`,
  UPDATE_REQ_STATUS:   (id)   => `${BASE}/requests/${id}/status`,
  CANCEL_REQUEST:      (id)   => `${BASE}/requests/${id}/cancel`,

  // Inventory
  INVENTORY:           `${BASE}/inventory`,
  MY_INVENTORY:        `${BASE}/inventory/my`,
  HOSPITAL_INVENTORY:  (id)   => `${BASE}/inventory/hospital/${id}`,
  CHECK_INVENTORY:     `${BASE}/inventory/check`,
  DELETE_INVENTORY:    (id)   => `${BASE}/inventory/${id}`,

  // Appointments
  BOOK_APPOINTMENT:    `${BASE}/appointments`,
  MY_APPOINTMENTS:     `${BASE}/appointments/my`,
  HOSPITAL_APPTS:      `${BASE}/appointments/hospital`,
  ALL_APPOINTMENTS:    `${BASE}/appointments`,
  UPDATE_APPT_STATUS:  (id)   => `${BASE}/appointments/${id}/status`,
  CANCEL_APPOINTMENT:  (id)   => `${BASE}/appointments/${id}/cancel`,
};