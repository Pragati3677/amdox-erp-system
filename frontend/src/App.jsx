import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        {/* Default route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;