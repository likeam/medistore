import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CategoryGrid from "./components/CategoryGrid";
import SubcategoryGrid from "./components/SubcategoryGrid";
import ProductGrid from "./components/ProductGrid";
import SearchProduct from "./components/SearchProduct";
import ClientManagement from "./components/ClientManagement";
import SupplierManagement from "./components/SupplierManagement";
import SaleBill from "./components/SaleBill";
import PurchaseInvoice from "./components/PurchaseInvoice";
import ReportsDashboard from "./components/Reports/ReportsDashboard";

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { loading } = useApp();

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "categories":
        return <CategoryGrid />;
      case "subcategories":
        return <SubcategoryGrid />;
      case "products":
        return <ProductGrid />;
      case "search":
        return <SearchProduct />;
      case "clients":
        return <ClientManagement />;
      case "suppliers":
        return <SupplierManagement />;
      case "sale":
        return <SaleBill />;
      case "purchase":
        return <PurchaseInvoice />;
      case "reports":
        return <ReportsDashboard />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading ...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-indigo-500 shadow-sm px-6 py-24 flex items-center justify-between no-print">
          <h1 className="text-4xl font-bold text-white">
            🩺 ZAIN PHARMACY POS
          </h1>
          <div className="text-sm text-gray-300">
            {new Date().toISOString().slice(0, 10)}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-indigo-300">
          <div className="fade-in">{renderTab()}</div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
