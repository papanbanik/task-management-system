import React, { useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Page = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Enter a title and a description.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await axios.post(`${API}/add`, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Couldn't add the task. Try again.",
      );
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex justify-center px-4 py-8">
        <form
          onSubmit={handleAdd}
          className="w-full max-w-xl bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add new task
          </h2>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Write API docs"
              className="field-input"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              placeholder="Document all routes"
              rows={3}
              className="field-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="field-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="field-input"
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 mb-3">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#FFCE12] px-6 py-2 rounded-full text-black font-medium hover:bg-yellow-300 disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Adding…" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
