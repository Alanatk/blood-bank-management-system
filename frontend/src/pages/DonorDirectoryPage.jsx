import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Heart, MapPin, Droplet, Filter, Loader2, Calendar } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorDirectoryPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');

  useEffect(() => {
    fetchDonors();
  }, [bloodGroupFilter]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      let url = '/donors';
      const params = new URLSearchParams();
      if (bloodGroupFilter) params.append('blood_group', bloodGroupFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      if (res.data && res.data.success) {
        setDonors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch donors list:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter((d) => {
    const term = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      (d.location && d.location.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-red-500 text-white rounded-3xl p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Community Donor Directory</span>
          </div>
          <h1 className="text-3xl font-black">Search Registered Donors</h1>
          <p className="text-rose-100 text-sm">
            Find voluntary blood donors by blood group and location. Privacy is strictly protected.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase">Filter:</span>
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Donors Grid Display */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex justify-center items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
          <span>Loading donor directory...</span>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500">
          No donors found matching your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    {donor.blood_group}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{donor.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{donor.location || 'Location Not Specified'}</span>
                    </p>
                  </div>
                </div>
                <span className="badge-available">Active</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Donated: {donor.last_donation_date || 'N/A'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorDirectoryPage;
