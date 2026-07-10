import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Rs, generateId, todayStr } from "../utils/helpers";
import Modal from "./Modal";
import PrintBill from "./PrintBill";

// Define 10 different packages – replace productId with actual IDs or use productName
const PACKAGES = [
  {
    name: "💊 Basic Medicine Pack",
    items: [
      { productId: "1783665052428_pk85", qty: 2 }, // replace with actual product IDs
      { productId: "1783675756037_r3at", qty: 1 },
      { productId: "1783679738943_4gy7", qty: 3 },
    ],
  },
  {
    name: "🧸 Child Vaccination Pack",
    items: [
      { productId: "1783665052428_pk85", qty: 1 },
      { productId: "1783675756037_r3at", qty: 2 },
    ],
  },
  {
    name: "🩹 First Aid Kit",
    items: [
      { productId: "1783665052428_pk85", qty: 1 },
      { productId: "1783675756037_r3at", qty: 1 },
      { productId: "1783679738943_4gy7", qty: 5 },
    ],
  },
  {
    name: "💉 Diabetes Care Pack",
    items: [
      { productId: "1783665052428_pk85", qty: 1 },
      { productId: "1783675756037_r3at", qty: 2 },
      { productId: "1783679738943_4gy7", qty: 1 },
    ],
  },
  {
    name: "🦠 Antibiotic Pack",
    items: [
      { productId: "1783665052428_pk85", qty: 2 },
      { productId: "1783675756037_r3at", qty: 1 },
    ],
  },
  {
    name: "🧴 Skincare Bundle",
    items: [
      { productId: "1783665052428_pk85", qty: 1 },
      { productId: "1783675756037_r3at", qty: 1 },
      { productId: "1783679738943_4gy7", qty: 1 },
    ],
  },
  {
    name: "🥤 Nutrition Pack",
    items: [
      { productId: "1783665052428_pk85", qty: 3 },
      { productId: "1783675756037_r3at", qty: 2 },
    ],
  },
  {
    name: "🧪 Lab Test Kit",
    items: [
      { productId: "1783665052428_pk85", qty: 1 },
      { productId: "1783679738943_4gy7", qty: 1 },
    ],
  },
  {
    name: "🚑 Emergency Pack",
    items: [
      { productId: "1783665052428_pk85", qty: 1 },
      { productId: "1783679862135_jljg", qty: 2 },
      { productId: "1783679738943_4gy7", qty: 1 },
    ],
  },
];

export default function SaleBill() {
  const { clients, products, setProducts, saleBills, setSaleBills, db } =
    useApp();
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [billNo, setBillNo] = useState("S-" + Date.now().toString().slice(-6));
  const [lastSavedBill, setLastSavedBill] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Package search state
  const [packageSearchTerm, setPackageSearchTerm] = useState("");
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);

  // Product search state per item is already in the items array

  // Filter packages based on search term
  const filteredPackages = PACKAGES.filter((pkg) =>
    pkg.name.toLowerCase().includes(packageSearchTerm.toLowerCase()),
  );

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

  // Load a package: add its items to the current list
  const loadPackage = (packageName) => {
    if (!packageName) return;
    const pkg = PACKAGES.find((p) => p.name === packageName);
    if (!pkg) return;

    const newItems = pkg.items
      .map((pkgItem) => {
        // Try to find by productId first, fallback to productName if needed
        let product = products.find((p) => p.id === pkgItem.productId);
        if (!product && pkgItem.productName) {
          product = products.find((p) => p.name === pkgItem.productName);
        }
        if (!product) {
          alert(
            `Product not found for package item: ${pkgItem.productId || pkgItem.productName}`,
          );
          return null;
        }
        const price = product.price || 0;
        const qty = pkgItem.qty || 1;
        const total = qty * price;
        return {
          id: generateId(),
          productId: product.id,
          productName: product.name,
          searchTerm: product.name,
          qty: qty,
          price: price,
          total: total,
          discountPercent: 0,
          showDropdown: false,
        };
      })
      .filter((item) => item !== null);

    setItems([...items, ...newItems]);
    // Clear package search
    setPackageSearchTerm("");
    setShowPackageDropdown(false);
  };

  const total = items.reduce((sum, i) => sum + (i.total || 0), 0);
  const grandTotal = total - (total * (parseFloat(discountPercent) || 0)) / 100;

  const saveBill = async () => {
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

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const currentStock = parseInt(product.stock) || 0;
        const soldQty = parseInt(item.qty) || 0;
        if (soldQty > currentStock) {
          alert(
            `Insufficient stock for ${product.name}. Available: ${currentStock}`,
          );
          return;
        }
      }
    }

    const bill = {
      id: generateId(),
      billNo,
      clientId,
      clientName: clients.find((c) => c.id === clientId)?.name || "",
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

    // Deduct stock
    for (const item of items) {
      if (!item.productId) continue;
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const currentStock = parseInt(product.stock) || 0;
        const soldQty = parseInt(item.qty) || 0;
        const newStock = Math.max(0, currentStock - soldQty);
        const updatedProduct = { ...product, stock: newStock };
        await db.put("products", updatedProduct);
      }
    }

    await db.put("saleBills", bill);
    const [updatedProducts, updatedBills] = await Promise.all([
      db.getAll("products"),
      db.getAll("saleBills"),
    ]);
    setProducts(updatedProducts);
    setSaleBills(updatedBills);

    setLastSavedBill(bill);
    setShowPrintModal(true);
    setItems([]);
    setDiscountPercent(0);
    setBillNo("S-" + Date.now().toString().slice(-6));
    setClientId("");
    setPackageSearchTerm("");
    setShowPackageDropdown(false);
  };

  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">🧾 Sale Bill</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium">Bill No:</label>
          <input
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <label className="text-sm font-medium">Client:</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Select</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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

        {/* Package Search Combobox */}
        <div className="border-t pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              📦 Package Search:
            </label>
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={packageSearchTerm}
                onChange={(e) => {
                  setPackageSearchTerm(e.target.value);
                  setShowPackageDropdown(true);
                }}
                onFocus={() => setShowPackageDropdown(true)}
                placeholder="Type to search packages..."
                className="border rounded px-3 py-1 text-sm w-full"
              />
              {showPackageDropdown && filteredPackages.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.name}
                      className="px-3 py-1 hover:bg-blue-50 cursor-pointer text-sm flex justify-between"
                      onClick={() => loadPackage(pkg.name)}
                    >
                      <span>{pkg.name}</span>
                      <span className="text-gray-400 text-xs">
                        {pkg.items.length} items
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {showPackageDropdown &&
                filteredPackages.length === 0 &&
                packageSearchTerm && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg px-3 py-1 text-sm text-gray-400">
                    No matching packages
                  </div>
                )}
            </div>
            <span className="text-xs text-gray-400">
              (Adds all items to bill)
            </span>
          </div>
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
            <label className="text-sm">Bill Disc%:</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="border rounded w-20 px-2 py-1"
            />
          </div>
          <div className="text-lg font-bold">Grand Total: {Rs(grandTotal)}</div>
          <button
            onClick={saveBill}
            className="btn bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Save Bill
          </button>
        </div>
      </div>

      {showPrintModal && (
        <Modal onClose={() => setShowPrintModal(false)}>
          <PrintBill bill={lastSavedBill} type="sale" />
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
