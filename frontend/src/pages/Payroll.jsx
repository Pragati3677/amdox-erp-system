import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Page.css";

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee: "",
    month: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data } = await api.get("/payroll");

        if (active && data.success) {
          setPayrolls(
            data.payrolls ||
              data.payroll ||
              []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load payroll."
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addPayroll = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/payroll", {
        employee: form.employee,
        month: form.month,
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances || 0),
        deductions: Number(form.deductions || 0),
      });

      if (data.success) {
        setPayrolls((prev) => [
          ...prev,
          data.payroll,
        ]);

        setForm({
          employee: "",
          month: "",
          basicSalary: "",
          allowances: "",
          deductions: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create payroll."
      );
    }
  };

  const deletePayroll = async (id) => {
    if (!window.confirm("Delete this payroll record?")) {
      return;
    }

    try {
      await api.delete(`/payroll/${id}`);

      setPayrolls((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete payroll."
      );
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Payroll</h1>
          <p>Manage employee salary and payroll records.</p>
        </div>
      </div>

      <div className="form-card">
        <h2>Create Payroll</h2>

        <form
          className="form-grid"
          onSubmit={addPayroll}
        >
          <input
            name="employee"
            placeholder="Employee ID"
            value={form.employee}
            onChange={handleChange}
            required
          />

          <input
            name="month"
            type="month"
            value={form.month}
            onChange={handleChange}
            required
          />

          <input
            name="basicSalary"
            type="number"
            placeholder="Basic Salary"
            value={form.basicSalary}
            onChange={handleChange}
            required
          />

          <input
            name="allowances"
            type="number"
            placeholder="Allowances"
            value={form.allowances}
            onChange={handleChange}
          />

          <input
            name="deductions"
            type="number"
            placeholder="Deductions"
            value={form.deductions}
            onChange={handleChange}
          />

          <button className="btn btn-primary">
            Create Payroll
          </button>
        </form>
      </div>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-message">
          Loading payroll...
        </div>
      ) : (
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2>Payroll Records</h2>
              <span>{payrolls.length} records</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payrolls.map((item) => {
                  const basic =
                    Number(item.basicSalary || 0);

                  const allowances =
                    Number(item.allowances || 0);

                  const deductions =
                    Number(item.deductions || 0);

                  const net =
                    basic +
                    allowances -
                    deductions;

                  return (
                    <tr key={item._id}>
                      <td>
                        {item.employee?.employeeId ||
                          item.employee?.email ||
                          item.employee ||
                          "-"}
                      </td>

                      <td>{item.month || "-"}</td>

                      <td>
                        ₹{basic.toLocaleString("en-IN")}
                      </td>

                      <td>
                        ₹{allowances.toLocaleString("en-IN")}
                      </td>

                      <td>
                        ₹{deductions.toLocaleString("en-IN")}
                      </td>

                      <td>
                        <strong>
                          ₹{net.toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <button
                          className="btn btn-danger-small"
                          onClick={() =>
                            deletePayroll(item._id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {payrolls.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-state"
                    >
                      No payroll records found.
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