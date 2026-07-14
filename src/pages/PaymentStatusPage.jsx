import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Check, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { verifyPayment } from '../utils/api';

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [slug, setSlug] = useState(null);
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
          if (data.payment?.pathSlug) setSlug(data.payment.pathSlug);
          setStatus('success');
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
            <p className="text-sm text-white/70 mb-6">Your premium content has been unlocked.</p>
            
            <button
              onClick={() => slug ? (window.location.href = `/careers/${slug}`) : navigate('/roadmap')}
              className="w-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-[#FF6B2B]/20"
            >
              Go Back to Career Path
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
              onClick={() => slug ? navigate(`/careers/${slug}`) : navigate(-1)}
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
