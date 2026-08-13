// src/components/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { Droplet, Users, Heart, Activity } from "lucide-react";

function Dashboard() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-center text-rose-600 mb-6 drop-shadow-md">
        🩸 Blood Bank Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 text-center bg-gradient-to-br from-rose-400 to-red-500 text-white">
          <Droplet className="mx-auto mb-3 w-10 h-10" />
          <h2 className="text-xl font-semibold">Total Donations</h2>
          <p className="text-3xl font-bold mt-2">125</p>
        </div>

        <div className="card p-6 text-center bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white">
          <Users className="mx-auto mb-3 w-10 h-10" />
          <h2 className="text-xl font-semibold">Registered Donors</h2>
          <p className="text-3xl font-bold mt-2">58</p>
        </div>

        <div className="card p-6 text-center bg-gradient-to-br from-red-400 to-orange-500 text-white">
          <Heart className="mx-auto mb-3 w-10 h-10" />
          <h2 className="text-xl font-semibold">Requests Pending</h2>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="card p-6 text-center bg-gradient-to-br from-purple-400 to-indigo-500 text-white">
          <Activity className="mx-auto mb-3 w-10 h-10" />
          <h2 className="text-xl font-semibold">Available Blood Units</h2>
          <p className="text-3xl font-bold mt-2">84</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <Link
          to="/donors"
          className="btn text-center block py-4 rounded-xl text-lg font-semibold"
        >
          View Donors
        </Link>
        <Link
          to="/request"
          className="btn text-center block py-4 rounded-xl text-lg font-semibold"
        >
          Manage Requests
        </Link>
        <Link
          to="/"
          className="btn text-center block py-4 rounded-xl text-lg font-semibold"
        >
          Register Donor
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
