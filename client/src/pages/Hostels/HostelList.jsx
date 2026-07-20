import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { hostelService } from '../../services/hostelService.js';
import { toast } from '../../utils/toast.js';
import { FiHome, FiPlus, FiUserPlus, FiUserMinus } from 'react-icons/fi';

export const HostelList = () => {
  const { role, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  
  // Forms state
  const [newRoom, setNewRoom] = useState({ roomNumber: '', block: 'Block A', type: 'Shared' });
  const [allocationForm, setAllocationForm] = useState({ roomId: '', studentId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryRes = await hostelService.getHostelSummary();
      setSummary(summaryRes.summary);
      
      const roomsRes = await hostelService.getRooms();
      setRooms(roomsRes.rooms || []);
    } catch (err) {
      toast.error('Failed to load hostel summary');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.roomNumber || !newRoom.block) {
      return toast.error('Required fields: Room Number, Block');
    }
    try {
      const res = await hostelService.createRoom(newRoom);
      if (res.success) {
        toast.success('Hostel room added successfully!');
        setRooms([...rooms, res.room]);
        setShowAddModal(false);
        setNewRoom({ roomNumber: '', block: 'Block A', type: 'Shared' });
        
        // Refresh summary
        const summaryRes = await hostelService.getHostelSummary();
        setSummary(summaryRes.summary);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add room');
    }
  };

  const handleOpenAllocate = (roomId) => {
    setAllocationForm({ roomId, studentId: '' });
    setShowAllocateModal(true);
  };

  const handleAllocateRoom = async (e) => {
    e.preventDefault();
    if (!allocationForm.studentId) {
      return toast.error('Student ID is required');
    }
    try {
      const res = await hostelService.allocateRoom(allocationForm.roomId, allocationForm.studentId);
      if (res.success) {
        toast.success('Room allocated successfully!');
        setRooms(rooms.map(r => r._id === allocationForm.roomId ? res.room : r));
        setShowAllocateModal(false);
        
        // Refresh summary
        const summaryRes = await hostelService.getHostelSummary();
        setSummary(summaryRes.summary);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to allocate room');
    }
  };

  const handleVacateRoom = async (roomId) => {
    if (!window.confirm('Vacate this hostel room?')) return;
    try {
      const res = await hostelService.vacateRoom(roomId);
      if (res.success) {
        toast.success('Room vacated successfully');
        setRooms(rooms.map(r => r._id === roomId ? res.room : r));
        
        // Refresh summary
        const summaryRes = await hostelService.getHostelSummary();
        setSummary(summaryRes.summary);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to vacate room');
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const term = search.toLowerCase();
    const roomNo = `Room #${room.roomNumber}`.toLowerCase();
    const block = (room.block || '').toLowerCase();
    const type = (room.type || '').toLowerCase();
    const status = (room.status || '').toLowerCase();
    const studentId = (room.studentId || '').toLowerCase();
    return (
      roomNo.includes(term) ||
      block.includes(term) ||
      type.includes(term) ||
      status.includes(term) ||
      studentId.includes(term)
    );
  });

  if (loading) return <Loader />;

  return (
    <div>
      <Header
        title="Hostel Allocations"
        subtitle="Manage campus hostel rooms and student accommodations."
        actions={
          <div className="flex gap-2">
            {role === 'admin' && (
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FiPlus /> Add Room
              </Button>
            )}
          </div>
        }
      />

      {summary && role !== 'student' && (
        <div className="stats-grid mt-4">
          <div className="premium-stat-card" style={{ '--stat-color': 'var(--primary)', '--stat-glow-color': 'var(--primary-glow)' }}>
            <div className="stat-details">
              <span className="stat-label">Total Rooms</span>
              <span className="stat-val">{summary.totalRooms || rooms.length}</span>
              <span className="stat-desc">Registered campus hostel rooms</span>
            </div>
            <div className="stat-icon-wrapper"><FiHome /></div>
          </div>
          <div className="premium-stat-card" style={{ '--stat-color': 'var(--danger)', '--stat-glow-color': 'var(--danger-bg)' }}>
            <div className="stat-details">
              <span className="stat-label">Allocated Rooms</span>
              <span className="stat-val">{summary.allocatedRooms || rooms.filter(r => r.status === 'Allocated').length}</span>
              <span className="stat-desc">Rooms occupied by students</span>
            </div>
            <div className="stat-icon-wrapper"><FiHome /></div>
          </div>
          <div className="premium-stat-card" style={{ '--stat-color': 'var(--warning)', '--stat-glow-color': 'var(--warning-bg)' }}>
            <div className="stat-details">
              <span className="stat-label">Available Rooms</span>
              <span className="stat-val">{summary.availableRooms || rooms.filter(r => r.status === 'Available').length}</span>
              <span className="stat-desc">Ready for allocation</span>
            </div>
            <div className="stat-icon-wrapper"><FiHome /></div>
          </div>
        </div>
      )}

      {/* Room Allocations List */}
      <div className="card mt-4">
        <div className="flex justify-between items-center mb-4 flex-responsive">
          <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, margin: 0 }}>Hostel Rooms Registry</h4>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms by number, block, type, status, or student ID..."
          />
        </div>
        <Table
          headers={['Room Number', 'Block', 'Room Type', 'Status', 'Allocated Student', 'Actions']}
          data={role === 'student' ? filteredRooms.filter(r => r.studentId === user?.studentId) : filteredRooms}
          renderRow={(room) => (
            <tr key={room._id}>
              <td style={{ fontWeight: 600 }}>Room #{room.roomNumber}</td>
              <td>{room.block}</td>
              <td>{room.type}</td>
              <td>
                <span className={`badge ${room.status === 'Allocated' ? 'badge-danger' : 'badge-success'}`}>
                  {room.status}
                </span>
              </td>
              <td>{room.studentId || '-'}</td>
              <td>
                {role === 'admin' && (
                  <div className="flex gap-2">
                    {room.status === 'Available' ? (
                      <Button variant="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleOpenAllocate(room._id)}>
                        <FiUserPlus /> Allocate
                      </Button>
                    ) : (
                      <Button variant="danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleVacateRoom(room._id)}>
                        <FiUserMinus /> Vacate
                      </Button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          )}
          emptyMessage="No hostel rooms matching criteria found"
        />
      </div>

      {/* Add Room Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Hostel Room">
        <form onSubmit={handleAddRoom} className="flex flex-column gap-4">
          <Input
            label="Room Number"
            value={newRoom.roomNumber}
            onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
            placeholder="e.g. 101, 204B"
            required
          />
          <div className="form-group">
            <label className="form-label">Hostel Block</label>
            <select
              value={newRoom.block}
              onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
              className="input-custom"
              style={{ width: '100%', height: '42px' }}
            >
              <option value="Block A">Block A (Boys Hostel)</option>
              <option value="Block B">Block B (Girls Hostel)</option>
              <option value="Block C">Block C (Faculty Apartments)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Room Type</label>
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="input-custom"
              style={{ width: '100%', height: '42px' }}
            >
              <option value="Single">Single Occupancy</option>
              <option value="Shared">Shared Double Occupancy</option>
            </select>
          </div>
          <Button type="submit" variant="primary">Add Room</Button>
        </form>
      </Modal>

      {/* Allocate Room Modal */}
      <Modal isOpen={showAllocateModal} onClose={() => setShowAllocateModal(false)} title="Allocate Room to Student">
        <form onSubmit={handleAllocateRoom} className="flex flex-column gap-4">
          <Input
            label="Student ID"
            value={allocationForm.studentId}
            onChange={(e) => setAllocationForm({ ...allocationForm, studentId: e.target.value })}
            placeholder="e.g. ST-2026-0001"
            required
          />
          <Button type="submit" variant="primary">Assign Room</Button>
        </form>
      </Modal>
    </div>
  );
};

export default HostelList;
