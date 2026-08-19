import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Layout.css";

// Ledger-style index of modules. Admin/HR-only entries are filtered per role,
// same restriction the backend enforces via authorize("Admin", "HR").
const NAV_ITEMS = [
  { index: "01", label: "Dashboard", to: "/dashboard" },
  { index: "02", label: "Employees", to: "/employees" },
  { index: "03", label: "Departments", to: "/departments", roles: ["Admin", "HR"] },
  { index: "04", label: "Designations", to: "/designations", roles: ["Admin", "HR"] },
  { index: "05", label: "Attendance", to: "/attendance" },
  { index: "06", label: "Leaves", to: "/leaves" },
  { index: "07", label: "Payroll", to: "/payroll", roles: ["Admin", "HR"] },
];

export default function Layout() {
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-mark">AMDOX</span>
          <span className="sidebar-tag">ERP Ledger</span>
        </div>

        <nav className="sidebar-nav">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-index mono">{item.index}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-role">{user?.role}</span>
          </div>
          <button className="btn btn-ghost sidebar-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}