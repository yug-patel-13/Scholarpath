import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import './Admin.css';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/Login');
      return;
    }
    if (!isAdmin) {
      alert('You do not have admin access');
      navigate('/');
      return;
    }

    loadData();
  }, [user, isAdmin, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, requestsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAllRequests(),
      ]);
      setStats(statsRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedRequest || !statusUpdate) return;

    try {
      await adminAPI.updateRequestStatus(selectedRequest.id, statusUpdate, adminNotes);
      alert('Request status updated successfully');
      setSelectedRequest(null);
      setStatusUpdate('');
      setAdminNotes('');
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating request status');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p className="stat-value">{stats.totalRequests}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pendingRequests}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completedRequests}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Scholarships</h3>
            <p className="stat-value">{stats.totalScholarships}</p>
          </div>
        </div>
      )}

      <div className="admin-requests">
        <h2>Form Fill Requests</h2>
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.user?.name || request.user?.email}</td>
                <td>{request.requestType}</td>
                <td>
                  <span className={`status-badge status-${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="btn-view"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Request Details</h3>
            <div className="request-details">
              <p><strong>User:</strong> {selectedRequest.user?.name || selectedRequest.user?.email}</p>
              <p><strong>Type:</strong> {selectedRequest.requestType}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Description:</strong> {selectedRequest.description || 'N/A'}</p>
              <p><strong>Contact:</strong> {selectedRequest.contactPhone || selectedRequest.contactEmail || 'N/A'}</p>
              <p><strong>Address:</strong> {selectedRequest.address || 'N/A'}</p>
              {selectedRequest.adminNotes && (
                <p><strong>Admin Notes:</strong> {selectedRequest.adminNotes}</p>
              )}
            </div>

            <div className="status-update-form">
              <label>
                Update Status:
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label>
                Admin Notes:
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </label>
              <div className="modal-actions">
                <button onClick={handleStatusUpdate} className="btn-save">
                  Save
                </button>
                <button onClick={() => setSelectedRequest(null)} className="btn-cancel">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;



