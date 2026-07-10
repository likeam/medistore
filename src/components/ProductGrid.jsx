import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Rs, generateId } from "../utils/helpers";
import Modal from "./Modal";

export default function ProductGrid() {
  const { products, setProducts, categories, subcategories, db } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    stock: "",
    unit: "",
  });

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (s) => s.categoryId === form.categoryId,
  );

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const openModal = (item = null) => {
    if (item) {
      setEditing(item);
      setForm({
        name: item.name || "",
        categoryId: item.categoryId || "",
        subcategoryId: item.subcategoryId || "",
        price: item.price || "",
        stock: item.stock || "",
        unit: item.unit || "",
      });
    } else {
      setEditing(null);
      setForm({
        name: "",
        categoryId: "",
        subcategoryId: "",
        price: "",
        stock: "",
        unit: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const data = {
      id: editing ? editing.id : generateId(),
      name: form.name.trim(),
      categoryId: form.categoryId,
      subcategoryId: form.subcategoryId,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      unit: form.unit.trim(),
    };
    await db.put("products", data);
    const updated = await db.getAll("products");
    setProducts(updated);
    setShowModal(false);
    setEditing(null);
    setForm({
      name: "",
      categoryId: "",
      subcategoryId: "",
      price: "",
      stock: "",
      unit: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await db.delete("products", id);
      const updated = await db.getAll("products");
      setProducts(updated);
    }
  };

  return (
    <div className="slide-in">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm flex-1 min-w-[150px]"
        />
        <button
          onClick={() => openModal()}
          className="btn bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No products</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredProducts.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap justify-between items-center px-5 py-3 hover:bg-gray-50 gap-2"
              >
                <span>
                  <span className="font-medium">{p.name}</span>{" "}
                  <span className="text-xs text-gray-400">
                    (stock: {p.stock || 0})
                  </span>
                </span>
                <span className="text-sm text-gray-600">{Rs(p.price)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(p)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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

      {/* Modal for Add/Edit Product */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 className="text-lg font-semibold mb-4">
            {editing ? "Edit" : "Add"} Product
          </h3>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Paracetamol"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => {
                setForm({
                  ...form,
                  categoryId: e.target.value,
                  subcategoryId: "",
                });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              value={form.subcategoryId}
              onChange={(e) =>
                setForm({ ...form, subcategoryId: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              disabled={!form.categoryId}
            >
              <option value="">Select a subcategory</option>
              {filteredSubcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. tablet, bottle"
            />
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
