import React from "react";
import { useApp } from "../context/AppContext";
import GenericGrid from "./GenericGrid";

export default function CategoryGrid() {
  const { categories, setCategories, db } = useApp();
  const fields = [{ key: "name", label: "Category Name" }];
  const onSave = async (data) => {
    await db.put("categories", data);
    const updated = await db.getAll("categories");
    setCategories(updated);
  };
  const onDelete = async (id) => {
    await db.delete("categories", id);
    const updated = await db.getAll("categories");
    setCategories(updated);
  };
  return (
    <GenericGrid
      title="Categories"
      items={categories}
      fields={fields}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}
