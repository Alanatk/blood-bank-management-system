import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Droplet, HeartHandshake, ShieldCheck, Activity, Users, ArrowRight, PhoneCall, Sparkles } from 'lucide-react';

const Home = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      if (res.data && res.data.success) {
        setInventory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (units) => {
    if (units >= 10) {
      return <span className="badge-available">Available ({units} units)</span>;
    } else if (units > 0) {
      return <span className="badge-low">Low Stock ({units} units)</span>;
    } else {
      return <span className="badge-critical">Critical (0 units)</span>;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-red-800 to-rose-950 text-white p-8 md:p-16 shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Lifesaving Blood Management Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Save Lives. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-amber-200">
              Donate Blood.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-rose-100/90 font-light leading-relaxed">
            Every blood donation can save up to three lives. Our smart platform connects donors, hospitals, and blood banks in real time for safe and efficient distribution.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl shadow-lg shadow-rose-950/40 hover:shadow-xl transition-all flex items-center space-x-2"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>Become a Donor</span>
            </Link>

            <Link
              to="/register?role=hospital"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <span>Request Blood</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/inventory"
              className="px-6 py-3.5 bg-white text-rose-900 hover:bg-rose-50 font-bold rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Activity className="w-5 h-5 text-rose-600" />
              <span>View Live Availability</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Blood Availability */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Droplet className="w-7 h-7 text-rose-600 fill-current" />
              <span>Live Blood Inventory</span>
            </h2>
            <p className="text-slate-500 mt-1">Real-time availability of blood units in our central database.</p>
          </div>
          <Link
            to="/inventory"
            className="text-rose-600 hover:text-rose-700 font-semibold text-sm flex items-center space-x-1"
          >
            <span>View detailed inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {inventory.map((item) => (
              <div
                key={item.blood_group}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-rose-600">{item.blood_group}</span>
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-rose-500" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-slate-800">
                    {item.units_available}{' '}
                    <span className="text-xs font-semibold text-slate-400 uppercase">Units</span>
                  </div>
                  <div className="mt-2">{getStatusBadge(item.units_available)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Donate & How It Works */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Why Donate Blood?</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Blood cannot be manufactured. It can only come as a generous gift from donors. One single donation can save lives of trauma victims, surgery patients, and cancer fighters.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Safe & Verified</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            All blood collections undergo rigorous screening and temperature-controlled storage. Strict admin approval workflows ensure that blood reaches verified medical facilities.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Rapid Request Response</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Hospitals can check inventory live and submit blood requirements instantly. Automated tracking alerts admins to immediately approve critical requests.
          </p>
        </div>
      </section>

      {/* Emergency Callout CTA */}
      <section className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start space-x-2">
            <PhoneCall className="w-6 h-6" />
            <span>Need Urgent Blood Assistance?</span>
          </h3>
          <p className="text-rose-100 text-sm max-w-xl">
            Register as a Hospital to place immediate emergency blood requests or contact our support team.
          </p>
        </div>
        <Link
          to="/register?role=hospital"
          className="px-6 py-3.5 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          Submit Hospital Request
        </Link>
      </section>
    </div>
  );
};

export default Home;
