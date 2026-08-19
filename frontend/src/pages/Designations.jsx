import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Page.css";

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data } = await api.get("/designations");

        if (active && data.success) {
          setDesignations(data.designations || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load designations."
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

  const addDesignation = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/designations", {
        name,
        description,
      });

      if (data.success) {
        setDesignations((prev) => [
          ...prev,
          data.designation,
        ]);

        setName("");
        setDescription("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add designation."
      );
    }
  };

  const deleteDesignation = async (id) => {
    if (!window.confirm("Delete this designation?")) return;

    try {
      await api.delete(`/designations/${id}`);

      setDesignations((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete designation."
      );
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Designations</h1>
          <p>Manage employee roles and positions.</p>
        </div>
      </div>

      <div className="form-card">
        <h2>Add Designation</h2>

        <form
          className="inline-form"
          onSubmit={addDesignation}
        >
          <input
            placeholder="Designation name"
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
            Add Designation
          </button>
        </form>
      </div>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-message">
          Loading designations...
        </div>
      ) : (
        <div className="card-grid">
          {designations.map((designation) => (
            <div
              className="info-card"
              key={designation._id}
            >
              <div className="info-card-number">
                ROLE
              </div>

              <h3>
                {designation.name ||
                  designation.title}
              </h3>

              <p>
                {designation.description ||
                  "No description available."}
              </p>

              <button
                className="btn btn-danger-small"
                onClick={() =>
                  deleteDesignation(
                    designation._id
                  )
                }
              >
                Delete
              </button>
            </div>
          ))}

          {designations.length === 0 && (
            <div className="page-message">
              No designations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}