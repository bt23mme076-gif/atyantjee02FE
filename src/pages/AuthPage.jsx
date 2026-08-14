import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gift, AlertTriangle } from 'lucide-react';
import { userLogin, userSignup, googleLogin, googleSignup } from '../utils/api';

export default function AuthPage({ setUser }) {
  const [role, setRole] = useState(''); // Empty string by default, forcing user to select one

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Signup Flow State
  const [googleUser, setGoogleUser] = useState(null); // stores { name, email, googleId, picture, credential }
  const [googleSignupStep, setGoogleSignupStep] = useState(false);
  const [googleRole, setGoogleRole] = useState('');
  const [googlePhone, setGooglePhone] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const customMessage = location.state?.message;
  const referralCode = new URLSearchParams(location.search).get('ref') || undefined;

  const [isLogin, setIsLogin] = useState(!referralCode); // auto-switch to signup if referral link

  const completeAuthRedirect = (userObj) => {
    const pendingBooking = localStorage.getItem('atyant_pending_booking');
    const redirectUrl =
      new URLSearchParams(location.search).get('redirect') || location.state?.redirect;
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (pendingBooking && userObj.role === 'student') {
      navigate('/mentors');
    } else {
      navigate(userObj.role === 'mentor' ? '/profile' : '/');
    }
  };

  const handleGoogleCallback = async (response) => {
    setError('');
    setLoading(true);
    try {
      const credential = response.credential;
      const res = await googleLogin(credential);
      if (res.signupRequired) {
        setGoogleUser({
          ...res.googleInfo,
          credential,
        });
        setGoogleSignupStep(true);
      } else {
        if (setUser) setUser(res.user);
        completeAuthRedirect(res.user);
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!googleRole) {
      setError('Please select a role: Student or Mentor');
      return;
    }
    if (googlePhone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }
    setLoading(true);
    try {
      const res = await googleSignup({
        credential: googleUser.credential,
        phone: googlePhone,
        role: googleRole,
        referralCode,
      });
      if (setUser) setUser(res.user);
      completeAuthRedirect(res.user);
    } catch (err) {
      setError(err.message || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const initGoogle = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        return;
      }

      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });
        const btnElem = document.getElementById('googleSignInDiv');
        if (btnElem) {
          window.google.accounts.id.renderButton(btnElem, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
          });
        }
      }
    };

    const interval = setInterval(() => {
      if (window.google) {
        initGoogle();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isLogin, googleSignupStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isLogin && !role) {
      setError('Please select a role: Student or Mentor');
      return;
    }
    if (!isLogin && phone.length != 10) {
      setError('Invalid Phone Number');
      return;
    }
    setLoading(true);

    try {
      let res;
      if (isLogin) {
        const deviceInfo =
          typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 150) : '';
        res = await userLogin({ phone, password, deviceInfo });
      } else {
        res = await userSignup({ name, phone, password, role, referralCode });
      }
      if (setUser) setUser(res.user);
      completeAuthRedirect(res.user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (googleSignupStep) {
    return (
      <div className="min-h-screen bg-[#0B0F2E] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#0F143C]/50 rounded-lg shadow-xl p-8 border border-white/10 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white">Complete your Profile</h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              Hi {googleUser?.name}, please choose your role and enter your 10-digit phone number to
              finish signing up.
            </p>
          </div>

          {googleUser?.picture && (
            <div className="flex justify-center mb-6">
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full border-2 border-[#FF6B2B]/20 shadow-md"
              />
            </div>
          )}

          <form onSubmit={handleGoogleSignupSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={googleUser?.email || ''}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 font-medium focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Select Your Role <span className="text-red-500">*</span>
                </span>
                {!googleRole && (
                  <span className="text-xs font-semibold text-[#FF6B2B] animate-pulse bg-white/5 px-2 py-0.5 rounded-md">
                    Required
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGoogleRole('student')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                    googleRole === 'student'
                      ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 text-white shadow-lg shadow-orange-500/10'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="font-extrabold text-sm tracking-wide">Student</span>
                  <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">
                    Find a Mentor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGoogleRole('mentor')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                    googleRole === 'mentor'
                      ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 text-white shadow-lg shadow-orange-500/10'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="font-extrabold text-sm tracking-wide">Mentor</span>
                  <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">
                    Guide Students
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={googlePhone}
                onChange={(e) => setGooglePhone(e.target.value)}
                placeholder="9876543210"
                title="Please enter exactly 10 digits"
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-lg bg-[#FF6B2B] text-white font-black hover:bg-[#e05a1f] transition-all disabled:opacity-70 shadow-lg shadow-[#FF6B2B]/20"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>

            <button
              type="button"
              onClick={() => {
                setGoogleSignupStep(false);
                setGoogleUser(null);
                setGoogleRole('');
                setGooglePhone('');
                setError('');
              }}
              className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F2E] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0F143C]/50 rounded-lg shadow-xl p-8 border border-white/10">
        {customMessage && (
          <div className="mb-6 p-4 rounded-lg bg-orange-500/10 border border-[#FF6B2B]/20 text-xs font-semibold text-[#FFB38E] text-center flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
              />
            </svg>
            <span>{customMessage}</span>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {isLogin ? 'Log in to access your dashboard.' : 'Join Atyant as a student or mentor.'}
          </p>
        </div>

        {!isLogin && referralCode && (
          <div className="mb-6 p-3 rounded-lg bg-orange-500/10 border border-[#FF6B2B]/20 text-xs font-semibold text-[#FFB38E] text-center flex items-center justify-center gap-2">
            <Gift className="w-4 h-4 text-[#FF6B2B] shrink-0" />
            <span>You were invited by a friend — signing up counts toward their referral rewards.</span>
          </div>
        )}

        {/* Role Toggle for Signup */}
        {!isLogin && (
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                Select Your Role <span className="text-red-500">*</span>
              </span>
              {!role && (
                <span className="text-xs font-semibold text-[#FF6B2B] animate-pulse bg-white/5 px-2 py-0.5 rounded-md">
                  Please select one
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Student Option */}
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                  role === 'student'
                    ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 text-white shadow-lg shadow-orange-500/10'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-2 transition-colors duration-300 ${
                    role === 'student' ? 'bg-[#FF6B2B] text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.263 15.918a9 9 0 1 0 15.474 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v7.5m0-7.5H4.263m7.737 0h7.737"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3L2 8l10 5 10-5-10-5z"
                    />
                  </svg>
                </div>
                <span className="font-extrabold text-sm tracking-wide">Student</span>
                <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">
                  Find a Mentor
                </span>
              </button>

              {/* Mentor Option */}
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                  role === 'mentor'
                    ? 'border-[#FF6B2B] bg-[#FF6B2B]/10 text-white shadow-lg shadow-orange-500/10'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-2 transition-colors duration-300 ${
                    role === 'mentor' ? 'bg-[#FF6B2B] text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.005 9.005 0 0 0-12 0m12 0a8.987 8.987 0 0 1-6 2.24 8.987 8.987 0 0 1-6-2.24m12 0V15a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v3.72M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
                <span className="font-extrabold text-sm tracking-wide">Mentor</span>
                <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">
                  Guide Students
                </span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center font-medium">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              title="Please enter exactly 10 digits"
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-lg bg-[#FF6B2B] text-white font-black hover:bg-[#e05a1f] transition-all disabled:opacity-70 shadow-lg shadow-[#FF6B2B]/20"
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#0F143C] px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or
          </span>
        </div>

        {/* Google Sign-in Container */}
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <div className="relative w-full overflow-hidden rounded-lg">
            {/* Custom Google Button matching design system */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white font-semibold text-sm"
            >
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            {/* Invisible Google Button Overlay */}
            <div
              id="googleSignInDiv"
              className="absolute inset-0 w-full h-full opacity-[0.01] overflow-hidden pointer-events-auto"
            ></div>
          </div>

          {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div className="text-[10px] text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/10 text-center w-full mt-2 flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Google Client ID not configured. Please add{' '}
                <code className="font-mono text-orange-400 font-bold bg-white/5 px-1 rounded">
                  VITE_GOOGLE_CLIENT_ID
                </code>{' '}
                to your frontend <code className="font-mono bg-white/5 px-1 rounded">.env</code> file.
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setRole(''); // Reset role selection so they must choose
              setError('');
            }}
            className="text-sm font-semibold text-slate-400 hover:text-white transition"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-500 hover:text-slate-300 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
