import { useCallback } from "react";
import { db } from "../services/db";

export function useDB() {
  const getAll = useCallback(async (store) => db.getAll(store), []);
  const get = useCallback(async (store, id) => db.get(store, id), []);
  const put = useCallback(async (store, data) => db.put(store, data), []);
  const remove = useCallback(async (store, id) => db.delete(store, id), []);
  return { getAll, get, put, remove };
}
