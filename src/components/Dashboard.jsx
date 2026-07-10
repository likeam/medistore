import React from "react";
import { useApp } from "../context/AppContext";
import { Rs, formatDate } from "../utils/helpers";

export default function Dashboard() {
  const { products, clients, suppliers, saleBills, purchaseInvoices } =
    useApp();
  const totalSales = saleBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalPurchases = purchaseInvoices.reduce(
    (sum, b) => sum + (b.grandTotal || 0),
    0,
  );

  const stats = [
    { label: "Products", value: products.length, color: "bg-blue-500" },
    { label: "Clients", value: clients.length, color: "bg-green-500" },
    { label: "Suppliers", value: suppliers.length, color: "bg-purple-500" },
    { label: "Sales (Total)", value: Rs(totalSales), color: "bg-indigo-500" },
    {
      label: "Purchases (Total)",
      value: Rs(totalPurchases),
      color: "bg-rose-500",
    },
    { label: "Bills", value: saleBills.length, color: "bg-amber-500" },
  ];

  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-5 card-hover border border-gray-100"
          >
            <div
              className={`w-10 h-10 rounded-full ${s.color} text-white flex items-center justify-center text-lg mb-2`}
            >
              {s.value.toString().charAt(0)}
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <RecentBills
          title="Recent Sale Bills"
          bills={saleBills.slice(-5).reverse()}
          type="sale"
        />
        <RecentBills
          title="Recent Purchase Invoices"
          bills={purchaseInvoices.slice(-5).reverse()}
          type="purchase"
        />
      </div>
    </div>
  );
}

function RecentBills({ title, bills }) {
  const { Rs } = useApp();
  if (!bills.length)
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">No records</p>
      </div>
    );
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="divide-y divide-gray-100 text-sm">
        {bills.map((b) => (
          <li key={b.id} className="py-2 flex justify-between">
            <span>
              {b.billNo || b.invoiceNo}{" "}
              <span className="text-gray-400 text-xs">
                {formatDate(b.date)}
              </span>
            </span>
            <span className="font-medium">RS {b.grandTotal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
