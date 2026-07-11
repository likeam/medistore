import React from "react";

const navItems = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "categories", label: "📂 Categories" },
  { id: "subcategories", label: "📁 Subcategories" },
  { id: "products", label: "💊 Products" },
  { id: "search", label: "🔍 Search Product" },
  { id: "clients", label: "👤 Clients" },
  { id: "suppliers", label: "🏭 Suppliers" },
  { id: "sale", label: "🧾 Sale Bill" },
  { id: "purchase", label: "📄 Purchase Invoice" },
  { id: "reports", label: "📈 Reports" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-72 bg-indigo-500 border-r border-gray-200 flex-shrink-0 no-print overflow-y-auto">
      <div className="p-4 text-2xl font-bold text-white border-b">
        Zain Pharmacy
      </div>
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-3 py-4 rounded-md  transition-colors ${
              activeTab === item.id
                ? "bg-blue-50 text-indigo-600 font-bold"
                : "hover:bg-gray-100 text-gray-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
