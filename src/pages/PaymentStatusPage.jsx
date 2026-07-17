import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Check, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { verifyPayment } from '../utils/api';

// Static plan IDs that are NOT courses (career path / counselling plans)
const STATIC_PLAN_IDS = new Set([
  'complete-round',
  'ultimate-peace',
  'csab-complete',
  'csab-ultimate',
  'college-clarity',
  'admission-success',
  'admission-career-growth',
  'career-premium',
  'dream-seat',
]);

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [redirectLabel, setRedirectLabel] = useState('Continue');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setErrorMsg('No order ID found in the URL.');
      return;
    }

    const verify = async () => {
      try {
        const data = await verifyPayment({ order_id: orderId });

        if (data.ok) {
          const { planId, pathSlug } = data.payment || {};

          // First check localStorage for the pending redirect (set by PaymentModal before checkout)
          const pending = localStorage.getItem('atyant_pending_redirect');
          localStorage.removeItem('atyant_pending_redirect');

          let targetUrl = '/roadmap';
          let targetLabel = 'Go to Roadmap';

          if (pending) {
            targetUrl = pending;
            targetLabel = pending.startsWith('/courses')
              ? 'Go to Course'
              : 'Go Back to Career Path';
          } else if (planId && !STATIC_PLAN_IDS.has(planId)) {
            // planId is a course slug
            targetUrl = `/courses/${planId}`;
            targetLabel = 'Go to Course';
          } else if (pathSlug) {
            targetUrl = `/careers/${pathSlug}`;
            targetLabel = 'Go Back to Career Path';
          }

          setRedirectUrl(targetUrl);
          setRedirectLabel(targetLabel);
          setStatus('success');

          // Auto-redirect after 2 seconds
          setTimeout(() => {
            if (targetUrl.startsWith('http') || targetUrl.startsWith('https')) {
              window.location.href = targetUrl;
            } else {
              navigate(targetUrl);
            }
          }, 2000);
        } else {
          setStatus('error');
          setErrorMsg(data.message || 'Payment verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Payment verification failed.');
      }
    };

    verify();
  }, [orderId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-[#FF6B2B] animate-spin" />
            <h2 className="text-xl font-bold text-white">Verifying Payment...</h2>
            <p className="text-sm text-white/60">Please do not refresh the page.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-2">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
            <p className="text-sm text-white/70 mb-6">Your content has been unlocked.</p>

            <button
              onClick={() =>
                redirectUrl ? (window.location.href = redirectUrl) : navigate('/roadmap')
              }
              className="w-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-[#FF6B2B]/20"
            >
              {redirectLabel}
            </button>
            <Link to="/" className="text-sm text-white/50 hover:text-white transition mt-2">
              Return to Home
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-2">
              <X className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Payment Failed</h2>
            <p className="text-sm text-rose-400 mb-6">{errorMsg}</p>

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
