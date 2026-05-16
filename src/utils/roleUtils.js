export const ROLES = {
  SUPER_ADMIN:    "SUPER_ADMIN",
  ADMIN:          "ADMIN",
  HOSPITAL_STAFF: "HOSPITAL_STAFF",
  DONOR:          "DONOR",
};

export const roleUtils = {
  isSuperAdmin:    (role) => role === ROLES.SUPER_ADMIN,
  isAdmin:         (role) => role === ROLES.ADMIN,
  isHospitalStaff: (role) => role === ROLES.HOSPITAL_STAFF,
  isDonor:         (role) => role === ROLES.DONOR,

  isAdminOrAbove: (role) =>
    role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN,

  canSearchDonors: (role) =>
    [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HOSPITAL_STAFF].includes(role),

  getDashboardRoute: (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:    return "/super-admin/dashboard";
      case ROLES.ADMIN:          return "/admin/dashboard";
      case ROLES.HOSPITAL_STAFF: return "/hospital/dashboard";
      case ROLES.DONOR:          return "/donor/dashboard";
      default:                   return "/login";
    }
  },
};