import React from "react";
import { useApp } from "../../context/AppContext";
import { Rs } from "../../utils/helpers";

export default function MonthlyReport({ date }) {
  const { saleBills, purchaseInvoices } = useApp();

  // Extract year and month from the given date
  const [year, month] = date.split("-");
  const monthStr = `${year}-${month}`;

  const sales = saleBills.filter((b) => b.date.startsWith(monthStr));
  const purchases = purchaseInvoices.filter((b) => b.date.startsWith(monthStr));

  const totalSales = sales.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalPurchases = purchases.reduce(
    (sum, b) => sum + (b.grandTotal || 0),
    0,
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Sales (Month {monthStr})</h3>
        <p>Bills: {sales.length}</p>
        <p>Total: {Rs(totalSales)}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-2">
          Purchases (Month {monthStr})
        </h3>
        <p>Invoices: {purchases.length}</p>
        <p>Total: {Rs(totalPurchases)}</p>
      </div>
    </div>
  );
}
