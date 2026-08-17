import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard">

      <nav className="navbar">
        <div>
          <h2>Amdox-ERP</h2>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-content">

        <h1>Dashboard</h1>

        <p>
          Welcome to the Amdox-ERP Employee Management System.
        </p>

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Departments</h3>
            <p>Manage company departments</p>
          </div>

          <div className="dashboard-card">
            <h3>Designations</h3>
            <p>Manage employee designations</p>
          </div>

          <div className="dashboard-card">
            <h3>Employees</h3>
            <p>Manage employees</p>
          </div>

          <div className="dashboard-card">
            <h3>Attendance</h3>
            <p>Manage employee attendance</p>
          </div>

          <div className="dashboard-card">
            <h3>Leave Management</h3>
            <p>Manage employee leaves</p>
          </div>

          <div className="dashboard-card">
            <h3>Payroll</h3>
            <p>Manage employee salary and payroll</p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;