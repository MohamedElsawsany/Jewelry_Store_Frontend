import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../../hooks/useAuth';

const Sidebar = ({ onLinkClick }) => {
  const { user, loading } = useAuth();

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

  // Safe permission checking function
  const hasPermission = (requiredRoles) => {
    // Return false if no required roles, user not loaded, or user has no role
    if (!requiredRoles || !Array.isArray(requiredRoles) || !user || !user.role) {
      return false;
    }
    
    // Check if user's role is in the required roles array
    try {
      return requiredRoles.includes(user.role);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  const renderMenuItem = (item, index) => {
    // Skip if no item or no roles defined
    if (!item || !item.roles) {
      return null;
    }

    // Check permission - return null if no permission
    if (!hasPermission(item.roles)) {
      return null;
    }

    // Render parent menu item with children
    if (item.children && Array.isArray(item.children)) {
      // Filter children that user has permission to see
      const visibleChildren = item.children.filter(child => 
        child && child.roles && hasPermission(child.roles)
      );

      // Don't render parent if no visible children
      if (visibleChildren.length === 0) {
        return null;
      }

      return (
        <div key={index} className="mb-2">
          <div className="px-3 py-2 text-muted small text-uppercase fw-bold">
            <i className={`${item.icon || 'fas fa-circle'} me-2`}></i>
            {item.title}
          </div>
          {visibleChildren.map((child, childIndex) => (
            <LinkContainer key={childIndex} to={child.path || '#'}>
              <Nav.Link className="ps-4" onClick={onLinkClick}>
                {child.title}
              </Nav.Link>
            </LinkContainer>
          ))}
        </div>
      );
    }

    // Render single menu item
    return (
      <LinkContainer key={index} to={item.path || '#'}>
        <Nav.Link onClick={onLinkClick}>
          <i className={`${item.icon || 'fas fa-circle'} me-2`}></i>
          {item.title}
        </Nav.Link>
      </LinkContainer>
    );
  };

  // Show loading state while user data is being fetched
  if (loading || !user) {
    return (
      <div className="sidebar p-0" style={{ width: '250px' }}>
        <div className="p-3 border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-gem me-2 text-primary"></i>
            Jewelry System
          </h5>
        </div>
        <div className="p-3 text-center text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Loading menu...
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar p-0" style={{ width: '250px' }}>
      <div className="p-3 border-bottom">
        <h5 className="mb-0">
          <i className="fas fa-gem me-2 text-primary"></i>
          Jewelry System
        </h5>
        <small className="text-muted d-block">
          Welcome, {user.username || 'User'}
        </small>
      </div>
      
      <Nav className="flex-column p-2">
        {Array.isArray(menuItems) && menuItems.map((item, index) => renderMenuItem(item, index))}
      </Nav>
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 border-top">
          <small className="text-muted">
            Role: {user.role || 'None'}<br />
            Branch: {user.branch_name || 'None'}
          </small>
        </div>
      )}
    </div>
  );
};

export default Sidebar;