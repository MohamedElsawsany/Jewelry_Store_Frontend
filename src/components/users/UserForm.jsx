import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Button, 
  Row, 
  Col, 
  Alert,
  Spinner 
} from 'react-bootstrap';
import { userService } from '../../services/userService';
import { coreService } from '../../services/coreService';
import { useApi } from '../../hooks/useApi';

const UserForm = ({ show, onHide, user = null, onSuccess }) => {
  const isEditing = !!user;
  const { execute, loading } = useApi();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Employee',
    branch: '',
    password: '',
    password_confirm: '',
    is_active: true
  });
  const [branches, setBranches] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (show) {
      fetchBranches();
      if (isEditing) {
        setFormData({
          username: user.username || '',
          email: user.email || '',
          role: user.role || 'Employee',
          branch: user.branch || '',
          is_active: user.is_active ?? true,
          password: '',
          password_confirm: ''
        });
      } else {
        // Reset form for new user
        setFormData({
          username: '',
          email: '',
          role: 'Employee',
          branch: '',
          password: '',
          password_confirm: '',
          is_active: true
        });
      }
      setFormErrors({});
    }
  }, [show, user, isEditing]);

  const fetchBranches = async () => {
    try {
      const response = await coreService.getBranches();
      setBranches(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Client-side validation
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = ['Username is required'];
    }
    
    if (!formData.email.trim()) {
      errors.email = ['Email is required'];
    }
    
    if (!isEditing) {
      if (!formData.password) {
        errors.password = ['Password is required'];
      }
      
      if (formData.password !== formData.password_confirm) {
        errors.password_confirm = ['Passwords do not match'];
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Prepare data for submission
      const submitData = { ...formData };
      
      // Remove password fields if editing and passwords are empty
      if (isEditing && !submitData.password) {
        delete submitData.password;
        delete submitData.password_confirm;
      }

      const apiCall = isEditing 
        ? () => userService.updateUser(user.id, submitData)
        : () => userService.createUser(submitData);

      await execute(apiCall, {
        showSuccessToast: true,
        successMessage: isEditing ? 'User updated successfully' : 'User created successfully',
        onSuccess: () => {
          onSuccess();
          onHide();
        },
        onError: (error) => {
          if (error.response?.data) {
            setFormErrors(error.response.data);
          }
        }
      });
    } catch (error) {
      // Error is handled by useApi hook
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        username: '',
        email: '',
        role: 'Employee',
        branch: '',
        password: '',
        password_confirm: '',
        is_active: true
      });
      setFormErrors({});
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className={`fas ${isEditing ? 'fa-edit' : 'fa-user-plus'} me-2`}></i>
          {isEditing ? 'Edit User' : 'Create New User'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {Object.keys(formErrors).length > 0 && (
            <Alert variant="danger">
              <Alert.Heading className="h6">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Please correct the following errors:
              </Alert.Heading>
              <ul className="mb-0 mt-2">
                {Object.entries(formErrors).map(([field, errors]) => (
                  <li key={field}>
                    <strong>{field.replace('_', ' ')}:</strong> {Array.isArray(errors) ? errors.join(', ') : errors}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Username <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  isInvalid={!!formErrors.username}
                  placeholder="Enter username"
                />
                <Form.Control.Feedback type="invalid">
                  {Array.isArray(formErrors.username) 
                    ? formErrors.username.join(', ') 
                    : formErrors.username
                  }
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  isInvalid={!!formErrors.email}
                  placeholder="Enter email address"
                />
                <Form.Control.Feedback type="invalid">
                  {Array.isArray(formErrors.email) 
                    ? formErrors.email.join(', ') 
                    : formErrors.email
                  }
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Role <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  isInvalid={!!formErrors.role}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {Array.isArray(formErrors.role) 
                    ? formErrors.role.join(', ') 
                    : formErrors.role
                  }
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Select the user's role in the system
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Branch</Form.Label>
                <Form.Select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={loading}
                  isInvalid={!!formErrors.branch}
                >
                  <option value="">Select Branch (Optional)</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {Array.isArray(formErrors.branch) 
                    ? formErrors.branch.join(', ') 
                    : formErrors.branch
                  }
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Assign user to a specific branch
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {!isEditing ? (
            // Password fields for new users
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditing}
                    disabled={loading}
                    isInvalid={!!formErrors.password}
                    placeholder="Enter password"
                    minLength={8}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(formErrors.password) 
                      ? formErrors.password.join(', ') 
                      : formErrors.password
                    }
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required={!isEditing}
                    disabled={loading}
                    isInvalid={!!formErrors.password_confirm}
                    placeholder="Confirm password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(formErrors.password_confirm) 
                      ? formErrors.password_confirm.join(', ') 
                      : formErrors.password_confirm
                    }
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          ) : (
            // Optional password change for editing
            <Row>
              <Col md={12}>
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Password Change:</strong> Leave password fields empty to keep current password. 
                  Fill both fields to change the password.
                </Alert>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password (Optional)</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    isInvalid={!!formErrors.password}
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(formErrors.password) 
                      ? formErrors.password.join(', ') 
                      : formErrors.password
                    }
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    disabled={loading}
                    isInvalid={!!formErrors.password_confirm}
                    placeholder="Confirm new password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {Array.isArray(formErrors.password_confirm) 
                      ? formErrors.password_confirm.join(', ') 
                      : formErrors.password_confirm
                    }
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="is_active"
                  label="Active User"
                  checked={formData.is_active}
                  onChange={handleChange}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Inactive users cannot log in to the system
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose} 
            disabled={loading}
          >
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} me-2`}></i>
                {isEditing ? 'Update User' : 'Create User'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserForm;