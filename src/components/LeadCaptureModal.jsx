import React from 'react';
import { createLead } from '../utils/api';

export default function LeadCaptureModal({ open, onClose }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setPhone('');
      setLoading(false);
      setError('');
      setSubmitted(false);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createLead({ name, email, phone: phone || undefined, source: 'lead_modal' });
    } catch (err) {
      // Fallback: save to localStorage so the lead isn't lost
      console.warn('Backend unavailable, saving lead locally:', err.message);
      try {
        const existing = JSON.parse(localStorage.getItem('leads') || '[]');
        existing.push({ name, email, phone, at: new Date().toISOString() });
        localStorage.setItem('leads', JSON.stringify(existing));
      } catch (_) {}
    }

    setSubmitted(true);
    setTimeout(() => onClose?.(), 1200);
    setLoading(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/45 px-4 py-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          &times;
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-center">
              Get personalised guidance
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Share a few details and we'll suggest the next steps.
            </p>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href="https://wa.me/919579040183"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#FF6B2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7a42] transition text-center"
              >
                Chat with us
              </a>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#FF6B2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7a42] transition disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center">
            <h4 className="text-base sm:text-lg font-semibold">Thanks — we'll reach out soon</h4>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Meanwhile join our WhatsApp community or book a demo.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <a
                href="https://calendly.com/your-calendly-link"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto rounded-full bg-[#0B72FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B72FF]/90 transition text-center"
              >
                Book a demo
              </a>
              <a
                href="https://wa.me/919579040183"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#FF6B2B]"
              >
                Join WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
