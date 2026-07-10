import React from "react";
import { useApp } from "../../context/AppContext";
import { Rs } from "../../utils/helpers";

export default function WeeklyReport({ date }) {
  const { saleBills, purchaseInvoices } = useApp();

  // Calculate start and end of the week (Monday to Sunday)
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1); // Monday
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday

  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  const sales = saleBills.filter((b) => b.date >= startStr && b.date <= endStr);
  const purchases = purchaseInvoices.filter(
    (b) => b.date >= startStr && b.date <= endStr,
  );

  const totalSales = sales.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalPurchases = purchases.reduce(
    (sum, b) => sum + (b.grandTotal || 0),
    0,
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-2">
          Sales (Week {startStr} – {endStr})
        </h3>
        <p>Bills: {sales.length}</p>
        <p>Total: {Rs(totalSales)}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-2">
          Purchases (Week {startStr} – {endStr})
        </h3>
        <p>Invoices: {purchases.length}</p>
        <p>Total: {Rs(totalPurchases)}</p>
      </div>
    </div>
  );
}
