import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Droplet, Activity, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import BloodCompatibilityMatrix from '../components/BloodCompatibilityMatrix';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      if (res.data && res.data.success) {
        setInventory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load inventory page:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (units) => {
    if (units >= 10) {
      return <span className="badge-available">Available Stock</span>;
    } else if (units > 0) {
      return <span className="badge-low">Low Stock Warning</span>;
    } else {
      return <span className="badge-critical">Out of Stock</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-200">
            <Activity className="w-3.5 h-3.5" />
            <span>Central Blood Registry</span>
          </div>
          <h1 className="text-3xl font-black mt-2">Live Blood Availability</h1>
          <p className="text-rose-100 text-sm mt-1">
            Real-time tracking of blood units available across all major blood types.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          disabled={loading}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-md transition-all text-sm flex items-center space-x-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Blood Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <div
              key={item.blood_group}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-4xl font-black text-rose-600">{item.blood_group}</span>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-rose-500 fill-current" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-800">
                  {item.units_available} <span className="text-sm font-semibold text-slate-400">Units</span>
                </div>
                <div className="mt-2">{getStatusBadge(item.units_available)}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Last updated</span>
                <span>{item.last_updated ? new Date(item.last_updated).toLocaleTimeString() : 'Recent'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Blood Compatibility Matrix */}
      <BloodCompatibilityMatrix />

      {/* CTA Box */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Are you a registered hospital requiring blood units?</h3>
          <p className="text-slate-400 text-sm mt-1">
            Log in to your Hospital account to submit formal blood requests for approval.
          </p>
        </div>
        <Link
          to="/register?role=hospital"
          className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 whitespace-nowrap"
        >
          <span>Hospital Login / Register</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default InventoryPage;
