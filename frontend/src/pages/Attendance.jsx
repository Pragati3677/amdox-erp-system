import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Page.css";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      const { data } = await api.get("/attendance");

      if (data.success) {
        setAttendance(data.attendances || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data } = await api.get("/attendance");

        if (active && data.success) {
          setAttendance(data.attendances || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load attendance records."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Monitor employee attendance and working hours.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setLoading(true);
            setError("");
            loadAttendance();
          }}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="page-message">
          Loading attendance...
        </div>
      )}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2>Attendance Records</h2>
              <span>{attendance.length} records</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>

              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendance.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>
                          {item.employee
                            ? `${item.employee.firstName || ""} ${
                                item.employee.lastName || ""
                              }`
                            : "N/A"}
                        </strong>
                      </td>

                      <td>
                        {item.employee?.email || "-"}
                      </td>

                      <td>
                        {formatDate(item.date)}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            item.status?.toLowerCase() || ""
                          }`}
                        >
                          {item.status || "-"}
                        </span>
                      </td>

                      <td>{item.checkIn || "-"}</td>

                      <td>{item.checkOut || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}