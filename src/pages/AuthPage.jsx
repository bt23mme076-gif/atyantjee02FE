import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userLogin, userSignup, googleLogin, googleSignup } from '../utils/api';

export default function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
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

  const completeAuthRedirect = (userObj) => {
    const pendingBooking = localStorage.getItem('atyant_pending_booking');
    if (pendingBooking && userObj.role === 'student') {
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
      setError("Please select a role: Student or Mentor");
      return;
    }
    if (googlePhone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
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
          window.google.accounts.id.renderButton(
            btnElem,
            { theme: 'outline', size: 'large', width: '100%', text: 'continue_with' }
          );
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
      setError("Please select a role: Student or Mentor");
      return;
    }
    if(!isLogin && phone.length!=10){setError("Invalid Phone Number");return;}
    setLoading(true);
    
    try {
      let res;
      if (isLogin) {
        const deviceInfo = typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 150) : '';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#0B0F2E]">Complete your Profile</h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              Hi {googleUser?.name}, please choose your role and enter your 10-digit phone number to finish signing up.
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
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={googleUser?.email || ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 font-medium focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Select Your Role <span className="text-red-500">*</span>
                </span>
                {!googleRole && (
                  <span className="text-xs font-semibold text-[#FF6B2B] animate-pulse bg-orange-50 px-2 py-0.5 rounded-md">
                    Required
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGoogleRole('student')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                    googleRole === 'student'
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 text-[#8B5CF6] shadow-lg shadow-purple-500/10'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span className="font-extrabold text-sm tracking-wide">Student</span>
                  <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">Find a Mentor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGoogleRole('mentor')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                    googleRole === 'mentor'
                      ? 'border-[#FF6B2B] bg-[#FF6B2B]/5 text-[#FF6B2B] shadow-lg shadow-orange-500/10'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span className="font-extrabold text-sm tracking-wide">Mentor</span>
                  <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">Guide Students</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={googlePhone}
                onChange={(e) => setGooglePhone(e.target.value)}
                placeholder="9876543210"
                title="Please enter exactly 10 digits"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl bg-[#FF6B2B] text-white font-black hover:bg-[#e05a1f] transition-all disabled:opacity-70 shadow-lg shadow-[#FF6B2B]/20"
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
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">

        {customMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-orange-50/50 border border-[#FF6B2B]/20 text-xs font-semibold text-[#FF6B2B] text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
            <span>{customMessage}</span>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#0B0F2E]">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {isLogin ? 'Log in to access your dashboard.' : 'Join Atyant as a student or mentor.'}
          </p>
        </div>

        {!isLogin && referralCode && (
          <div className="mb-6 p-3 rounded-2xl bg-purple-50 border border-[#8B5CF6]/20 text-xs font-semibold text-[#8B5CF6] text-center">
            🎁 You were invited by a friend — signing up counts toward their referral rewards.
          </div>
        )}

        {/* Role Toggle for Signup */}
        {!isLogin && (
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                Select Your Role <span className="text-red-500">*</span>
              </span>
              {!role && (
                <span className="text-xs font-semibold text-[#FF6B2B] animate-pulse bg-orange-50 px-2 py-0.5 rounded-md">
                  Please select one
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Student Option */}
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                  role === 'student'
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 text-[#8B5CF6] shadow-lg shadow-purple-500/10'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className={`p-3 rounded-full mb-2 transition-colors duration-300 ${
                  role === 'student' ? 'bg-[#8B5CF6] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.263 15.918a9 9 0 1 0 15.474 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v7.5m0-7.5H4.263m7.737 0h7.737" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8l10 5 10-5-10-5z" />
                  </svg>
                </div>
                <span className="font-extrabold text-sm tracking-wide">Student</span>
                <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">Find a Mentor</span>
              </button>

              {/* Mentor Option */}
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                  role === 'mentor'
                    ? 'border-[#FF6B2B] bg-[#FF6B2B]/5 text-[#FF6B2B] shadow-lg shadow-orange-500/10'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className={`p-3 rounded-full mb-2 transition-colors duration-300 ${
                  role === 'mentor' ? 'bg-[#FF6B2B] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.005 9.005 0 0 0-12 0m12 0a8.987 8.987 0 0 1-6 2.24 8.987 8.987 0 0 1-6-2.24m12 0V15a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v3.72M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <span className="font-extrabold text-sm tracking-wide">Mentor</span>
                <span className="text-[10px] text-slate-400 mt-1 text-center font-medium leading-none">Guide Students</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              title="Please enter exactly 10 digits"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-[#FF6B2B] text-white font-black hover:bg-[#e05a1f] transition-all disabled:opacity-70 shadow-lg shadow-[#FF6B2B]/20"
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or
          </span>
        </div>

        {/* Google Sign-in Container */}
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <div id="googleSignInDiv" className="w-full flex justify-center"></div>
          {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center w-full mt-2">
              ⚠️ Google Client ID not configured. Please add <code className="font-mono text-pink-600 font-bold bg-pink-50/50 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> to your frontend <code className="font-mono bg-slate-100 px-1 rounded">.env</code> file.
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
            className="text-sm font-semibold text-slate-500 hover:text-[#0B0F2E] transition"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
          >
            ← Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}
