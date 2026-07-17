import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { navLinks } from '../data/siteContent';
import { Sparkles, Menu, X, ArrowRight, User } from 'lucide-react';
import API_BASE from '../utils/api';

export default function Navbar({ onLeadClick, activeTab, onTabChange, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-3 sm:px-6 lg:px-8 pointer-events-none">
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-6 py-2.5 lg:py-3 transition-all duration-300 rounded-full border pointer-events-auto ${
          scrolled || menuOpen
            ? 'border-white/10 bg-[#0B0F2E]/80 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl'
            : 'border-white/5 bg-[#0B0F2E]/65 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-lg'
        }`}
      >
        {/* Logo - Left (Grows to push center item) */}
        <div className="flex-1 flex items-center justify-start">
          <button
            onClick={() => {
              onTabChange && onTabChange('after12th');
              closeMenu();
            }}
            className="inline-flex items-center gap-2 text-white outline-none group text-left"
          >
            {/* Indian language emblem styled beautifully */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#FF8E53] shadow-md shadow-[#FF6B2B]/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-6">
              <span className="text-[13px] font-bold text-white leading-none">अत्यंत</span>
            </div>
            <div className="text-xl font-bold tracking-tight text-white group-hover:text-[#FFB38E] transition duration-200 hidden sm:inline-block">
              Atyant
            </div>
          </button>
        </div>

        {/* Mobile College Guide button - Standalone centered child */}
        <div className="lg:hidden flex-shrink-0 flex items-center justify-center">
          <button
            onClick={() => {
              onTabChange && onTabChange('roadmap');
              closeMenu();
            }}
            className="flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-bold text-white bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] shadow-md shadow-[#FF6B2B]/20 transition active:scale-95 shrink-0"
          >
            {/* <Sparkles className="h-2.5 w-2.5 text-[#FFB38E]" /> */}
            <span>College Guide</span>
          </button>
        </div>

        {/* Nav Links - Center (desktop only, grows to fill center) */}
        <nav className="hidden lg:flex flex-shrink-0 items-center justify-center gap-1">
          <button
            onClick={() => onTabChange && onTabChange('after12th')}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition ${
              activeTab === 'after12th'
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onTabChange && onTabChange('mentors')}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
              activeTab === 'mentors'
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Find Mentors</span>
            {/* <span className="flex h-3 w-5 items-center justify-center rounded bg-blue-500/20 text-[6px] font-black text-blue-400 ring-1 ring-blue-500/30">NEW</span> */}
          </button>

          <Link
            to="/predictor"
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'predictor'
                ? 'bg-white/10 text-[#c9a84c]'
                : 'text-slate-300 hover:text-[#c9a84c] hover:bg-white/5'
            }`}
          >
            College Predictor
            {/* <span className="text-[7px] font-black text-[#1a1814] bg-[#c9a84c] px-1.5 py-0.5 rounded tracking-wide">PRO</span> */}
          </Link>

          <button
            onClick={() => onTabChange && onTabChange('roadmap')}
            className={`group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 hover:scale-[1.03] ${
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] shadow-[#FF6B2B]/30'
                : 'bg-white/5 border border-white/5 hover:bg-white/10'
            }`}
          >
            {/* <Sparkles className="h-3 w-3 text-[#FFB38E] animate-pulse" /> */}
            Explore College Guide
          </button>
        </nav>

        {/* Right side: Action buttons (Grows to push center item) */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {/* Desktop Auth & Lead Button */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Link
                to="/profile"
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#FF8E53] text-xs font-black text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FF6B2B]/40 ring-1 ring-white/15 overflow-hidden"
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
                className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={onLeadClick}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] px-4 py-2 text-xs font-bold text-white hover:shadow-[0_4px_15px_rgba(255,107,43,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Get Clarity
            </button>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button
            type="button"
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition border border-white/5"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drop-down panel matching capsule theme */}
      {menuOpen && (
        <div className="lg:hidden mx-auto mt-2 max-w-7xl w-full rounded-[1.8rem] border border-white/10 bg-[#0B0F2E]/95 shadow-xl backdrop-blur-xl px-6 py-5 flex flex-col gap-4 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-200">
          <button
            onClick={() => {
              onTabChange && onTabChange('after12th');
              closeMenu();
            }}
            className={`w-full text-left text-sm font-semibold py-2 px-3 rounded-xl transition ${
              activeTab === 'after12th'
                ? 'bg-white/10 text-[#FF6B2B]'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              onTabChange && onTabChange('mentors');
              closeMenu();
            }}
            className={`w-full text-left text-sm font-semibold py-2 px-3 rounded-xl transition flex items-center justify-between ${
              activeTab === 'mentors'
                ? 'bg-white/10 text-blue-400'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">Find Mentors</span>
            {/* <span className="flex h-3.5 w-6 items-center justify-center rounded bg-blue-500/20 text-[7px] font-black text-blue-400 ring-1 ring-blue-500/40">NEW</span> */}
          </button>

          <Link
            to="/predictor"
            onClick={closeMenu}
            className={`w-full text-left text-sm font-semibold py-2 px-3 rounded-xl transition flex items-center justify-between ${
              activeTab === 'predictor'
                ? 'bg-white/10 text-[#c9a84c]'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>College Predictor</span>
            {/* <span className="text-[7px] font-black text-[#1a1814] bg-[#c9a84c] px-1.5 py-0.5 rounded tracking-wide">PRO</span> */}
          </Link>

          <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
            {user ? (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="inline-flex items-center gap-3 text-sm font-semibold text-slate-300 py-1"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#FF8E53] text-[10px] font-black text-white overflow-hidden ring-1 ring-white/10">
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
                className="inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 py-2.5 text-xs font-semibold text-white transition"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                onLeadClick();
                closeMenu();
              }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-[#FF6B2B]/10"
            >
              Get Clarity
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
