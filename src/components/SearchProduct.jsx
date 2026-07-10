import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Rs } from "../utils/helpers";

export default function SearchProduct() {
  const { products } = useApp();
  const [query, setQuery] = useState("");
  const results = products.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">🔍 Search Product</h2>
      <input
        type="text"
        placeholder="Type product name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
      />
      <div className="bg-white rounded-xl shadow-sm">
        {results.length === 0 ? (
          <div className="p-6 text-gray-400">No products found</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {results.map((p) => (
              <li key={p.id} className="flex justify-between px-5 py-3">
                <span>{p.name}</span>
                <span>
                  {Rs(p.price)} | Stock: {p.stock || 0}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
