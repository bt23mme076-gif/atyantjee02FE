import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { footerLinks } from '../data/siteContent';
import TrustBadges from './TrustBadges';

export default function Footer({ onAdminClick }) {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  const handleContactClick = (e) => {
    e.preventDefault();
    setShowContactInfo(true);
  };

  return (
    <>
      {isHomepage && <TrustBadges />}
      <footer className="border-t border-white/10 bg-[#09102b] px-4 py-10 text-white/72 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold tracking-[0.24em] text-white">ATYANT</div>
            <div className="mt-2 text-sm text-white">
              Built for students who deserve better decisions.
            </div>
          </div>
          <div className="flex flex-wrap gap-5 items-center text-sm">
            {footerLinks.map((link) =>
              link.label === 'Contact' ? (
                <button
                  key={link.label}
                  onClick={handleContactClick}
                  className="text-white transition hover:opacity-80 cursor-pointer"
                  title={link.title}
                >
                  {link.label}
                </button>
              ) : link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white transition hover:opacity-80"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="text-white transition hover:opacity-80"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
      </footer>

      {showContactInfo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactInfo(false)}
        >
          <div
            className="bg-[#09102b] border border-white/20 rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-4">Contact Information</h3>
            <div className="text-white/80 space-y-3">
              <p className="text-base">{footerLinks.find((l) => l.label === 'Contact')?.title}</p>
              <div className="flex gap-2 pt-2">
                <a
                  href="tel:+916262855885"
                  className="flex-1 bg-[#FF6B2B] text-white py-2 px-3 rounded text-center text-sm hover:bg-[#FF6B2B]/90 transition"
                >
                  Call
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('+916262855885');
                    setShowContactInfo(false);
                  }}
                  className="flex-1 bg-white/10 text-white py-2 px-3 rounded text-center text-sm hover:bg-white/20 transition"
                >
                  Copy Number
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowContactInfo(false)}
              className="mt-4 w-full text-white/60 hover:text-white transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
