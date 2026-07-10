export class DBService {
  constructor() {
    this.dbName = "MediStoreDB";
    this.version = 5;
    this.db = null;
    this.stores = [
      "categories",
      "subcategories",
      "products",
      "clients",
      "suppliers",
      "saleBills",
      "purchaseInvoices",
    ];
  }

  async open() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        // Create stores if they don't exist
        const stores = this.stores;
        stores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
        });
        // Additional indexes
        if (!db.objectStoreNames.contains("products")) {
          const store = db.createObjectStore("products", { keyPath: "id" });
          store.createIndex("categoryId", "categoryId", { unique: false });
          store.createIndex("subcategoryId", "subcategoryId", {
            unique: false,
          });
        }
      };
      req.onsuccess = (ev) => {
        this.db = ev.target.result;
        resolve(this.db);
      };
      req.onerror = (ev) => reject(ev.target.error);
    });
  }

  async getAll(store) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, "readonly");
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async get(store, id) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, "readonly");
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async put(store, data) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, "readwrite");
      const req = tx.objectStore(store).put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(store, id) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, "readwrite");
      const req = tx.objectStore(store).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const db = new DBService();
