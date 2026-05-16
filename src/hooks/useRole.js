import { useAuth } from "./useAuth";
import { roleUtils, ROLES } from "../utils/roleUtils";

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    isSuperAdmin:    roleUtils.isSuperAdmin(role),
    isAdmin:         roleUtils.isAdmin(role),
    isHospitalStaff: roleUtils.isHospitalStaff(role),
    isDonor:         roleUtils.isDonor(role),
    isAdminOrAbove:  roleUtils.isAdminOrAbove(role),
    canSearchDonors: roleUtils.canSearchDonors(role),
    ROLES,
  };
};