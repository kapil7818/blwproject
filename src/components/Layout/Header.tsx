import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Train, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-slate-700 via-slate-800 to-gray-800 shadow-lg border-b-4 border-blue-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0" onClick={closeMobileMenu}>
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Train className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-white">
                BLW Sports Club
              </span>
              <span className="text-xs text-blue-300 hidden sm:block">
                Railway Sports Community
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link 
              to="/" 
              className={`text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-blue-300 ${
                location.pathname === '/' ? 'text-blue-300 border-blue-300 bg-slate-700/50' : ''
              }`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-blue-300 ${
                    location.pathname === '/dashboard' ? 'text-blue-300 border-blue-300 bg-slate-700/50' : ''
                  }`}
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-blue-300 ${
                      location.pathname === '/admin' ? 'text-blue-300 border-blue-300 bg-slate-700/50' : ''
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-3 py-2">
                  <User className="w-4 h-4 text-blue-300" />
                  <span className="text-sm font-medium text-white truncate max-w-32">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-white hover:text-blue-300 transition-colors bg-slate-700/30 rounded-lg px-3 py-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors bg-red-600/20 rounded-lg px-3 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/20 hover:border-blue-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 border border-blue-400"
                >
                  Join Railway Club
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-300 p-2 rounded-md transition-colors bg-slate-700/30"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-600 bg-slate-800/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'text-blue-300 bg-slate-700/50 border-l-4 border-blue-400' 
                    : 'text-white hover:text-blue-300 hover:bg-slate-700/30'
                }`}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === '/dashboard' 
                        ? 'text-blue-300 bg-slate-700/50 border-l-4 border-blue-400' 
                        : 'text-white hover:text-blue-300 hover:bg-slate-700/30'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        location.pathname === '/admin' 
                          ? 'text-blue-300 bg-slate-700/50 border-l-4 border-blue-400' 
                          : 'text-white hover:text-blue-300 hover:bg-slate-700/30'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-300 hover:bg-slate-700/30 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile User Section */}
            <div className="pt-4 pb-3 border-t border-slate-600">
              {user ? (
                <div className="px-2 space-y-3">
                  <div className="flex items-center px-3 bg-slate-700/30 rounded-lg py-3">
                    <Train className="w-5 h-5 text-blue-300 mr-3" />
                    <div className="flex-1">
                      <div className="text-base font-medium text-white">{user.name}</div>
                      <div className="text-sm text-blue-200">{user.email}</div>
                    </div>
                    {user.role === 'admin' && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-600/20 transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-300 hover:bg-slate-700/30 transition-colors border border-white/20"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Join Railway Club
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}