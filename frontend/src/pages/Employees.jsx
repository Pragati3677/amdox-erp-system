import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./Page.css";

const emptyForm = {
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  salary: "",
  joiningDate: "",
  status: "Active",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/employees");

      if (data.success) {
        setEmployees(data.employees || []);
      } else {
        setError(data.message || "Failed to load employees.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchEmployees = async () => {
      try {
        const { data } = await api.get("/employees");

        if (!cancelled) {
          if (data.success) {
            setEmployees(data.employees || []);
          } else {
            setError(
              data.message || "Failed to load employees."
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load employees."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setMessage("");
    setError("");
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setMessage("");
    setError("");

    setForm({
      employeeId: employee.employeeId || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary ?? "",
      joiningDate: employee.joiningDate
        ? employee.joiningDate.substring(0, 10)
        : "",
      status: employee.status || "Active",
    });

    setEditingId(employee._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const validateForm = () => {
    if (!form.employeeId.trim()) {
      return "Employee ID is required.";
    }

    if (!form.firstName.trim()) {
      return "First name is required.";
    }

    if (!form.lastName.trim()) {
      return "Last name is required.";
    }

    if (!form.email.trim()) {
      return "Email is required.";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      return "Phone number is required.";
    }

    if (!form.department.trim()) {
      return "Department is required.";
    }

    if (!form.designation.trim()) {
      return "Designation is required.";
    }

    if (form.salary === "" || Number(form.salary) < 0) {
      return "Please enter a valid salary.";
    }

    if (!form.joiningDate) {
      return "Joining date is required.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      employeeId: form.employeeId.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      designation: form.designation.trim(),
      salary: Number(form.salary),
      joiningDate: form.joiningDate,
      status: form.status,
    };

    try {
      setSaving(true);

      if (editingId) {
        const { data } = await api.put(
          `/employees/${editingId}`,
          payload
        );

        if (data.success) {
          setMessage(
            data.message || "Employee updated successfully."
          );

          await loadEmployees();
          resetForm();
        } else {
          setError(
            data.message || "Failed to update employee."
          );
        }
      } else {
        const { data } = await api.post(
          "/employees",
          payload
        );

        if (data.success) {
          setMessage(
            data.message || "Employee added successfully."
          );

          await loadEmployees();
          resetForm();
        } else {
          setError(
            data.message || "Failed to add employee."
          );
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingId
            ? "Failed to update employee."
            : "Failed to add employee.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const { data } = await api.delete(
        `/employees/${id}`
      );

      if (data.success) {
        setMessage(
          data.message || "Employee deleted successfully."
        );

        setEmployees((prev) =>
          prev.filter((employee) => employee._id !== id)
        );
      } else {
        setError(
          data.message || "Failed to delete employee."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete employee."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEmployees = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !searchValue ||
        employee.employeeId
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.firstName
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.lastName
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.email
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.department
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.designation
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (salary) => {
    if (salary === undefined || salary === null) {
      return "-";
    }

    return Number(salary).toLocaleString("en-IN");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">02 / EMPLOYEE DIRECTORY</p>

          <h1>Employees</h1>

          <p className="page-subtitle">
            Manage employee records, employment details,
            salary and account status.
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadEmployees}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddForm}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {showForm && (
        <section className="card employee-form-card">
          <div className="card-header">
            <div>
              <h2>
                {editingId
                  ? "Edit Employee"
                  : "Add New Employee"}
              </h2>

              <p>
                Enter the employee's basic and employment
                information.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={resetForm}
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeId">
                  Employee ID
                </label>

                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  value={form.employeeId}
                  onChange={handleChange}
                  placeholder="EMP001"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="firstName">
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Pragati"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Shendage"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="employee@gmail.com"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">
                  Department
                </label>

                <input
                  id="department"
                  name="department"
                  type="text"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="IT"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation">
                  Designation
                </label>

                <input
                  id="designation"
                  name="designation"
                  type="text"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Software Developer"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">
                  Salary
                </label>

                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="50000"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="joiningDate">
                  Joining Date
                </label>

                <input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={form.joiningDate}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Employee"
                  : "Add Employee"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="card">
        <div className="card-header">
          <div>
            <h2>Employee Records</h2>

            <p>
              {filteredEmployees.length} employee
              {filteredEmployees.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="filters">
            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search employees..."
              className="search-input"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>

            <h3>No employees found</h3>

            <p>
              {employees.length === 0
                ? "Start by adding your first employee."
                : "Try changing your search or status filter."}
            </p>

            {employees.length === 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddForm}
              >
                + Add Employee
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar">
                          {employee.firstName
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {employee.firstName}{" "}
                            {employee.lastName}
                          </strong>

                          <span>
                            {employee.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-cell">
                        <span>
                          {employee.email}
                        </span>

                        <span>
                          {employee.phone}
                        </span>
                      </div>
                    </td>

                    <td>
                      {employee.department || "-"}
                    </td>

                    <td>
                      {employee.designation || "-"}
                    </td>

                    <td>
                      ₹{formatSalary(employee.salary)}
                    </td>

                    <td>
                      {formatDate(
                        employee.joiningDate
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          employee.status ===
                          "Active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-small btn-secondary"
                          onClick={() =>
                            handleEdit(employee)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-small btn-danger"
                          onClick={() =>
                            handleDelete(
                              employee._id
                            )
                          }
                          disabled={
                            deletingId ===
                            employee._id
                          }
                        >
                          {deletingId ===
                          employee._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}