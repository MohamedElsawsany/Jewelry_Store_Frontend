import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Table, 
  Button, 
  Form, 
  Row, 
  Col,
  Badge,
  Dropdown,
  Alert,
  Modal
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usePagination } from '../../hooks/usePagination';
import { userService } from '../../services/userService';
import Pagination from '../common/Pagination/Pagination';
import LoadingSpinner from '../common/Loading/LoadingSpinner';

const UserList = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: users,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    searchTerm,
    filters,
    setSearchTerm,
    setFilters,
    handlePageChange,
    handlePageSizeChange,
    refresh
  } = usePagination(userService.getUsers);

  const handleToggleStatus = async (user) => {
    try {
      await userService.toggleUserStatus(user.id);
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
      refresh();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await userService.deleteUser(selectedUser.id);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Manager': return 'warning';
      case 'Employee': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid>
      <div className="page-header">
        <Row className="align-items-center">
          <Col>
            <h2 className="mb-0">User Management</h2>
            <p className="text-muted mb-0">Manage system users and their permissions</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Add User
            </Button>
          </Col>
        </Row>
      </div>

      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-box"
              />
            </Col>
            <Col md={6}>
              <Row>
                <Col>
                  <Form.Select
                    value={filters.role || ''}
                    onChange={(e) => setFilters({...filters, role: e.target.value || undefined})}
                  >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    value={filters.is_active || ''}
                    onChange={(e) => setFilters({...filters, is_active: e.target.value || undefined})}
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Alert variant="danger" className="m-3">
              {error}
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Branch</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.username}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>{user.branch_name || 'No Branch'}</td>
                        <td>
                          <Badge bg={user.is_active ? 'success' : 'secondary'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString()
                            : 'Never'
                          }
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle 
                              variant="outline-secondary" 
                              size="sm"
                              id={`dropdown-${user.id}`}
                            >
                              <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item href="#" onClick={() => console.log('Edit user', user.id)}>
                                <i className="fas fa-edit me-2"></i>Edit
                              </Dropdown.Item>
                              <Dropdown.Item 
                                href="#" 
                                onClick={() => handleToggleStatus(user)}
                              >
                                <i className={`fas ${user.is_active ? 'fa-ban' : 'fa-check'} me-2`}></i>
                                {user.is_active ? 'Deactivate' : 'Activate'}
                              </Dropdown.Item>
                              <Dropdown.Item 
                                href="#" 
                                onClick={() => console.log('Change password', user.id)}
                              >
                                <i className="fas fa-key me-2"></i>Change Password
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                href="#" 
                                className="text-danger"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <i className="fas fa-trash me-2"></i>Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="p-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user <strong>{selectedUser?.username}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserList;