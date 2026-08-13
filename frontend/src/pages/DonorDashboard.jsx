import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Droplet, MapPin, Calendar, Heart, PlusCircle, CheckCircle2, Clock, AlertCircle, Edit3, Loader2, Award, Siren, Zap } from 'lucide-react';
import DonationCertificateModal from '../components/DonationCertificateModal';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const [donations, setDonations] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDonation, setIsAddingDonation] = useState(false);
  const [selectedCertDonation, setSelectedCertDonation] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    blood_group: user?.blood_group || 'A+',
    location: user?.location || '',
    last_donation_date: user?.last_donation_date || '',
  });

  // Donation Form State
  const [donationForm, setDonationForm] = useState({
    units: 1,
    donation_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDonations();
    fetchEmergencyAlerts();
  }, [user]);

  const fetchDonations = async () => {
    if (!user || !user.donor_id) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/donations?donor_id=${user.donor_id}`);
      if (res.data && res.data.success) {
        setDonations(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmergencyAlerts = async () => {
    if (!user || !user.donor_id) return;
    try {
      const res = await api.get(`/donor/emergency-alerts?donor_id=${user.donor_id}`);
      if (res.data && res.data.success) {
        setEmergencyAlerts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching emergency alerts:', err);
    }
  };

  const handlePledgeDonation = async (requestId) => {
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/donor/pledge-donation', {
        request_id: requestId,
        donor_id: user.donor_id,
      });
      if (res.data && res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchDonations();
        fetchEmergencyAlerts();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to pledge donation.' });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put(`/donors/${user.donor_id}`, profileForm);
      if (res.data && res.data.success) {
        updateUser({
          name: profileForm.name,
          blood_group: profileForm.blood_group,
          location: profileForm.location,
          last_donation_date: profileForm.last_donation_date,
        });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    }
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/donations', {
        donor_id: user.donor_id,
        blood_group: user.blood_group || 'A+',
        units: parseInt(donationForm.units) || 1,
        donation_date: donationForm.donation_date,
        notes: donationForm.notes,
      });

      if (res.data && res.data.success) {
        setMessage({ type: 'success', text: 'Donation recorded and inventory updated!' });
        setIsAddingDonation(false);
        fetchDonations();
        updateUser({ last_donation_date: donationForm.donation_date });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to record donation.' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Donor Banner Header */}
      <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-inner">
              {user?.blood_group || 'A+'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl md:text-3xl font-black">{user?.name}</h1>
                <span className="bg-rose-500/40 text-rose-100 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border border-rose-400/30">
                  Donor
                </span>
              </div>
              <p className="text-rose-100/80 text-sm mt-1 flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-rose-300" />
                  <span>{user?.location || 'Location Not Set'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-rose-300 fill-current" />
                  <span>Donor ID #{user?.donor_id || user?.id}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-md transition-all text-sm flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={() => setIsAddingDonation(!isAddingDonation)}
              className="px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-xl shadow-md transition-all text-sm flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>Log Donation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Blood Donation Requests Banner */}
      {emergencyAlerts.length > 0 && (
        <div className="space-y-3">
          {emergencyAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 rounded-3xl shadow-xl border-2 border-red-400/50 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
                  <Siren className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 bg-white text-red-700 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Emergency Blood Request</span>
                  </div>
                  <h3 className="text-xl font-black">{alert.hospital_name} needs Type {alert.blood_group} Blood</h3>
                  <p className="text-red-100 text-xs mt-1">
                    Requested Quantity: <span className="font-bold text-white">{alert.quantity} units</span> • Required By: <span className="font-bold text-white">{alert.required_date || 'Urgent'}</span>
                  </p>
                  {alert.reason && <p className="text-xs italic text-red-200 mt-1">"{alert.reason}"</p>}
                </div>
              </div>

              <button
                onClick={() => handlePledgeDonation(alert.id)}
                className="px-6 py-3 bg-white text-red-700 hover:bg-red-50 font-black rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>I Can Donate Now!</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Profile Edit Form Modal/Drawer */}
      {isEditing && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-rose-600" />
            <span>Update Donor Profile</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group</label>
              <select
                value={profileForm.blood_group}
                onChange={(e) => setProfileForm({ ...profileForm, blood_group: e.target.value })}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / City</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Last Donation Date</label>
              <input
                type="date"
                value={profileForm.last_donation_date}
                onChange={(e) => setProfileForm({ ...profileForm, last_donation_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Donation Form Modal/Drawer */}
      {isAddingDonation && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-rose-600" />
            <span>Log a New Blood Donation</span>
          </h3>

          <form onSubmit={handleAddDonation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Units Donated</label>
              <input
                type="number"
                min="1"
                max="5"
                value={donationForm.units}
                onChange={(e) => setDonationForm({ ...donationForm, units: e.target.value === '' ? '' : parseInt(e.target.value) || '' })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Donation Date</label>
              <input
                type="date"
                value={donationForm.donation_date}
                onChange={(e) => setDonationForm({ ...donationForm, donation_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Donation Location / Notes</label>
              <input
                type="text"
                placeholder="e.g. City General Hospital Blood Camp"
                value={donationForm.notes}
                onChange={(e) => setDonationForm({ ...donationForm, notes: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingDonation(false)}
                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-sm"
              >
                Submit Donation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Total Donations</div>
            <div className="text-2xl font-black text-slate-800">{donations.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Last Donation</div>
            <div className="text-lg font-bold text-slate-800">
              {user?.last_donation_date || 'No record'}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Donor Status</div>
            <div className="text-lg font-bold text-emerald-600">Active Life Saver</div>
          </div>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-rose-600 fill-current" />
          <span>My Donation History</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
            <span>Loading donation history...</span>
          </div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
            <Droplet className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-500 font-medium">No donation records found yet.</p>
            <button
              onClick={() => setIsAddingDonation(true)}
              className="px-4 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs hover:bg-rose-100 transition-all inline-block"
            >
              Log your first donation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Units</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-800">{item.donation_date}</td>
                    <td className="p-3 font-extrabold text-rose-600">{item.blood_group}</td>
                    <td className="p-3 font-medium text-slate-700">{item.units} unit(s)</td>
                    <td className="p-3">
                      <span className="badge-approved">{item.status}</span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedCertDonation(item)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-all flex items-center space-x-1 border border-rose-200"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Donation Certificate Modal */}
      {selectedCertDonation && (
        <DonationCertificateModal
          donation={selectedCertDonation}
          donorName={user?.name}
          onClose={() => setSelectedCertDonation(null)}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
