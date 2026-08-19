import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Page.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    designations: 0,
    attendance: 0,
    leaves: 0,
    payroll: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/employees"),
          api.get("/departments"),
          api.get("/designations"),
          api.get("/attendance"),
          api.get("/leaves"),
          api.get("/payroll"),
        ]);

        if (!active) return;

        const [
          employees,
          departments,
          designations,
          attendance,
          leaves,
          payroll,
        ] = results;

        setStats({
          employees:
            employees.status === "fulfilled"
              ? employees.value.data.count ??
                employees.value.data.employees?.length ??
                0
              : 0,

          departments:
            departments.status === "fulfilled"
              ? departments.value.data.count ??
                departments.value.data.departments?.length ??
                0
              : 0,

          designations:
            designations.status === "fulfilled"
              ? designations.value.data.count ??
                designations.value.data.designations?.length ??
                0
              : 0,

          attendance:
            attendance.status === "fulfilled"
              ? attendance.value.data.count ??
                attendance.value.data.attendances?.length ??
                0
              : 0,

          leaves:
            leaves.status === "fulfilled"
              ? leaves.value.data.count ??
                leaves.value.data.leaves?.length ??
                0
              : 0,

          payroll:
            payroll.status === "fulfilled"
              ? payroll.value.data.count ??
                payroll.value.data.payrolls?.length ??
                payroll.value.data.payroll?.length ??
                0
              : 0,
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      number: stats.employees,
      title: "Employees",
      description: "Total employees",
      link: "/employees",
    },
    {
      number: stats.departments,
      title: "Departments",
      description: "Organization departments",
      link: "/departments",
    },
    {
      number: stats.designations,
      title: "Designations",
      description: "Employee positions",
      link: "/designations",
    },
    {
      number: stats.attendance,
      title: "Attendance",
      description: "Attendance records",
      link: "/attendance",
    },
    {
      number: stats.leaves,
      title: "Leaves",
      description: "Leave requests",
      link: "/leaves",
    },
    {
      number: stats.payroll,
      title: "Payroll",
      description: "Payroll records",
      link: "/payroll",
    },
  ];

  return (
    <div className="page dashboard-page">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">
            AMDOX ERP / OVERVIEW
          </span>

          <h1>Employee Management Dashboard</h1>

          <p>
            Manage your organization's employees,
            attendance, leaves and payroll from one place.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="page-message">
          Loading dashboard...
        </div>
      ) : (
        <div className="stats-grid">
          {cards.map((card) => (
            <a
              href={card.link}
              className="stat-card"
              key={card.title}
            >
              <span className="stat-number">
                {card.number}
              </span>

              <h3>{card.title}</h3>

              <p>{card.description}</p>

              <span className="stat-link">
                Open module →
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}