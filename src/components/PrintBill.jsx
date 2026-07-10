import React from "react";
import { Rs, formatDate } from "../utils/helpers";

export default function PrintBill({ bill, type = "sale" }) {
  if (!bill) return null;

  return (
    <div
      className="print-container"
      style={{ fontFamily: "monospace", padding: "20px" }}
    >
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            borderBottom: "1px solid #000",
            paddingBottom: "8px",
          }}
        >
          🩺 Zain Pharmacy
        </h2>
        <h3 style={{ textAlign: "center" }}>
          {type === "sale" ? "SALE BILL" : "PURCHASE INVOICE"}
        </h3>
        <p>
          <strong>Bill No:</strong> {bill.billNo || bill.invoiceNo}
          <br />
          <strong>Date:</strong> {formatDate(bill.date)}
          <br />
          <strong>{type === "sale" ? "Client" : "Supplier"}:</strong>{" "}
          {bill.clientName || bill.supplierName || "N/A"}
        </p>
        <hr />
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ textAlign: "left" }}>Item</th>
              <th style={{ textAlign: "right" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items?.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ textAlign: "left" }}>{item.productName}</td>
                <td style={{ textAlign: "right" }}>{item.qty}</td>
                <td style={{ textAlign: "right" }}>{Rs(item.price)}</td>
                <td style={{ textAlign: "right" }}>{Rs(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <div>
            <p>
              <strong>Total:</strong> {Rs(bill.total)}
            </p>
            {bill.discountPercent > 0 && (
              <p>
                <strong>Discount ({bill.discountPercent}%):</strong> -
                {Rs((bill.total * bill.discountPercent) / 100)}
              </p>
            )}
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              <strong>Grand Total:</strong> {Rs(bill.grandTotal)}
            </p>
          </div>
        </div>
        <hr />
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
            marginTop: "20px",
          }}
        >
          Thank you for your business!
        </p>
      </div>
    </div>
  );
}
