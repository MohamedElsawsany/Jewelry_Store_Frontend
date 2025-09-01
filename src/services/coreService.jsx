import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const coreService = {
  // Branches
  getBranches: (params) => api.get(ENDPOINTS.BRANCHES, { params }),
  createBranch: (data) => api.post(ENDPOINTS.BRANCHES, data),
  updateBranch: (id, data) => api.patch(`${ENDPOINTS.BRANCHES}${id}/`, data),
  deleteBranch: (id) => api.delete(`${ENDPOINTS.BRANCHES}${id}/`),

  // Warehouses
  getWarehouses: (params) => api.get(ENDPOINTS.WAREHOUSES, { params }),
  createWarehouse: (data) => api.post(ENDPOINTS.WAREHOUSES, data),
  updateWarehouse: (id, data) => api.patch(`${ENDPOINTS.WAREHOUSES}${id}/`, data),
  deleteWarehouse: (id) => api.delete(`${ENDPOINTS.WAREHOUSES}${id}/`),

  // Vendors
  getVendors: (params) => api.get(ENDPOINTS.VENDORS, { params }),
  createVendor: (data) => api.post(ENDPOINTS.VENDORS, data),
  updateVendor: (id, data) => api.patch(`${ENDPOINTS.VENDORS}${id}/`, data),
  deleteVendor: (id) => api.delete(`${ENDPOINTS.VENDORS}${id}/`),

  // Customers
  getCustomers: (params) => api.get(ENDPOINTS.CUSTOMERS, { params }),
  createCustomer: (data) => api.post(ENDPOINTS.CUSTOMERS, data),
  updateCustomer: (id, data) => api.patch(`${ENDPOINTS.CUSTOMERS}${id}/`, data),
  deleteCustomer: (id) => api.delete(`${ENDPOINTS.CUSTOMERS}${id}/`),

  // Sellers
  getSellers: (params) => api.get(ENDPOINTS.SELLERS, { params }),
  createSeller: (data) => api.post(ENDPOINTS.SELLERS, data),
  updateSeller: (id, data) => api.patch(`${ENDPOINTS.SELLERS}${id}/`, data),
  deleteSeller: (id) => api.delete(`${ENDPOINTS.SELLERS}${id}/`),

  // Warehouse Transactions
  getWarehouseTransactions: (params) => api.get(ENDPOINTS.WAREHOUSE_TRANSACTIONS, { params }),
  createWarehouseTransaction: (data) => api.post(ENDPOINTS.WAREHOUSE_TRANSACTIONS, data),
  updateWarehouseTransaction: (id, data) => api.patch(`${ENDPOINTS.WAREHOUSE_TRANSACTIONS}${id}/`, data),
  deleteWarehouseTransaction: (id) => api.delete(`${ENDPOINTS.WAREHOUSE_TRANSACTIONS}${id}/`),
};