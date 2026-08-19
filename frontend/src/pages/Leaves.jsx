import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Page.css";

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data } = await api.get("/leaves");

        if (active && data.success) {
          setLeaves(data.leaves || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load leaves."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(
        `/leaves/${id}`,
        { status }
      );

      if (data.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave._id === id
              ? {
                  ...leave,
                  status,
                }
              : leave
          )
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update leave."
      );
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete this leave request?")) {
      return;
    }

    try {
      await api.delete(`/leaves/${id}`);

      setLeaves((prev) =>
        prev.filter((leave) => leave._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete leave."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p>Review and manage employee leave requests.</p>
        </div>
      </div>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-message">
          Loading leaves...
        </div>
      ) : (
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2>Leave Requests</h2>
              <span>{leaves.length} requests</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <strong>
                        {leave.employee
                          ? `${leave.employee.firstName || ""} ${
                              leave.employee.lastName || ""
                            }`
                          : leave.employee?.email ||
                            "N/A"}
                      </strong>
                    </td>

                    <td>{leave.leaveType}</td>

                    <td>
                      {formatDate(leave.fromDate)}
                    </td>

                    <td>
                      {formatDate(leave.toDate)}
                    </td>

                    <td>{leave.reason || "-"}</td>

                    <td>
                      <span className="status-badge">
                        {leave.status}
                      </span>
                    </td>

                    <td className="action-buttons">
                      {leave.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success-small"
                            onClick={() =>
                              updateStatus(
                                leave._id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger-small"
                            onClick={() =>
                              updateStatus(
                                leave._id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        className="btn btn-danger-small"
                        onClick={() =>
                          deleteLeave(leave._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-state"
                    >
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}