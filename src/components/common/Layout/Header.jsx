import React from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="white" className="border-bottom px-3">
      <Button
        variant="outline-secondary"
        size="sm"
        className="d-lg-none me-2"
        onClick={onToggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </Button>

      <Navbar.Text className="flex-grow-1">
        Welcome back, <strong>{user?.username}</strong>
      </Navbar.Text>

      <Nav>
        <Dropdown align="end">
          <Dropdown.Toggle variant="outline-secondary" size="sm">
            <i className="fas fa-user-circle me-2"></i>
            {user?.username}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>
              <div>{user?.username}</div>
              <small className="text-muted">{user?.email}</small>
              <small className="text-muted d-block">{user?.role} • {user?.branch_name}</small>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item href="/profile">
              <i className="fas fa-user me-2"></i>Profile
            </Dropdown.Item>
            <Dropdown.Item href="/change-password">
              <i className="fas fa-key me-2"></i>Change Password
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout} className="text-danger">
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Header;