import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Rs, generateId, todayStr } from "../utils/helpers";
import Modal from "./Modal";
import PrintBill from "./PrintBill";

export default function PurchaseInvoice() {
  const {
    suppliers,
    products,
    setProducts,
    purchaseInvoices,
    setPurchaseInvoices,
    db,
  } = useApp();
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState(
    "P-" + Date.now().toString().slice(-6),
  );
  const [lastSavedInvoice, setLastSavedInvoice] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        productId: "",
        productName: "",
        searchTerm: "",
        qty: 1,
        price: 0,
        total: 0,
        discountPercent: 0,
        showDropdown: false,
      },
    ]);
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;

    if (field === "searchTerm") {
      if (!value.trim()) {
        newItems[idx].productId = "";
        newItems[idx].productName = "";
        newItems[idx].price = 0;
        newItems[idx].total = 0;
      }
    }

    if (field === "productId") {
      const prod = products.find((p) => p.id === value);
      if (prod) {
        newItems[idx].productName = prod.name;
        newItems[idx].price = prod.price || 0;
        newItems[idx].searchTerm = prod.name;
      }
    }

    if (["qty", "price", "discountPercent"].includes(field)) {
      const qty = parseFloat(newItems[idx].qty) || 0;
      const price = parseFloat(newItems[idx].price) || 0;
      const disc = parseFloat(newItems[idx].discountPercent) || 0;
      const sub = qty * price;
      newItems[idx].total = sub - (sub * disc) / 100;
    }

    setItems(newItems);
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const toggleDropdown = (idx) => {
    const newItems = [...items];
    newItems[idx].showDropdown = !newItems[idx].showDropdown;
    setItems(newItems);
  };

  const selectProduct = (idx, product) => {
    const newItems = [...items];
    newItems[idx].productId = product.id;
    newItems[idx].productName = product.name;
    newItems[idx].price = product.price || 0;
    newItems[idx].searchTerm = product.name;
    newItems[idx].showDropdown = false;
    const qty = parseFloat(newItems[idx].qty) || 0;
    const price = parseFloat(newItems[idx].price) || 0;
    const disc = parseFloat(newItems[idx].discountPercent) || 0;
    const sub = qty * price;
    newItems[idx].total = sub - (sub * disc) / 100;
    setItems(newItems);
  };

  const total = items.reduce((sum, i) => sum + (i.total || 0), 0);
  const grandTotal = total - (total * (parseFloat(discountPercent) || 0)) / 100;

  const saveInvoice = async () => {
    for (const item of items) {
      if (!item.productId) {
        alert("Please select a product for all items.");
        return;
      }
      if (parseInt(item.qty) <= 0) {
        alert("Quantity must be greater than 0 for all items.");
        return;
      }
    }

    const invoice = {
      id: generateId(),
      invoiceNo,
      supplierId,
      supplierName: suppliers.find((s) => s.id === supplierId)?.name || "",
      date: todayStr(),
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        qty: i.qty,
        price: i.price,
        discountPercent: i.discountPercent,
        total: i.total,
      })),
      total,
      discountPercent: parseFloat(discountPercent) || 0,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    // Add stock
    for (const item of items) {
      if (!item.productId) continue;
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const currentStock = parseInt(product.stock) || 0;
        const purchasedQty = parseInt(item.qty) || 0;
        const newStock = currentStock + purchasedQty;
        const updatedProduct = { ...product, stock: newStock };
        await db.put("products", updatedProduct);
      }
    }

    await db.put("purchaseInvoices", invoice);
    const [updatedProducts, updatedInvoices] = await Promise.all([
      db.getAll("products"),
      db.getAll("purchaseInvoices"),
    ]);
    setProducts(updatedProducts);
    setPurchaseInvoices(updatedInvoices);

    setLastSavedInvoice(invoice);
    setShowPrintModal(true);
    setItems([]);
    setDiscountPercent(0);
    setInvoiceNo("P-" + Date.now().toString().slice(-6));
    setSupplierId("");
  };

  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">📄 Purchase Invoice</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium">Invoice No:</label>
          <input
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <label className="text-sm font-medium">Supplier:</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Select</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="btn bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        <div className="overflow-x-visible">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Disc%</th>
                <th className="p-2 text-left">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const filteredProducts = products.filter((p) =>
                  p.name
                    ?.toLowerCase()
                    .includes((item.searchTerm || "").toLowerCase()),
                );
                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-1 relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={item.searchTerm || ""}
                          onChange={(e) => {
                            updateItem(idx, "searchTerm", e.target.value);
                            if (!item.showDropdown) toggleDropdown(idx);
                          }}
                          onFocus={() => {
                            if (!item.showDropdown) toggleDropdown(idx);
                          }}
                          placeholder="Search product..."
                          className="border rounded px-1 py-1 w-32 text-sm"
                        />
                        {item.showDropdown && filteredProducts.length > 0 && (
                          <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
                            {filteredProducts.map((p) => (
                              <div
                                key={p.id}
                                className="px-3 py-1 hover:bg-blue-50 cursor-pointer text-sm flex justify-between"
                                onClick={() => selectProduct(idx, p)}
                              >
                                <span>{p.name}</span>
                                <span className="text-gray-400 text-xs">
                                  Stock: {p.stock || 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.showDropdown && filteredProducts.length === 0 && (
                          <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg px-3 py-1 text-sm text-gray-400">
                            No products found
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, "qty", e.target.value)}
                        className="border rounded w-16 px-1 py-1"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(idx, "price", e.target.value)
                        }
                        className="border rounded w-20 px-1 py-1"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={item.discountPercent}
                        onChange={(e) =>
                          updateItem(idx, "discountPercent", e.target.value)
                        }
                        className="border rounded w-16 px-1 py-1"
                      />
                    </td>
                    <td className="p-1">{Rs(item.total || 0)}</td>
                    <td>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap justify-end gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm">Invoice Disc%:</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="border rounded w-20 px-2 py-1"
            />
          </div>
          <div className="text-lg font-bold">Grand Total: {Rs(grandTotal)}</div>
          <button
            onClick={saveInvoice}
            className="btn bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Save Invoice
          </button>
        </div>
      </div>

      {showPrintModal && (
        <Modal onClose={() => setShowPrintModal(false)}>
          <PrintBill bill={lastSavedInvoice} type="purchase" />
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
