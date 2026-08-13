import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, LogOut, Menu, X, LayoutDashboard, PlusCircle, Users, Activity, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'donor') return '/donor-dashboard';
    if (user.role === 'hospital') return '/hospital-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    if (user.role === 'donor') return 'Donor Dashboard';
    if (user.role === 'hospital') return 'Hospital Dashboard';
    if (user.role === 'admin') return 'Admin Dashboard';
    return 'Dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-current text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                Blood<span className="text-rose-600">Bank</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-rose-500 uppercase -mt-1">
                Life Saver System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 font-medium text-sm">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                isActive('/')
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/donors"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                isActive('/donors')
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Donors</span>
            </Link>

            <Link
              to="/inventory"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                isActive('/inventory')
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Blood Inventory</span>
            </Link>

            <Link
              to={user?.role === 'hospital' ? '/hospital-dashboard' : '/register?role=hospital'}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                isActive('/hospital-dashboard')
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-red-500" />
              <span>Request Blood</span>
            </Link>

            {user && (
              <Link
                to={getDashboardPath()}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 font-bold ${
                  isActive(getDashboardPath())
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{getDashboardLabel()}</span>
              </Link>
            )}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-50 p-1.5 pl-3 rounded-full border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </span>
                  <div className="text-xs leading-tight">
                    <span className="font-semibold text-slate-800 block truncate max-w-[100px]">{user.name}</span>
                    <span className="capitalize font-bold text-[10px] text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded-full inline-block">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-rose-600 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 text-sm font-medium">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-600"
          >
            Home
          </Link>
          <Link
            to="/donors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-600"
          >
            Donors
          </Link>
          <Link
            to="/inventory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-600"
          >
            Blood Inventory
          </Link>
          <Link
            to={user?.role === 'hospital' ? '/hospital-dashboard' : '/register?role=hospital'}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-600"
          >
            Request Blood
          </Link>

          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-rose-700 bg-rose-50"
              >
                {getDashboardLabel()}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({user.name})</span>
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 font-semibold text-rose-600 bg-rose-50 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 font-semibold text-white bg-rose-600 rounded-lg shadow-sm"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
