import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Payroll from "./pages/Payroll";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="employees"
          element={<Employees />}
        />

        <Route
          path="departments"
          element={
            <ProtectedRoute
              roles={["Admin", "HR"]}
            >
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="designations"
          element={
            <ProtectedRoute
              roles={["Admin", "HR"]}
            >
              <Designations />
            </ProtectedRoute>
          }
        />

        <Route
          path="attendance"
          element={<Attendance />}
        />

        <Route
          path="leaves"
          element={<Leaves />}
        />

        <Route
          path="payroll"
          element={
            <ProtectedRoute
              roles={["Admin", "HR"]}
            >
              <Payroll />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;