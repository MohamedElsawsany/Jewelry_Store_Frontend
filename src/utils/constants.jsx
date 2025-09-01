export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REFRESH: '/auth/refresh/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
  },
  USERS: '/auth/users/',
  BRANCHES: '/core/branches/',
  WAREHOUSES: '/core/warehouses/',
  VENDORS: '/core/vendors/',
  CUSTOMERS: '/core/customers/',
  SELLERS: '/core/sellers/',
  WAREHOUSE_TRANSACTIONS: '/core/warehouse-transactions/',
  GOLD_PRODUCTS: '/inventory/gold-products/',
  SILVER_PRODUCTS: '/inventory/silver-products/',
  GOLD_STOCK: '/inventory/gold-stock/',
  SILVER_STOCK: '/inventory/silver-stock/',
  GOLD_INVOICES: '/invoicing/gold-invoices/',
  SILVER_INVOICES: '/invoicing/silver-invoices/',
};

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
};

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};