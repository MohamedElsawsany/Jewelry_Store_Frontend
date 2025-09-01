import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table,
  Badge,
  Button,
  Alert
} from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import LoadingSpinner from '../common/Loading/LoadingSpinner';

const StatCard = ({ title, value, icon, variant = 'primary', trend }) => (
  <Card className="h-100">
    <Card.Body>
      <Row className="align-items-center">
        <Col>
          <h6 className="text-uppercase text-muted mb-2">{title}</h6>
          <h3 className="mb-0">{value}</h3>
          {trend && (
            <small className={`text-${trend.positive ? 'success' : 'danger'}`}>
              <i className={`fas fa-arrow-${trend.positive ? 'up' : 'down'} me-1`}></i>
              {trend.value}% from last month
            </small>
          )}
        </Col>
        <Col xs="auto">
          <div className={`bg-${variant} text-white rounded-circle p-3`}>
            <i className={`${icon} fa-2x`}></i>
          </div>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBranches: 0,
    totalWarehouses: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats
      const usersResponse = await userService.getUsers({ page_size: 1 });
      const activeUsersResponse = await userService.getUsers({ 
        is_active: true, 
        page_size: 1 
      });

      setStats({
        totalUsers: usersResponse.data.count || 0,
        activeUsers: activeUsersResponse.data.count || 0,
        totalBranches: 0, // You can add these API calls
        totalWarehouses: 0,
      });

      // Mock recent activity - replace with actual API calls
      setRecentActivity([
        {
          id: 1,
          action: 'New user created',
          user: 'admin',
          time: '2 minutes ago',
          type: 'user'
        },
        {
          id: 2,
          action: 'Gold invoice generated',
          user: 'seller1',
          time: '15 minutes ago',
          type: 'invoice'
        },
        {
          id: 3,
          action: 'Stock updated',
          user: 'manager1',
          time: '1 hour ago',
          type: 'inventory'
        },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <Container fluid>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="text-muted">Welcome to your jewelry management system</p>
      </div>

      {/* Welcome Alert */}
      <Alert variant="info" className="mb-4">
        <i className="fas fa-info-circle me-2"></i>
        Welcome back, <strong>{user?.username}</strong>! You're logged in as{' '}
        <Badge bg="secondary">{user?.role}</Badge>
        {user?.branch_name && (
          <span> in branch <Badge bg="primary">{user?.branch_name}</Badge></span>
        )}
      </Alert>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="fas fa-users"
            variant="primary"
            trend={{ positive: true, value: 12 }}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon="fas fa-user-check"
            variant="success"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatCard
            title="Total Sales Today"
            value="$15,430"
            icon="fas fa-dollar-sign"
            variant="warning"
            trend={{ positive: true, value: 8 }}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatCard
            title="Gold Stock Value"
            value="$98,250"
            icon="fas fa-coins"
            variant="info"
          />
        </Col>
      </Row>

      <Row>
        {/* Recent Activity */}
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">Recent Activity</h5>
                </Col>
                <Col xs="auto">
                  <Button variant="outline-primary" size="sm">
                    <i className="fas fa-sync-alt me-1"></i>
                    Refresh
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Activity</th>
                    <th>User</th>
                    <th>Time</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.action}</td>
                      <td>
                        <Badge bg="secondary">{activity.user}</Badge>
                      </td>
                      <td className="text-muted">{activity.time}</td>
                      <td>
                        <Badge 
                          bg={
                            activity.type === 'user' ? 'primary' :
                            activity.type === 'invoice' ? 'success' :
                            activity.type === 'inventory' ? 'warning' : 'secondary'
                          }
                        >
                          {activity.type}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="primary" href="/invoices/gold">
                  <i className="fas fa-plus me-2"></i>
                  New Gold Invoice
                </Button>
                <Button variant="info" href="/invoices/silver">
                  <i className="fas fa-plus me-2"></i>
                  New Silver Invoice
                </Button>
                <Button variant="success" href="/customers">
                  <i className="fas fa-user-plus me-2"></i>
                  Add Customer
                </Button>
                <Button variant="warning" href="/inventory/gold-stock">
                  <i className="fas fa-boxes me-2"></i>
                  Manage Stock
                </Button>
                {(user?.role === 'Admin' || user?.role === 'Manager') && (
                  <Button variant="secondary" href="/users">
                    <i className="fas fa-users-cog me-2"></i>
                    Manage Users
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* System Status */}
          <Card className="mt-3">
            <Card.Header>
              <h5 className="mb-0">System Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Database</span>
                <Badge bg="success">Online</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>API Server</span>
                <Badge bg="success">Healthy</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Last Backup</span>
                <span className="text-muted">2 hours ago</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;