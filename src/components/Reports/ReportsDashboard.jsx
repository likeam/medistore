import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Rs, formatDate } from "../../utils/helpers";
import DailyReport from "./DailyReport";
import WeeklyReport from "./WeeklyReport";
import MonthlyReport from "./MonthlyReport";
import ProductWiseReport from "./ProductWiseReport";
import TransactionReport from "./TransactionReport";

export default function ReportsDashboard() {
  const { saleBills, purchaseInvoices, products } = useApp();
  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  });

  const renderReport = () => {
    switch (reportType) {
      case "daily":
        return <DailyReport date={dateRange.from} />;
      case "weekly":
        return <WeeklyReport date={dateRange.from} />;
      case "monthly":
        return <MonthlyReport date={dateRange.from} />;
      case "product":
        return (
          <ProductWiseReport
            products={products}
            saleBills={saleBills}
            dateRange={dateRange}
          />
        );
      case "transaction":
        return (
          <TransactionReport
            saleBills={saleBills}
            purchaseInvoices={purchaseInvoices}
            dateRange={dateRange}
          />
        );
      default:
        return <DailyReport date={dateRange.from} />;
    }
  };

  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">📈 Reports</h2>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="product">Product-wise</option>
          <option value="transaction">Transaction</option>
        </select>
        <label className="text-sm">From:</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="border rounded px-2 py-1 text-sm"
        />
        <label className="text-sm">To:</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>
      {renderReport()}
    </div>
  );
}
