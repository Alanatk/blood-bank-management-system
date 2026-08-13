import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShieldCheck, Users, Droplet, HeartHandshake, Building2, Clock, CheckCircle2, XCircle, AlertCircle, Edit3, Trash2, Search, Filter, Loader2, RefreshCw } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approval'); // approval, inventory, users, donors

  // Filters & Inputs
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [donorBgFilter, setDonorBgFilter] = useState('');
  const [inventoryEdit, setInventoryEdit] = useState({ group: '', units: 0 });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, donorsRes, invRes, reqRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/users'),
        api.get('/donors'),
        api.get('/inventory'),
        api.get('/requests'),
      ]);

      if (statsRes.data && statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data && usersRes.data.success) setUsers(usersRes.data.data);
      if (donorsRes.data && donorsRes.data.success) setDonors(donorsRes.data.data);
      if (invRes.data && invRes.data.success) setInventory(invRes.data.data);
      if (reqRes.data && reqRes.data.success) setRequests(reqRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setMessage({ type: 'error', text: err.message || 'Error loading dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Request Approval / Rejection
  const handleUpdateRequestStatus = async (requestId, status) => {
    setMessage({ type: '', text: '' });
    setActionLoading(true);
    try {
      const res = await api.put(`/requests/${requestId}/status`, { status });
      if (res.data && res.data.success) {
        setMessage({ type: 'success', text: `Request #${requestId} ${status} successfully!` });
        fetchAllData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || `Failed to update request status.` });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Direct Inventory Units Update
  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    if (!inventoryEdit.group) return;
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put(`/inventory/${inventoryEdit.group}`, { units: parseInt(inventoryEdit.units) || 0 });
      if (res.data && res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        setInventoryEdit({ group: '', units: 0 });
        fetchAllData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update inventory.' });
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userName}"?`)) return;
    setMessage({ type: '', text: '' });
    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data && res.data.success) {
        setMessage({ type: 'success', text: `User "${userName}" deleted successfully.` });
        fetchAllData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete user.' });
    }
  };

  // Pending Requests list
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = !userRoleFilter || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Donors
  const filteredDonors = donors.filter((d) => {
    return !donorBgFilter || d.blood_group === donorBgFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/30 backdrop-blur-md flex items-center justify-center text-rose-300">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-black">Admin Management Control</h1>
              <span className="bg-rose-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                System Admin
              </span>
            </div>
            <p className="text-rose-200 text-sm mt-1">Supervise inventory, approve requests, and manage system accounts</p>
          </div>
        </div>

        <button
          onClick={fetchAllData}
          disabled={loading}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-md transition-all text-sm flex items-center space-x-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh System Data</span>
        </button>
      </div>

      {/* Global Message Banner */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center space-x-2 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <Users className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Users</div>
          <div className="text-xl font-black text-slate-800">{stats?.total_users || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <HeartHandshake className="w-5 h-5 text-rose-600 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-400 uppercase">Donors</div>
          <div className="text-xl font-black text-slate-800">{stats?.total_donors || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <Building2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-400 uppercase">Hospitals</div>
          <div className="text-xl font-black text-slate-800">{stats?.total_hospitals || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <Droplet className="w-5 h-5 text-red-600 mx-auto mb-1 fill-current" />
          <div className="text-[11px] font-bold text-slate-400 uppercase">Blood Units</div>
          <div className="text-xl font-black text-slate-800">{stats?.total_blood_units || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-400 uppercase">Pending Req</div>
          <div className="text-xl font-black text-amber-600">{stats?.pending_requests || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-400 uppercase">Approved</div>
          <div className="text-xl font-black text-emerald-600">{stats?.approved_requests || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center col-span-2 sm:col-span-1">
          <Droplet className="w-5 h-5 text-rose-500 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-400 uppercase">Donations</div>
          <div className="text-xl font-black text-rose-600">{stats?.total_donations || 0}</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        {[
          { id: 'approval', label: `Approval Panel (${pendingRequests.length})`, icon: Clock },
          { id: 'inventory', label: 'Blood Inventory', icon: Droplet },
          { id: 'users', label: 'Manage Users', icon: Users },
          { id: 'donors', label: 'Manage Donors', icon: HeartHandshake },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-bold text-sm flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DEDICATED APPROVAL PANEL */}
      {activeTab === 'approval' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Hospital Blood Requests (Pending Approval)</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Total Requests: {requests.length}</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">No pending blood requests!</p>
              <p className="text-xs text-slate-400">All hospital requests have been processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-3">Req ID</th>
                    <th className="p-3">Hospital Name</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Requested Units</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3">Reason / Details</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRequests.map((req) => {
                    const invItem = inventory.find((i) => i.blood_group === req.blood_group);
                    const stock = invItem ? invItem.units_available : 0;
                    const canApprove = stock >= req.quantity;

                    return (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-400">#{req.id}</td>
                        <td className="p-3 font-bold text-slate-900">{req.hospital_name}</td>
                        <td className="p-3 font-extrabold text-rose-600">{req.blood_group}</td>
                        <td className="p-3 font-bold text-slate-800">{req.quantity} units</td>
                        <td className="p-3">
                          <span
                            className={`font-extrabold text-xs px-2 py-0.5 rounded-full ${
                              canApprove ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {stock} units in bank
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{req.reason || 'N/A'}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateRequestStatus(req.id, 'approved')}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center space-x-1 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => handleUpdateRequestStatus(req.id, 'rejected')}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center space-x-1 disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Quick Edit Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-rose-600" />
              <span>Update Blood Units Stock</span>
            </h3>

            <form onSubmit={handleUpdateInventory} className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group</label>
                <select
                  value={inventoryEdit.group}
                  onChange={(e) => {
                    const group = e.target.value;
                    const existing = inventory.find((i) => i.blood_group === group);
                    setInventoryEdit({ group, units: existing ? existing.units_available : 0 });
                  }}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  required
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Available Units</label>
                <input
                  type="number"
                  min="0"
                  value={inventoryEdit.units}
                  onChange={(e) => setInventoryEdit({ ...inventoryEdit, units: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold w-32"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
              >
                Save Inventory Unit
              </button>
            </form>
          </div>

          {/* All 8 Blood Groups Display Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {inventory.map((item) => (
              <div key={item.blood_group} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-rose-600">{item.blood_group}</span>
                  <button
                    onClick={() => setInventoryEdit({ group: item.blood_group, units: item.units_available })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Edit Stock"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="text-2xl font-black text-slate-800">{item.units_available} Units</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Updated: {item.last_updated ? new Date(item.last_updated).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Registered Accounts ({filteredUsers.length})</span>
            </h3>

            {/* Search & Role Filter */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search user name/email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="">All Roles</option>
                <option value="donor">Donor</option>
                <option value="hospital">Hospital</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Registered At</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-slate-400">#{u.id}</td>
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="capitalize font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE DONORS */}
      {activeTab === 'donors' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-rose-600" />
              <span>Registered Donors List</span>
            </h3>

            <select
              value={donorBgFilter}
              onChange={(e) => setDonorBgFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Donor ID</th>
                  <th className="p-3">Donor Name</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Last Donation Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-slate-400">#{d.id}</td>
                    <td className="p-3 font-bold text-slate-900">{d.name}</td>
                    <td className="p-3 font-black text-rose-600">{d.blood_group}</td>
                    <td className="p-3 text-slate-600">{d.location || 'N/A'}</td>
                    <td className="p-3 text-slate-500 text-xs">{d.last_donation_date || 'No record'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
