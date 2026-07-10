import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { db } from "../services/db";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [saleBills, setSaleBills] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [cats, subs, prods, clis, supps, sales, purs] = await Promise.all([
        db.getAll("categories"),
        db.getAll("subcategories"),
        db.getAll("products"),
        db.getAll("clients"),
        db.getAll("suppliers"),
        db.getAll("saleBills"),
        db.getAll("purchaseInvoices"),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      setProducts(prods);
      setClients(clis);
      setSuppliers(supps);
      setSaleBills(sales);
      setPurchaseInvoices(purs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    categories,
    setCategories,
    subcategories,
    setSubcategories,
    products,
    setProducts,
    clients,
    setClients,
    suppliers,
    setSuppliers,
    saleBills,
    setSaleBills,
    purchaseInvoices,
    setPurchaseInvoices,
    refreshData,
    loading,
    db,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
