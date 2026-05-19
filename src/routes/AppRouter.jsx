import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Login    from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import SuperAdminDashboard from "../pages/super_admin/SuperAdminDashboard";
import ManageUsers         from "../pages/super_admin/ManageUsers";

import AdminDashboard    from "../pages/admin/AdminDashboard";
import AdminDonors       from "../pages/admin/AdminDonors";
import AdminRequests     from "../pages/admin/AdminRequests";
import AdminAppointments from "../pages/admin/AdminAppointments";

import HospitalDashboard    from "../pages/hospital/HospitalDashboard";
import HospitalProfile      from "../pages/hospital/HospitalProfile";
import BloodRequests        from "../pages/hospital/BloodRequests";
import HospitalInventory    from "../pages/hospital/HospitalInventory";
import HospitalAppointments from "../pages/hospital/HospitalAppointments";

import DonorDashboard      from "../pages/donor/DonorDashboard";
import DonorProfile        from "../pages/donor/DonorProfile";
import Appointments        from "../pages/donor/Appointments";
import DonorBloodRequests  from "../pages/donor/BloodRequests";

import NotFound       from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute      from "./RoleRoute";

const AppRouter = () => {
  const { isAuthenticated, dashboardRoute } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login"
          element={isAuthenticated ? <Navigate to={dashboardRoute} replace /> : <Login />}
        />
        <Route path="/register"
          element={isAuthenticated ? <Navigate to={dashboardRoute} replace /> : <Register />}
        />

        {/* Root redirect */}
        <Route path="/"
          element={<Navigate to={isAuthenticated ? dashboardRoute : "/login"} replace />}
        />

        {/* ── SUPER_ADMIN ── */}
        <Route path="/super-admin/dashboard"
          element={<RoleRoute allowedRoles={["SUPER_ADMIN"]}><SuperAdminDashboard /></RoleRoute>}
        />
        <Route path="/super-admin/users"
          element={<RoleRoute allowedRoles={["SUPER_ADMIN"]}><ManageUsers /></RoleRoute>}
        />

        {/* ── ADMIN ── */}
        <Route path="/admin/dashboard"
          element={<RoleRoute allowedRoles={["ADMIN","SUPER_ADMIN"]}><AdminDashboard /></RoleRoute>}
        />
        <Route path="/admin/donors"
          element={<RoleRoute allowedRoles={["ADMIN","SUPER_ADMIN"]}><AdminDonors /></RoleRoute>}
        />
        <Route path="/admin/requests"
          element={<RoleRoute allowedRoles={["ADMIN","SUPER_ADMIN"]}><AdminRequests /></RoleRoute>}
        />
        <Route path="/admin/appointments"
          element={<RoleRoute allowedRoles={["ADMIN","SUPER_ADMIN"]}><AdminAppointments /></RoleRoute>}
        />

        {/* ── HOSPITAL_STAFF ── */}
        <Route path="/hospital/dashboard"
          element={<RoleRoute allowedRoles={["HOSPITAL_STAFF"]}><HospitalDashboard /></RoleRoute>}
        />
        <Route path="/hospital/profile"
          element={<RoleRoute allowedRoles={["HOSPITAL_STAFF"]}><HospitalProfile /></RoleRoute>}
        />
        <Route path="/hospital/requests"
          element={<RoleRoute allowedRoles={["HOSPITAL_STAFF"]}><BloodRequests /></RoleRoute>}
        />
        <Route path="/hospital/inventory"
          element={<RoleRoute allowedRoles={["HOSPITAL_STAFF"]}><HospitalInventory /></RoleRoute>}
        />
        <Route path="/hospital/appointments"
          element={<RoleRoute allowedRoles={["HOSPITAL_STAFF"]}><HospitalAppointments /></RoleRoute>}
        />

        {/* ── DONOR ── */}
        <Route path="/donor/dashboard"
          element={<RoleRoute allowedRoles={["DONOR"]}><DonorDashboard /></RoleRoute>}
        />
        <Route path="/donor/profile"
          element={<RoleRoute allowedRoles={["DONOR"]}><DonorProfile /></RoleRoute>}
        />
        <Route path="/donor/appointments"
          element={<RoleRoute allowedRoles={["DONOR"]}><Appointments /></RoleRoute>}
        />
        <Route path="/donor/requests"
          element={<RoleRoute allowedRoles={["DONOR"]}><DonorBloodRequests /></RoleRoute>}
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;