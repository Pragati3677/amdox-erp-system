import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Page.css";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data } = await api.get("/departments");

        if (active && data.success) {
          setDepartments(data.departments || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load departments."
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

  const addDepartment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/departments", {
        name,
        description,
      });

      if (data.success) {
        setDepartments((prev) => [
          ...prev,
          data.department,
        ]);

        setName("");
        setDescription("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add department."
      );
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await api.delete(`/departments/${id}`);

      setDepartments((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete department."
      );
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage organization departments.</p>
        </div>
      </div>

      <div className="form-card">
        <h2>Add Department</h2>

        <form className="inline-form" onSubmit={addDepartment}>
          <input
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button className="btn btn-primary">
            Add Department
          </button>
        </form>
      </div>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-message">
          Loading departments...
        </div>
      ) : (
        <div className="card-grid">
          {departments.map((department) => (
            <div className="info-card" key={department._id}>
              <div className="info-card-number">
                DEPT
              </div>

              <h3>{department.name}</h3>

              <p>
                {department.description ||
                  "No description available."}
              </p>

              <button
                className="btn btn-danger-small"
                onClick={() =>
                  deleteDepartment(department._id)
                }
              >
                Delete
              </button>
            </div>
          ))}

          {departments.length === 0 && (
            <div className="page-message">
              No departments found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}