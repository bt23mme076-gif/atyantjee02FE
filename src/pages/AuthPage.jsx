import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userLogin, userSignup } from '../utils/api';

export default function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(''); // Empty string by default, forcing user to select one

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const customMessage = location.state?.message;

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
        res = await userLogin({ phone, password });
      } else {
        res = await userSignup({ name, phone, password, role });
      }
      if (setUser) setUser(res.user);

      // Check for pending booking redirect
      const pendingBooking = localStorage.getItem('atyant_pending_booking');
      if (pendingBooking && res.user.role === 'student') {
        navigate('/mentors');
      } else {
        navigate(res.user.role === 'mentor' ? '/profile' : '/');
      }

    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

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
