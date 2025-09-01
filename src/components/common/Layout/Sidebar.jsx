import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../../hooks/useAuth';

const Sidebar = ({ onLinkClick }) => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/dashboard',
      roles: ['Admin', 'Manager', 'Employee']
    },
    {
      title: 'User Management',
      icon: 'fas fa-users',
      path: '/users',
      roles: ['Admin', 'Manager']
    },
    {
      title: 'Core Data',
      icon: 'fas fa-database',
      children: [
        { title: 'Branches', path: '/branches', roles: ['Admin', 'Manager'] },
        { title: 'Warehouses', path: '/warehouses', roles: ['Admin', 'Manager'] },
        { title: 'Vendors', path: '/vendors', roles: ['Admin', 'Manager'] },
        { title: 'Customers', path: '/customers', roles: ['Admin', 'Manager', 'Employee'] },
        { title: 'Sellers', path: '/sellers', roles: ['Admin', 'Manager'] },
      ]
    },
    {
      title: 'Inventory',
      icon: 'fas fa-boxes',
      children: [
        { title: 'Gold Products', path: '/inventory/gold-products', roles: ['Admin', 'Manager'] },
        { title: 'Silver Products', path: '/inventory/silver-products', roles: ['Admin', 'Manager'] },
        { title: 'Gold Stock', path: '/inventory/gold-stock', roles: ['Admin', 'Manager', 'Employee'] },
        { title: 'Silver Stock', path: '/inventory/silver-stock', roles: ['Admin', 'Manager', 'Employee'] },
      ]
    },
    {
      title: 'Invoicing',
      icon: 'fas fa-file-invoice',
      children: [
        { title: 'Gold Invoices', path: '/invoices/gold', roles: ['Admin', 'Manager', 'Employee'] },
        { title: 'Silver Invoices', path: '/invoices/silver', roles: ['Admin', 'Manager', 'Employee'] },
      ]
    },
    {
      title: 'Warehouse Transfers',
      icon: 'fas fa-exchange-alt',
      path: '/warehouse-transactions',
      roles: ['Admin', 'Manager', 'Employee']
    },
  ];

  const hasPermission = (requiredRoles) => {
    return requiredRoles.includes(user?.role);
  };

  const renderMenuItem = (item, index) => {
    if (!hasPermission(item.roles)) return null;

    if (item.children) {
      return (
        <div key={index} className="mb-2">
          <div className="px-3 py-2 text-muted small text-uppercase fw-bold">
            <i className={`${item.icon} me-2`}></i>
            {item.title}
          </div>
          {item.children.map((child, childIndex) => 
            hasPermission(child.roles) && (
              <LinkContainer key={childIndex} to={child.path}>
                <Nav.Link className="ps-4" onClick={onLinkClick}>
                  {child.title}
                </Nav.Link>
              </LinkContainer>
            )
          )}
        </div>
      );
    }

    return (
      <LinkContainer key={index} to={item.path}>
        <Nav.Link onClick={onLinkClick}>
          <i className={`${item.icon} me-2`}></i>
          {item.title}
        </Nav.Link>
      </LinkContainer>
    );
  };

  return (
    <div className="sidebar p-0" style={{ width: '250px' }}>
      <div className="p-3 border-bottom">
        <h5 className="mb-0">
          <i className="fas fa-gem me-2 text-primary"></i>
          Jewelry System
        </h5>
      </div>
      
      <Nav className="flex-column p-2">
        {menuItems.map(renderMenuItem)}
      </Nav>
    </div>
  );
};

export default Sidebar;
