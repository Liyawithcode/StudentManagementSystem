import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { transportService } from '../../services/transportService.js';
import { toast } from '../../utils/toast.js';
import { FiMapPin, FiPlus, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const TransportList = () => {
  const { role, user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [studentRoute, setStudentRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Forms state
  const [newRoute, setNewRoute] = useState({ routeNumber: '', driverName: '', driverPhone: '', vehicleNumber: '', stopsInput: '' });
  const [assignForm, setAssignForm] = useState({ routeNumber: '', studentId: '' });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [deleteRouteId, setDeleteRouteId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const routesRes = await transportService.getRoutes();
      const fetchedRoutes = routesRes.routes || [];
      setRoutes(fetchedRoutes);

      let initialSelected = null;
      if (role === 'student') {
        const studentId = user?._id || user?.studentId;
        try {
          const studentRouteRes = await transportService.getStudentRoute(studentId);
          if (studentRouteRes.success) {
            setStudentRoute(studentRouteRes.route);
            initialSelected = studentRouteRes.route;
          }
        } catch (err) {
          console.warn('Student route not found or failed to load:', err);
        }
      }

      if (!initialSelected && fetchedRoutes.length > 0) {
        initialSelected = fetchedRoutes[0];
      }
      setSelectedRoute(initialSelected);
    } catch (err) {
      console.error('Error fetching transport routes:', err);
      toast.error('Failed to load transport routes');
    } finally {
      setLoading(false);
    }
  }, [role, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!newRoute.routeNumber || !newRoute.driverName || !newRoute.vehicleNumber) {
      return toast.error('Required fields: Route Number, Driver Name, Vehicle Number');
    }
    try {
      const stops = newRoute.stopsInput ? newRoute.stopsInput.split(',').map(s => s.trim()) : [];
      const routeData = {
        routeNumber: newRoute.routeNumber,
        driverName: newRoute.driverName,
        driverPhone: newRoute.driverPhone,
        vehicleNumber: newRoute.vehicleNumber,
        stops
      };

      const res = await transportService.createRoute(routeData);
      if (res.success) {
        toast.success('Transport route created successfully!');
        const updatedRoutes = [...routes, res.route];
        setRoutes(updatedRoutes);
        if (!selectedRoute) {
          setSelectedRoute(res.route);
        }
        setShowAddModal(false);
        setNewRoute({ routeNumber: '', driverName: '', driverPhone: '', vehicleNumber: '', stopsInput: '' });
      }
    } catch (err) {
      console.error('Error creating route:', err);
      toast.error(err.message || 'Failed to create route');
    }
  };

  const handleAssignStudent = async (e) => {
    e.preventDefault();
    if (!assignForm.routeNumber || !assignForm.studentId) {
      return toast.error('Route Number and Student ID are required');
    }
    try {
      const res = await transportService.assignStudent(assignForm.routeNumber, assignForm.studentId);
      if (res.success) {
        toast.success('Student assigned to transport route!');
        setShowAssignModal(false);
        setAssignForm({ routeNumber: '', studentId: '' });

        // Refresh routes
        const routesRes = await transportService.getRoutes();
        setRoutes(routesRes.routes || []);
      }
    } catch (err) {
      console.error('Error assigning student:', err);
      toast.error(err.message || 'Failed to assign student');
    }
  };

  const handleDeleteRoute = async () => {
    try {
      const res = await transportService.deleteRoute(deleteRouteId);
      if (res.success) {
        toast.success('Transport route deleted successfully');
        const updatedRoutes = routes.filter(r => r._id !== deleteRouteId);
        setRoutes(updatedRoutes);
        if (selectedRoute?._id === deleteRouteId) {
          setSelectedRoute(updatedRoutes[0] || null);
        }
        setDeleteRouteId(null);
      }
    } catch (err) {
      console.error('Error deleting route:', err);
      toast.error(err.message || 'Failed to delete route');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Header
        title="Transport Shuttles"
        subtitle="Manage campus transport routes, vehicles, and student assignments."
        actions={
          <div className="flex gap-2">
            {role === 'admin' && (
              <>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  <FiPlus /> Create Route
                </Button>
                <Button variant="secondary" onClick={() => setShowAssignModal(true)}>
                  <FiUserPlus /> Assign Student
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Student Assigned Route Banner */}
      {role === 'student' && studentRoute && (
        <div className="welcome-banner mt-4">
          <div className="welcome-text-container">
            <h2 className="welcome-title">My Assigned Shuttle Route</h2>
            <p className="welcome-subtitle">
              You are assigned to Route #{studentRoute.routeNumber} with vehicle <strong>{studentRoute.vehicleNumber}</strong>.
            </p>
            <div className="welcome-meta-info">
              <div className="welcome-meta-item">
                <span>Driver: <strong>{studentRoute.driverName}</strong> ({studentRoute.driverPhone || 'N/A'})</span>
              </div>
              <div className="welcome-meta-item">
                <span>Stops: {studentRoute.stops?.join(' ➔ ') || 'No stops specified'}</span>
              </div>
            </div>
          </div>
          <div className="welcome-illustration"><FiMapPin /></div>
        </div>
      )}

      {/* Two Column Layout for Table and Map */}
      <div className="dashboard-details-row mt-4">
        {/* Left: Transport Routes Registry */}
        <div className="card">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Transport Routes Catalog</h4>
          <Table
            headers={['Route #', 'Vehicle #', 'Driver', 'Driver Phone', 'Route Stops', 'Actions']}
            data={routes}
            renderRow={(route) => {
              const isSelected = selectedRoute?._id === route._id;
              return (
                <tr
                  key={route._id}
                  onClick={() => setSelectedRoute(route)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'var(--primary-glow)' : 'transparent',
                    borderLeft: isSelected ? '4px solid var(--primary)' : 'none'
                  }}
                >
                  <td style={{ fontWeight: 600 }}>Route #{route.routeNumber}</td>
                  <td style={{ fontFamily: 'monospace' }}>{route.vehicleNumber}</td>
                  <td>{route.driverName}</td>
                  <td>{route.driverPhone || '-'}</td>
                  <td>{route.stops?.join(', ') || '-'}</td>
                  <td>
                    {role === 'admin' && (
                      <Button
                        variant="danger"
                        style={{ padding: '0.4rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteRouteId(route._id);
                        }}
                      >
                        <FiTrash2 />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            }}
            emptyMessage="No transport routes established at this time"
          />
        </div>

        {/* Right: Google Map Embed */}
        <div className="card flex flex-column gap-4">
          <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiMapPin style={{ color: 'var(--primary)' }} /> Route Map & Stops
          </h4>

          {selectedRoute ? (
            <div className="flex flex-column gap-3">
              <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontWeight: 600, margin: '0 0 0.5rem 0' }}>Route #{selectedRoute.routeNumber} Info</h5>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span>Vehicle: <strong>{selectedRoute.vehicleNumber}</strong></span>
                  <span>Driver: <strong>{selectedRoute.driverName}</strong> ({selectedRoute.driverPhone || 'N/A'})</span>
                  <span>Stops: <strong>{selectedRoute.stops?.join(' ➔ ') || 'None'}</strong></span>
                </div>
              </div>

              {/* Google Map Iframe Embed */}
              {selectedRoute.stops && selectedRoute.stops.length > 0 ? (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <iframe
                    title={`Google Map for Route ${selectedRoute.routeNumber}`}
                    width="100%"
                    height="320"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedRoute.stops.join(', ') + ' Station')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              ) : (
                <div className="flex flex-column items-center justify-center p-6 text-center" style={{ height: '320px', background: 'var(--bg-app)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                  <FiMapPin style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }} />
                  <span>No stops defined for this route. Add stops to see Google Map location.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-column items-center justify-center p-6 text-center" style={{ height: '400px', color: 'var(--text-muted)' }}>
              <FiMapPin style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
              <span>Select a transport route to inspect the stops & Google Map view.</span>
            </div>
          )}
        </div>
      </div>

      {/* Create Route Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Transport Route">
        <form onSubmit={handleAddRoute} className="flex flex-column gap-4">
          <Input
            label="Route Number"
            value={newRoute.routeNumber}
            onChange={(e) => setNewRoute({ ...newRoute, routeNumber: e.target.value })}
            placeholder="e.g. R-10, Route 5"
            required
          />
          <Input
            label="Driver Name"
            value={newRoute.driverName}
            onChange={(e) => setNewRoute({ ...newRoute, driverName: e.target.value })}
            placeholder="e.g. John Doe"
            required
          />
          <Input
            label="Driver Phone"
            value={newRoute.driverPhone}
            onChange={(e) => setNewRoute({ ...newRoute, driverPhone: e.target.value })}
            placeholder="e.g. +1234567890"
          />
          <Input
            label="Vehicle Number"
            value={newRoute.vehicleNumber}
            onChange={(e) => setNewRoute({ ...newRoute, vehicleNumber: e.target.value })}
            placeholder="e.g. BUS-401, SHUTTLE-3"
            required
          />
          <Input
            label="Stops (Comma Separated)"
            value={newRoute.stopsInput}
            onChange={(e) => setNewRoute({ ...newRoute, stopsInput: e.target.value })}
            placeholder="e.g. Main Gate, Library, Block A, Sports Complex"
          />
          <Button type="submit" variant="primary">Create Route</Button>
        </form>
      </Modal>

      {/* Assign Student Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Student to Route">
        <form onSubmit={handleAssignStudent} className="flex flex-column gap-4">
          <div className="form-group">
            <label className="form-label">Select Route</label>
            <select
              value={assignForm.routeNumber}
              onChange={(e) => setAssignForm({ ...assignForm, routeNumber: e.target.value })}
              className="input-custom"
              style={{ width: '100%', height: '42px' }}
              required
            >
              <option value="">-- Choose Route --</option>
              {routes.map(r => (
                <option key={r._id} value={r.routeNumber}>Route #{r.routeNumber} ({r.vehicleNumber})</option>
              ))}
            </select>
          </div>
          <Input
            label="Student ID"
            value={assignForm.studentId}
            onChange={(e) => setAssignForm({ ...assignForm, studentId: e.target.value })}
            placeholder="e.g. ST-2026-0001"
            required
          />
          <Button type="submit" variant="primary">Assign Student</Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteRouteId}
        onClose={() => setDeleteRouteId(null)}
        onConfirm={handleDeleteRoute}
        message="Are you sure you want to delete this transport route? This cannot be undone."
      />
    </div>
  );
};

export default TransportList;
