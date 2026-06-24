import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; 
import { navLinks } from '../data/siteContent';
import { GraduationCap } from 'lucide-react';
import API_BASE from '../utils/api';

export default function Navbar({ onLeadClick, activeTab, onTabChange, user }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-dark/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <div className="flex-1">
          <button 
            onClick={() => onTabChange && onTabChange('after12th')} 
            className="inline-flex items-center gap-2.5 text-white outline-none group"
          >
            <div className="flex h-10 w-12 items-center justify-center rounded-2xl bg-[#FF6B2B] shadow-lg shadow-[#FF6B2B]/20 transition-transform group-hover:scale-105">
              <span className="text-sm font-bold text-white tracking-tighter" style={{ fontFamily: 'system-ui, sans-serif' }}>अत्यanT</span>
            </div>
            <div className="text-2xl font-black tracking-tight text-white">Atyant</div>
          </button>
        </div>

        {/* Nav Links - Center/Left */}
        <nav className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => onTabChange && onTabChange('after12th')}
            className={`text-sm font-medium transition ${activeTab === 'after12th' ? 'text-[#FF6B2B]' : 'text-white hover:text-[#FF6B2B]'}`}
          >
            Home
          </button>
          
          <button
            onClick={() => onTabChange && onTabChange('mentors')}
            className={`text-sm font-medium transition flex items-center gap-1 ${activeTab === 'mentors' ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}
          >
            Find Mentors <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-[9px] font-bold text-blue-400 ring-1 ring-blue-500/50">NEW</span>
          </button>

          <Link
            to="/predictor"
            className={`text-sm font-medium transition flex items-center gap-1.5 ${activeTab === 'predictor' ? 'text-[#c9a84c]' : 'text-white hover:text-[#c9a84c]'}`}
          >
            College Predictor <span className="text-[9px] font-bold text-[#1a1814] bg-[#c9a84c] px-1.5 py-0.5 rounded-md tracking-wide">PRO</span>
          </Link>

          {user && (
            <Link 
              to="/profile"
              className="text-sm font-medium text-white hover:text-[#FF6B2B] transition flex items-center gap-1"
            >
              My Bookings <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">Paid</span>
            </Link>
          )}

          {navLinks.map((link) => (
            <HashLink 
              smooth 
              key={link.label} 
              to={link.href} 
              className="text-sm font-medium text-white hover:text-[#FF6B2B] transition"
            >
              {link.label}
            </HashLink>
          ))}
        </nav>

        {/* Buttons - Right */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {user ? (
            <Link 
              to="/profile" 
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#FF8E53] text-sm font-black text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FF6B2B]/40 ring-2 ring-white/15 border border-[#FF6B2B] hover:border-white/40 overflow-hidden"
              title="View Profile"
            >
              {user.profilePhotoFilename ? (
                <img 
                  src={`${API_BASE}/api/upload/profile-photo/${user.profilePhotoFilename}`} 
                  alt={user.name} 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <span className="drop-shadow-sm">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </Link>
          ) : (
            <Link to="/login" className="inline-flex items-center rounded-full border-2 border-[#FF6B2B] bg-white px-4 py-2 text-sm font-semibold text-[#FF6B2B] shadow-[0_0_12px_rgba(255,107,43,0.4)] transition hover:shadow-[0_0_20px_rgba(255,107,43,0.6)] hover:scale-[1.03]">
              Login
            </Link>
          )}
          <button
            type="button"
            onClick={onLeadClick}
            className="inline-flex items-center rounded-full bg-[#FF6B2B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff7b48] transition"
          >
            Get Clarity
          </button>
        </div>
      </div>
    </header>
  );
}
