import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Rs, formatDate } from "../../utils/helpers";
import Modal from "../Modal";
import PrintBill from "../PrintBill";

export default function TransactionReport({ dateRange }) {
  const { saleBills, purchaseInvoices } = useApp();
  const [selectedBill, setSelectedBill] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const { from, to } = dateRange;

  // Combine and sort transactions
  const sales = saleBills
    .filter((b) => b.date >= from && b.date <= to)
    .map((b) => ({
      ...b,
      type: "sale",
      ref: b.billNo,
      clientSupplier: b.clientName || "N/A",
    }));

  const purchases = purchaseInvoices
    .filter((b) => b.date >= from && b.date <= to)
    .map((b) => ({
      ...b,
      type: "purchase",
      ref: b.invoiceNo,
      clientSupplier: b.supplierName || "N/A",
    }));

  const allTransactions = [...sales, ...purchases].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const handlePrint = (bill) => {
    setSelectedBill(bill);
    setShowPrintModal(true);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="font-semibold text-lg mb-2">
        Transactions ({from} – {to})
      </h3>

      {allTransactions.length === 0 ? (
        <p className="text-gray-400 text-sm">No transactions in this period</p>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {allTransactions.map((t) => (
            <li
              key={t.id}
              className="py-3 flex flex-wrap justify-between items-center gap-2"
            >
              <div className="flex-1 min-w-[200px]">
                <span className="font-medium">
                  {t.type === "sale" ? "Sale" : "Purchase"}
                </span>
                <span className="ml-2">– {t.ref}</span>
                <span className="text-gray-400 text-xs ml-2">
                  {formatDate(t.date)}
                </span>
                <span className="ml-2 text-gray-500">({t.clientSupplier})</span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={
                    t.type === "sale" ? "text-green-600" : "text-red-600"
                  }
                >
                  {Rs(t.grandTotal)}
                </span>
                <button
                  onClick={() => handlePrint(t)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <span>🖨️</span> Reprint
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <Modal onClose={() => setShowPrintModal(false)}>
          <PrintBill bill={selectedBill} type={selectedBill?.type} />
          <div className="flex justify-end mt-4 gap-2 no-print">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => setShowPrintModal(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
