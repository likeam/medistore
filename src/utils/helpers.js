export const Rs = (amount) => `Rs ${Number(amount).toFixed(2)}`;
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const generateId = () =>
  Date.now() + "_" + Math.random().toString(36).slice(2, 6);
export const formatDate = (d) => new Date(d).toLocaleDateString("en-PK");
