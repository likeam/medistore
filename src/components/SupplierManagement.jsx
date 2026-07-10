import React from "react";
import { useApp } from "../context/AppContext";
import GenericGrid from "./GenericGrid";

export default function SupplierManagement() {
  const { suppliers, setSuppliers, db } = useApp();
  const fields = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];
  const onSave = async (data) => {
    await db.put("suppliers", data);
    setSuppliers(await db.getAll("suppliers"));
  };
  const onDelete = async (id) => {
    await db.delete("suppliers", id);
    setSuppliers(await db.getAll("suppliers"));
  };
  return (
    <GenericGrid
      title="Suppliers"
      items={suppliers}
      fields={fields}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}
