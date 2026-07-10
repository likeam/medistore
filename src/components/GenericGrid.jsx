import React, { useState } from "react";
import Modal from "./Modal";

export default function GenericGrid({
  title,
  items,
  fields,
  onSave,
  onDelete,
  idField = "id",
  labelField = "name",
}) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openModal = (item = null) => {
    if (item) {
      setEditing(item);
      setForm({ ...item });
    } else {
      setEditing(null);
      setForm({});
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const data = { ...form };
    if (!editing)
      data.id = Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    await onSave(data);
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="slide-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={() => openModal()}
          className="btn bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Add
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No items found</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li
                key={item[idField]}
                className="flex justify-between items-center px-5 py-3 hover:bg-gray-50"
              >
                <span>{item[labelField]}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(item)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item[idField])}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 className="text-lg font-semibold mb-4">
            {editing ? "Edit" : "Add"} {title.slice(0, -1)}
          </h3>
          {fields.map((f) => (
            <div key={f.key} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {f.label}
              </label>
              <input
                type={f.type || "text"}
                value={form[f.key] || ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
