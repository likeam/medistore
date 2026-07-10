import React from "react";
import { useApp } from "../../context/AppContext";
import { Rs } from "../../utils/helpers";

export default function ProductWiseReport({ dateRange }) {
  const { saleBills } = useApp();

  const { from, to } = dateRange;
  const filteredBills = saleBills.filter((b) => b.date >= from && b.date <= to);

  // Aggregate sales per product
  const productMap = {};
  filteredBills.forEach((bill) => {
    bill.items?.forEach((item) => {
      const key = item.productId || item.productName;
      if (!productMap[key]) {
        productMap[key] = { name: item.productName || key, qty: 0, amount: 0 };
      }
      productMap[key].qty += item.qty || 0;
      productMap[key].amount += item.total || 0;
    });
  });

  const productWise = Object.values(productMap).sort(
    (a, b) => b.amount - a.amount,
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="font-semibold text-lg mb-2">
        Product-wise Sales ({from} – {to})
      </h3>
      {productWise.length === 0 ? (
        <p className="text-gray-400 text-sm">No sales in this period</p>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {productWise.map((p) => (
            <li key={p.name} className="py-2 flex justify-between">
              <span>
                {p.name} (Qty: {p.qty})
              </span>
              <span>{Rs(p.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
