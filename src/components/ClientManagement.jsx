import React from "react";
import { useApp } from "../context/AppContext";
import GenericGrid from "./GenericGrid";

export default function ClientManagement() {
  const { clients, setClients, db } = useApp();
  const fields = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];
  const onSave = async (data) => {
    await db.put("clients", data);
    setClients(await db.getAll("clients"));
  };
  const onDelete = async (id) => {
    await db.delete("clients", id);
    setClients(await db.getAll("clients"));
  };
  return (
    <GenericGrid
      title="Clients"
      items={clients}
      fields={fields}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}
