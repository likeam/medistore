import React from "react";
import { useApp } from "../../context/AppContext";
import { Rs } from "../../utils/helpers";

export default function DailyReport({ date }) {
  const { saleBills, purchaseInvoices } = useApp();
  const sales = saleBills.filter((b) => b.date === date);
  const purchases = purchaseInvoices.filter((b) => b.date === date);
  const totalSales = sales.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalPurchases = purchases.reduce(
    (sum, b) => sum + (b.grandTotal || 0),
    0,
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Sales ({date})</h3>
        <p>Bills: {sales.length}</p>
        <p>Total: {Rs(totalSales)}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Purchases ({date})</h3>
        <p>Invoices: {purchases.length}</p>
        <p>Total: {Rs(totalPurchases)}</p>
      </div>
    </div>
  );
}
