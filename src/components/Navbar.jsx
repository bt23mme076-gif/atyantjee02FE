import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { navLinks } from '../data/siteContent';
import { GraduationCap, Sparkles, Menu, X } from 'lucide-react';
import API_BASE from '../utils/api';

export default function Navbar({ onLeadClick, activeTab, onTabChange, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-dark/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">

        {/* Logo - Left */}
        <div className="flex items-center">
          <button
            onClick={() => { onTabChange && onTabChange('after12th'); closeMenu(); }}
            className="inline-flex items-center gap-2.5 text-white outline-none group"
          >
            <div className="flex h-10 w-12 items-center justify-center rounded-2xl bg-[#FF6B2B] shadow-lg shadow-[#FF6B2B]/20 transition-transform group-hover:scale-105">
              <span className="text-sm font-bold text-white tracking-tighter" style={{ fontFamily: 'system-ui, sans-serif' }}>अत्यanT</span>
            </div>
            <div className="text-2xl font-black tracking-tight text-white">Atyant</div>
          </button>
        </div>

        {/* Nav Links - Center (desktop only) */}
        <nav className="hidden lg:flex items-center justify-center gap-12">
          <button
            onClick={() => onTabChange && onTabChange('after12th')}
            className={`text-sm font-medium transition ${activeTab === 'after12th' ? 'text-[#FF6B2B]' : 'text-white hover:text-[#FF6B2B]'}`}
          >
            Home
          </button>

          <button
            onClick={() => onTabChange && onTabChange('mentors')}
            className={`text-sm font-medium transition flex items-center gap-1.5 ${activeTab === 'mentors' ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}
          >
            Find Mentors <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-[9px] font-bold text-blue-400 ring-1 ring-blue-500/50">NEW</span>
          </button>

          <Link
            to="/predictor"
            className={`text-sm font-medium transition flex items-center gap-1.5 ${activeTab === 'predictor' ? 'text-[#c9a84c]' : 'text-white hover:text-[#c9a84c]'}`}
          >
            College Predictor <span className="text-[9px] font-bold text-[#1a1814] bg-[#c9a84c] px-1.5 py-0.5 rounded-md tracking-wide">PRO</span>
          </Link>

          <button
            onClick={() => onTabChange && onTabChange('roadmap')}
            className={`group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.04] ${activeTab === 'roadmap'
              ? 'bg-gradient-to-r from-[#FF6B2B] to-[#8B5CF6] shadow-[#8B5CF6]/30'
              : 'bg-gradient-to-r from-[#FF6B2B]/80 to-[#8B5CF6]/80 shadow-[#8B5CF6]/20 hover:from-[#FF6B2B] hover:to-[#8B5CF6]'
              }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Roadmap
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          </button>
        </nav>

        {/* Right side: action buttons (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          {/* Login + Get Clarity: desktop only now */}
          <div className="hidden lg:flex items-center gap-3">
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
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#FF6B2B]"
              >
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

          {/* Hamburger - mobile only, now the ONLY thing on the right below lg */}
          <button
            type="button"
            className="lg:hidden flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 transition"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-dark/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
          <button
            onClick={() => { onTabChange && onTabChange('after12th'); closeMenu(); }}
            className={`w-full text-left text-sm font-medium py-2 transition ${activeTab === 'after12th' ? 'text-[#FF6B2B]' : 'text-white hover:text-[#FF6B2B]'}`}
          >
            Home
          </button>

          <button
            onClick={() => { onTabChange && onTabChange('mentors'); closeMenu(); }}
            className={`w-full text-left text-sm font-medium py-2 transition flex items-center gap-2 ${activeTab === 'mentors' ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}
          >
            Find Mentors
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-[9px] font-bold text-blue-400 ring-1 ring-blue-500/50">NEW</span>
          </button>

          <Link
            to="/predictor"
            onClick={closeMenu}
            className={`text-sm font-medium py-2 transition flex items-center gap-2 ${activeTab === 'predictor' ? 'text-[#c9a84c]' : 'text-white hover:text-[#c9a84c]'}`}
          >
            College Predictor
            <span className="text-[9px] font-bold text-[#1a1814] bg-[#c9a84c] px-1.5 py-0.5 rounded-md tracking-wide">PRO</span>
          </Link>

          <button
            onClick={() => { onTabChange && onTabChange('roadmap'); closeMenu(); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition self-start ${activeTab === 'roadmap'
              ? 'bg-gradient-to-r from-[#FF6B2B] to-[#8B5CF6]'
              : 'bg-gradient-to-r from-[#FF6B2B]/80 to-[#8B5CF6]/80'
              }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Roadmap
          </button>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            {user ? (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="inline-flex items-center gap-2 text-sm font-medium text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#FF8E53] text-xs font-black text-white overflow-hidden">
                  {user.profilePhotoFilename ? (
                    <img
                      src={`${API_BASE}/api/upload/profile-photo/${user.profilePhotoFilename}`}
                      alt={user.name}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                View Profile
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#FF6B2B]"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => { onLeadClick(); closeMenu(); }}
              className="inline-flex items-center justify-center rounded-full bg-[#FF6B2B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff7b48] transition"
            >
              Get Clarity
            </button>
          </div>
        </div>
      )}
    </header>
  );
}