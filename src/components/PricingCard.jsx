import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWhatsAppLink } from '../utils/whatsapp';
import { createPaymentOrder, getUserMe } from '../utils/api';

// Map frontend plan titles → backend planId
export const PLAN_ID_MAP = {
  // JEE Counselling Plans
  'Complete Round Support': 'complete-round',
  'Ultimate Peace of Mind': 'ultimate-peace',
  // MHT-CET Counselling Plans
  'College Clarity': 'college-clarity',
  'Admission Success': 'admission-success',
  'Admission + Career Growth': 'admission-career-growth',
};

function loadCashfree() {
  return new Promise((resolve) => {
    if (window.Cashfree) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Payment Modal ─────────────────────────────────────────────────────────────

export function PaymentModal({ open, onClose, planTitle, planPrice, mentorId, onSuccessRedirectUrl }) {
  const [profile, setProfile] = React.useState(null);
  const [phone, setPhone] = React.useState('');
  const [fetchingProfile, setFetchingProfile] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setLoading(false); setError(''); setSuccess(false); setProfile(null); setPhone('');
      return;
    }
    const token = localStorage.getItem('user_token');
    if (!token) {
      setError('Please log in to continue with payment.');
      return;
    }
    setFetchingProfile(true);
    getUserMe()
      .then((res) => {
        if (res?.user) {
          setProfile(res.user);
          // Pre-fill phone stripping any country code/spaces
          setPhone((res.user.phone || '').replace(/\D/g, '').slice(-10));
        }
      })
      .catch(() => setError('Could not load your profile. Please try again.'))
      .finally(() => setFetchingProfile(false));
  }, [open]);

  async function handlePay(e) {
    e.preventDefault();
    setError('');

    if (!profile) {
      setError('Profile not loaded. Please close and try again.');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    const planId = PLAN_ID_MAP[planTitle] || planTitle;

    try {
      const payload = { planId, name: profile.name, email: profile.email, phone };
      if (mentorId) payload.mentorId = mentorId;
      const orderData = await createPaymentOrder(payload);
      const loaded = await loadCashfree();
      if (!loaded) throw new Error('Could not load Cashfree SDK. Check your internet connection.');

      const cashfree = window.Cashfree({
        mode: orderData.cashfreeEnvironment === 'production' ? 'production' : 'sandbox'
      });

      if (onSuccessRedirectUrl) {
        localStorage.setItem('atyant_pending_redirect', onSuccessRedirectUrl);
      }

      await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        returnUrl: `${import.meta.env.VITE_APP_URL}/profile?order_id=${orderData.orderId}`
      });

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (!open) return null;

  // Human-readable plan title
  const displayTitle = PLAN_ID_MAP[planTitle]
    ? planTitle
    : planTitle.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B0F2E] to-[#12183f] px-6 pt-6 pb-5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B2B] mb-1">Secure Checkout</p>
            <h3 className="text-xl font-black text-white">{displayTitle}</h3>
            <p className="text-sm text-white/60 mt-0.5">₹{planPrice} · via Cashfree</p>
          </div>

          <div className="p-6">
            {success ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We'll reach out within 24 hours to schedule your session.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-full bg-[#FF6B2B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e05a1f] transition"
                >
                  Done
                </button>
              </div>
            ) : fetchingProfile ? (
              <div className="py-10 flex flex-col items-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-[#FF6B2B] rounded-full animate-spin" />
                <p className="text-sm">Loading your profile…</p>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-4">
                {error && (
                  <p className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{error}</p>
                )}

                {/* Profile info — read-only */}
                {profile && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Paying as</p>

                    {/* Name — locked */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] text-sm font-black">
                        {(profile.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-400">Full Name</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{profile.name || '—'}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">Locked</span>
                    </div>

                    {/* Email — locked */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-400">
                        <span className="text-sm">@</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-400">Email</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{profile.email || '—'}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">Locked</span>
                    </div>

                    {/* Phone — editable only if missing */}
                    {profile.phone ? (
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-500 text-sm font-bold">
                          #
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-gray-400">Phone</p>
                          <p className="text-sm font-semibold text-gray-800">{phone}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">Locked</span>
                      </div>
                    ) : (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Phone Number * <span className="text-gray-400 font-normal">(not in profile — enter below)</span>
                        </label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !profile}
                  className="w-full rounded-xl bg-gradient-to-r from-[#FF6B2B] to-[#ff8a57] py-3.5 text-sm font-bold text-white hover:from-[#e05a1f] hover:to-[#ff6b2b] transition disabled:opacity-50 shadow-lg shadow-[#FF6B2B]/20 mt-2"
                >
                  {loading ? 'Processing…' : `Pay ₹${planPrice} Securely`}
                </button>

                <p className="text-center text-[11px] text-gray-400">
                  🔒 Secured by Cashfree · 100% safe checkout
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


// ─── PricingCard ───────────────────────────────────────────────────────────────

export default function PricingCard({
  title,
  price,
  originalPrice,
  discount,
  discountLabel,
  bestFor,
  features,
  bonus,
  bonusLabel,
  cta,
  highlighted = false,
  badge,
  colorTheme,
  bottomText,
}) {
  const navigate = useNavigate();
  const [showAllBonus, setShowAllBonus] = React.useState(false);

  const [showPayment, setShowPayment] = React.useState(false);

  // Auto-resume checkout after login redirect (any plan)
  React.useEffect(() => {
    const planId = PLAN_ID_MAP[title];
    if (!planId) return;
    const pending = localStorage.getItem('atyant_pending_booking');
    if (pending) {
      try {
        const { bundleId } = JSON.parse(pending);
        if (bundleId === planId) {
          const token = localStorage.getItem('user_token');
          if (token) {
            setShowPayment(true);
            localStorage.removeItem('atyant_pending_booking');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [title]);

  function handleCTA(e) {
    e.preventDefault();
    const planId = PLAN_ID_MAP[title];

    // No planId mapped — fall back to WhatsApp
    if (!planId) {
      window.open(getWhatsAppLink(title), '_blank');
      return;
    }

    // Require login before payment
    const token = localStorage.getItem('user_token');
    if (!token) {
      localStorage.setItem('atyant_pending_booking', JSON.stringify({
        bundleId: planId,
      }));
      navigate('/login', { state: { message: 'Please sign up or log in as a Student to buy this mentorship plan.' } });
      return;
    }

    // Open payment modal directly — no mentor redirect
    setShowPayment(true);
  }

  const visibleBonus = showAllBonus ? bonus : bonus?.slice(0, 3);

  // Dynamic Styles based on Color Theme
  let cardClass = 'border-slate-200 bg-white text-[#0B0F2E]';
  let checkColor = 'text-[#FF6B2B]';
  let btnClass = 'bg-[#0B0F2E] text-white hover:bg-[#12183f] shadow-lg';

  if (colorTheme === 'green') {
    cardClass = 'border-emerald-100 bg-white text-[#0B0F2E] hover:border-emerald-500 hover:ring-4 hover:ring-emerald-500/10 shadow-[0_15px_50px_rgba(16,185,129,0.04)]';
    checkColor = 'text-emerald-500';
    btnClass = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20';
  } else if (colorTheme === 'orange') {
    cardClass = 'border-orange-100 bg-white text-[#0B0F2E] hover:border-orange-500 hover:ring-4 hover:ring-orange-500/10 shadow-[0_15px_50px_rgba(249,115,22,0.04)]';
    checkColor = 'text-orange-500';
    btnClass = 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20';
  } else if (colorTheme === 'navy-glow') {
    cardClass = 'border-2 border-orange-500 bg-[#0B0F2E] text-white shadow-[0_20px_80px_rgba(255,107,43,0.3)] ring-4 ring-orange-500/25 z-10 hover:shadow-[0_0_60px_rgba(255,107,43,0.55)]';
    checkColor = 'text-orange-400';
    btnClass = 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/40';
  } else if (colorTheme === 'purple') {
    cardClass = 'border-indigo-100 bg-white text-[#0B0F2E] hover:border-indigo-500 hover:ring-4 hover:ring-indigo-500/10 shadow-[0_15px_50px_rgba(99,102,241,0.04)]';
    checkColor = 'text-indigo-500';
    btnClass = 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20';
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative flex flex-col rounded-[2.2rem] transition-all duration-300 ${cardClass}`}
      >
        {/* Badge */}
        {badge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-orange-500/30">
            {badge}
          </div>
        )}

        <div className="p-5 sm:p-8 flex flex-col flex-1">

          {/* Discount pill */}
          {discount && (
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                colorTheme === 'navy-glow' ? 'bg-orange-500 text-white' : 'bg-orange-500/10 text-orange-600'
              }`}>
                {discount}
              </span>
              {discountLabel && (
                <span className={`text-[11px] font-bold uppercase tracking-wider ${colorTheme === 'navy-glow' ? 'text-white/60' : 'text-slate-500'}`}>
                  • {discountLabel}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className={`text-2xl font-black leading-tight tracking-tight ${colorTheme === 'navy-glow' ? 'text-white' : 'text-[#0B0F2E]'}`}>
            {title}
          </h3>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-4xl font-black ${colorTheme === 'navy-glow' ? 'text-white' : 'text-[#0B0F2E]'}`}>
              ₹{price}
            </span>
            {originalPrice && (
              <span className={`text-lg font-bold line-through ${colorTheme === 'navy-glow' ? 'text-white/40' : 'text-slate-400'}`}>
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Highlight Strip */}
          {colorTheme === 'navy-glow' && (
            <div className="mt-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold uppercase tracking-widest text-[9px] px-3.5 py-2 rounded-xl text-center shadow-md animate-pulse">
              ✨ BEST CHOICE FOR MOST STUDENTS & PARENTS
            </div>
          )}

          {/* Best for */}
          {bestFor && (
            <div className={`mt-4 rounded-xl px-4 py-3.5 text-xs leading-relaxed font-medium border ${
              colorTheme === 'navy-glow'
                ? 'bg-white/5 border-white/10 text-white/80'
                : 'bg-slate-50 border-slate-100 text-slate-700'
            }`}>
              <span className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${colorTheme === 'navy-glow' ? 'text-orange-400' : 'text-orange-600'}`}>
                Best for
              </span>
              {bestFor}
            </div>
          )}

          {/* Divider */}
          <div className={`mt-5 mb-4 h-px ${colorTheme === 'navy-glow' ? 'bg-white/10' : 'bg-slate-100'}`} />

          {/* Features */}
          <div className="space-y-3 flex-1">
            <p className={`text-[10px] font-black uppercase tracking-wider mb-3 ${colorTheme === 'navy-glow' ? 'text-white/50' : 'text-slate-400'}`}>
              What's included
            </p>
            {features.map((feature) => (
              <div key={feature} className={`flex items-start gap-2.5 text-sm ${colorTheme === 'navy-glow' ? 'text-white/85' : 'text-slate-700 font-medium'}`}>
                <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${checkColor}`} />
                <span className="leading-snug">{feature}</span>
              </div>
            ))}
          </div>

          {/* Bonus guides */}
          {bonus && bonus.length > 0 && (
            <div className={`mt-5 rounded-2xl p-4 border ${
              colorTheme === 'navy-glow' ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className={`h-3.5 w-3.5 ${colorTheme === 'navy-glow' ? 'text-orange-400' : 'text-amber-500'}`} />
                <p className={`text-[10px] font-black uppercase tracking-wider ${colorTheme === 'navy-glow' ? 'text-orange-400' : 'text-amber-700'}`}>
                  {bonusLabel || 'Bonus Guides'}
                </p>
              </div>
              <div className="space-y-1.5">
                {visibleBonus.map((item) => (
                  <div key={item} className={`flex items-center gap-2 text-xs ${colorTheme === 'navy-glow' ? 'text-white/75 font-medium' : 'text-slate-600 font-medium'}`}>
                    <Star className={`h-3 w-3 shrink-0 ${colorTheme === 'navy-glow' ? 'text-orange-400' : 'text-amber-400'} fill-current`} />
                    {item}
                  </div>
                ))}
                {bonus.length > 3 && (
                  <button
                    onClick={() => setShowAllBonus(v => !v)}
                    className={`mt-1 text-[11px] font-bold underline underline-offset-2 ${colorTheme === 'navy-glow' ? 'text-orange-400' : 'text-amber-600'}`}
                  >
                    {showAllBonus ? 'Show less ↑' : `+${bonus.length - 3} more guides ↓`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleCTA}
            className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-4 text-sm font-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${btnClass}`}
          >
            {cta}
          </button>

          <p className={`mt-3.5 text-center text-xs font-bold ${colorTheme === 'navy-glow' ? 'text-white/50' : 'text-slate-500'}`}>
            {bottomText || 'No confusion. Just clarity.'}
          </p>
        </div>
      </motion.div>

      {showPayment && (
        <PaymentModal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          planTitle={title}
          planPrice={price}
          mentorId={null}
          onSuccessRedirectUrl={getWhatsAppLink(title)}
        />
      )}
    </>
  );
}
