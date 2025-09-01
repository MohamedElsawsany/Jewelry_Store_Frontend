import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user } = useAuth();

  return (
    <div className="d-flex">
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Sidebar onLinkClick={() => setShowSidebar(false)} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="flex-grow-1 main-content">
        <Header onToggleSidebar={() => setShowSidebar(true)} />
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;