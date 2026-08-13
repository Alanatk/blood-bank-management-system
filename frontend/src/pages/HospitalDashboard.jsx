import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, Search, PlusCircle, CheckCircle2, Clock, XCircle, AlertCircle, Loader2, Filter } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Check Blood State
  const [searchBg, setSearchBg] = useState('A+');
  const [searchUnits, setSearchUnits] = useState(1);

  // Request Form State
  const [requestForm, setRequestForm] = useState({
    blood_group: 'A+',
    quantity: 1,
    reason: '',
    required_date: new Date().toISOString().split('T')[0],
  });

  // Filter State
  const [statusFilter, setStatusFilter] = useState('All');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [reqRes, invRes] = await Promise.all([
        api.get(`/requests?hospital_id=${user.id}`),
        api.get('/inventory'),
      ]);

      if (reqRes.data && reqRes.data.success) setRequests(reqRes.data.data);
      if (invRes.data && invRes.data.success) setInventory(invRes.data.data);
    } catch (err) {
      console.error('Failed to load hospital data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      const res = await api.post('/requests', {
        hospital_id: user.id,
        blood_group: requestForm.blood_group,
        quantity: requestForm.quantity,
        reason: requestForm.reason,
        required_date: requestForm.required_date,
      });

      if (res.data && res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        setRequestForm({
          blood_group: 'A+',
          quantity: 1,
          reason: '',
          required_date: new Date().toISOString().split('T')[0],
        });
        fetchData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit request.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate stock status for checker
  const selectedInventory = inventory.find((i) => i.blood_group === searchBg);
  const availableUnits = selectedInventory ? selectedInventory.units_available : 0;
  const numSearchUnits = parseInt(searchUnits) || 1;
  const isSufficient = availableUnits >= numSearchUnits;

  // Filtered requests list
  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter.toLowerCase();
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Hospital Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md flex items-center justify-center text-indigo-400">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-black">{user?.name}</h1>
              <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border border-indigo-400/30">
                Hospital
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <div className="text-xs font-bold text-slate-300 uppercase">Pending</div>
            <div className="text-lg font-black text-amber-300">{pendingCount}</div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <div className="text-xs font-bold text-slate-300 uppercase">Approved</div>
            <div className="text-lg font-black text-emerald-300">{approvedCount}</div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
            <div className="text-xs font-bold text-slate-300 uppercase">Rejected</div>
            <div className="text-lg font-black text-rose-300">{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center space-x-2 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blood Stock Checker Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <span>Search Inventory Stock</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group</label>
              <select
                value={searchBg}
                onChange={(e) => setSearchBg(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Required Units</label>
              <input
                type="number"
                min="1"
                value={searchUnits}
                onChange={(e) => setSearchUnits(e.target.value === '' ? '' : parseInt(e.target.value) || '')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-medium">Availability Result:</div>
              <div
                className={`mt-2 p-3.5 rounded-2xl flex items-center space-x-2 text-sm font-bold ${
                  isSufficient
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {isSufficient ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>
                      Sufficient Stock Available ({availableUnits} units in bank)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <span>
                      Insufficient Stock ({availableUnits} units available, requested {searchUnits})
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Blood Request Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-rose-600" />
            <span>Submit Blood Request</span>
          </h3>

          <form onSubmit={handleCreateRequest} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group *</label>
              <select
                value={requestForm.blood_group}
                onChange={(e) => setRequestForm({ ...requestForm, blood_group: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity (Units) *</label>
              <input
                type="number"
                min="1"
                required
                value={requestForm.quantity}
                onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value === '' ? '' : parseInt(e.target.value) || '' })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Required Date</label>
              <input
                type="date"
                value={requestForm.required_date}
                onChange={(e) => setRequestForm({ ...requestForm, required_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason / Case Details</label>
              <input
                type="text"
                placeholder="e.g. Emergency Surgery / Trauma Patient"
                value={requestForm.reason}
                onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Submit Request to Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hospital Request History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Hospital Request History</span>
          </h3>

          {/* Status Filters */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
            <span>Loading request history...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
            No blood requests found matching filter '{statusFilter}'.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Req ID</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Required Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-400">#{r.id}</td>
                    <td className="p-3 font-extrabold text-rose-600">{r.blood_group}</td>
                    <td className="p-3 font-bold text-slate-800">{r.quantity} units</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{r.reason || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{r.required_date || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`badge-${r.status}`}>{r.status}</span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
