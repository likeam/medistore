import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './Modal'; // ensure Modal.jsx exists

export default function SubcategoryGrid() {
  const { subcategories, setSubcategories, categories, db } = useApp();
  const [filterCat, setFilterCat] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', categoryId: '' });

  const filtered = filterCat ? subcategories.filter(s => s.categoryId === filterCat) : subcategories;

  const openModal = (item = null) => {
    if (item) {
      setEditing(item);
      setForm({ name: item.name, categoryId: item.categoryId });
    } else {
      setEditing(null);
      setForm({ name: '', categoryId: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const data = {
      id: editing ? editing.id : Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: form.name,
      categoryId: form.categoryId,
    };
    await db.put('subcategories', data);
    const updated = await db.getAll('subcategories');
    setSubcategories(updated);
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', categoryId: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subcategory?')) {
      await db.delete('subcategories', id);
      const updated = await db.getAll('subcategories');
      setSubcategories(updated);
    }
  };

  return (
    <div className="slide-in">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">Subcategories</h2>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => openModal()}
          className="btn bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No subcategories</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map(item => {
              const catName = categories.find(c => c.id === item.categoryId)?.name || item.categoryId;
              return (
                <li key={item.id} className="flex justify-between items-center px-5 py-3 hover:bg-gray-50">
                  <span>
                    {item.name}
                    <span className="text-xs text-gray-400 ml-2">(cat: {catName})</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 className="text-lg font-semibold mb-4">
            {editing ? 'Edit' : 'Add'} Subcategory
          </h3>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Tablets"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
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