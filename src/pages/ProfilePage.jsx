import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_INDIAN_STATES, POPULAR_LANGUAGES, COLLEGES_BY_TYPE, DEPARTMENTS } from '../data/siteContent';
import { getUserMe, updateUser, uploadProfilePhoto, uploadIdDoc, getMyBookings, deleteIdDoc, verifyPayment, googleLogin } from '../utils/api';
import API_BASE from '../utils/api';
import { getDetailedWhatsAppLink } from '../utils/whatsapp';
import { Flame, Trophy, BarChart2, Gift, Users, User, ShieldCheck, Mail, Phone, Calendar, ShoppingBag, Lock, Award, FileText } from 'lucide-react';

const AVAILABLE_BUNDLES = [
  {
    id: 'complete-round',
    name: 'Complete Round Support',
    price: 999,
    originalPrice: 1999,
    discount: '50% OFF – Most Popular Package',
    badge: '⭐ Most Popular',
    icon: '🛡️',
    desc: 'Full JoSAA + CSAB support till final allotment. Peace of mind during every counselling round.',
    includes: [
      'Round-by-round JoSAA + CSAB support',
      'Dedicated mentor throughout',
      'Priority WhatsApp support',
      'Backup planning if allotment changes',
      'Support till final rounds',
      '🎁 Premium Advantage Pack included',
    ],
    mentorNote: 'You commit to being their dedicated personal mentor through all rounds of JoSAA + CSAB till final seat allotment.',
  },
  {
    id: 'ultimate-peace',
    name: 'Ultimate Peace of Mind',
    price: 1999,
    originalPrice: 2999,
    discount: '33% OFF – 1-on-1 Premium',
    icon: '👑',
    desc: 'Highest level of personal support. 1-on-1 premium guidance from start to finish.',
    includes: [
      'Everything in ₹999 package, plus:',
      'Personal 1-on-1 mentor',
      'Personalized preference review',
      'Final decision support calls',
      'Unlimited WhatsApp access',
      'Post-allotment transition guidance',
      '🎁 Bonus Guides Included',
    ],
    mentorNote: 'You commit to ultimate handholding, unlimited WhatsApp, preference reviews, and college transition guidance.',
  },
];

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, nudge }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 text-center gap-1 hover:bg-white/10 transition-all duration-200 min-h-[130px]">
      <Icon className="w-6 h-6 text-[#FF6B2B]" strokeWidth={2} />
      <span className="text-xl font-black text-white leading-tight mt-1">{value}</span>
      <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">{label}</span>
      {nudge && <span className="text-[9px] text-[#FFB38E] mt-1 leading-tight font-medium max-w-[130px]">{nudge}</span>}
    </div>
  );
}

// ── Profile Completion Calculator ────────────────────────────────────────────
function calcCompletion(user, name, profilePhotoFilename, verificationStatus) {
  // Photo counts as done if user uploaded one OR linked Google (which provides avatar)
  const hasPhoto = !!(profilePhotoFilename || user?.googleAvatar);
  const checks = [
    !!name,
    !!(user?.phone || user?.email),
    hasPhoto,
    !!(user?.gender), // gender is a meaningful completion item for all roles
  ];
  if (user?.role === 'mentor') {
    checks.push(
      !!(user?.college),
      !!(user?.branch),
      !!(user?.rank),
      verificationStatus === 'verified',
      !!(user?.bio),
    );
  }
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

// ── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-[#0F143C]/50 rounded-lg border border-white/10 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/10 bg-white/5">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-black text-white tracking-wide uppercase">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Field Component ──────────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-300 mb-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {hint && <p className="text-[11px] text-white/50 mb-2 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition text-sm text-white placeholder-slate-500';
const disabledCls = `${inputCls} opacity-50 text-slate-400 cursor-not-allowed`;
const selectCls = `${inputCls} cursor-pointer [&>option]:bg-[#0F143C] [&>option]:text-white`;

// ── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const [name, setName] = useState('');

  // Mentor-specific Profile Fields State
  const [collegeType, setCollegeType] = useState('');
  const [college, setCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [customBranch, setCustomBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [state, setState] = useState('');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('');
  const [categoryRank, setCategoryRank] = useState('');
  const [preferredLang, setPreferredLang] = useState('');
  const [gender, setGender] = useState('');
  const [bundles, setBundles] = useState([]);
  const [bio, setBio] = useState('');

  const [profilePhotoFilename, setProfilePhotoFilename] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('none');
  const [idDocFilename, setIdDocFilename] = useState('');
  const [idDocUploading, setIdDocUploading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);
  const [syncingGoogle, setSyncingGoogle] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const photoInputRef = useRef(null);
  const idDocInputRef = useRef(null);

  const MAX_BIO_CHARS = 5000;

  const completion = calcCompletion(user, name, profilePhotoFilename, verificationStatus);

  useEffect(() => {
    if (user) {
      setLoadingBookings(true);
      getMyBookings()
        .then((res) => { if (res?.bookings) setBookings(res.bookings); })
        .catch((err) => console.error('Failed to fetch bookings:', err))
        .finally(() => setLoadingBookings(false));
    }
  }, [user]);

  // Cashfree Redirect Payment Verification Hook
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    if (orderId) {
      setError('');
      setSuccess('Confirming your payment with Cashfree...');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      verifyPayment({ cashfreeOrderId: orderId })
        .then(() => {
          setSuccess('Payment successful! Welcome to premium mentorship!');
          setTimeout(() => setSuccess(''), 5000);
          getUserMe().then(r => { if (r?.user) setUser(r.user); });
          getMyBookings().then(r => {
            if (r?.bookings && r.bookings.length > 0) {
              setBookings(r.bookings);
              const freshBooking = r.bookings[0];
              if (freshBooking) {
                const redirectLink = getDetailedWhatsAppLink(freshBooking);
                localStorage.removeItem('atyant_pending_redirect');
                setTimeout(() => { window.open(redirectLink, '_blank'); }, 1500);
              }
            } else {
              if (r?.bookings) setBookings(r.bookings);
              const pendingRedirect = localStorage.getItem('atyant_pending_redirect');
              if (pendingRedirect) {
                localStorage.removeItem('atyant_pending_redirect');
                setTimeout(() => { window.open(pendingRedirect, '_blank'); }, 1500);
              }
            }
          });
        })
        .catch((err) => {
          setError(err.message || 'Payment verification failed. If money was debited, please contact support.');
          setSuccess('');
        });
    }
  }, [setUser]);

  const activeCollegeList = useMemo(() => {
    if (!collegeType) return [];
    return COLLEGES_BY_TYPE[collegeType] || [];
  }, [collegeType]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setGender(user.gender || '');  // load for all roles
      if (user.role === 'mentor') {
        if (user.college) {
          const matchedType = Object.keys(COLLEGES_BY_TYPE).find(type =>
            COLLEGES_BY_TYPE[type].includes(user.college)
          );
          if (matchedType) {
            setCollegeType(matchedType);
            setCollege(user.college);
            setCustomCollege('');
          } else {
            setCollegeType('OTHERS');
            setCollege('OTHER_MANUAL');
            setCustomCollege(user.college);
          }
        }

        if (user.branch) {
          if (DEPARTMENTS.includes(user.branch)) {
            setBranch(user.branch);
            setCustomBranch('');
          } else {
            setBranch('OTHER_MANUAL');
            setCustomBranch(user.branch);
          }
        } else {
          setBranch('');
          setCustomBranch('');
        }
        setCgpa(user.cgpa || '');
        setState(user.state || '');
        setCategory(user.category || '');
        setRank(user.rank || '');
        setCategory(user.category || 'General');
        setCategoryRank(user.categoryRank || '');
        setPreferredLang(user.preferredLang || '');
        setGender(user.gender || '');

        const mappedBundles = (user.bundles || []).map(b => {
          if (['Quick Clarity', 'quick-clarity', 'Starter Clarity', 'starter-clarity', 'Complete Guidance', 'complete-guidance'].includes(b)) return null;
          if (['Dream Seat Protection™', 'dream-seat', 'Complete Round Support', 'complete-round'].includes(b)) return 'complete-round';
          if (['Ultimate Peace of Mind', 'ultimate-peace'].includes(b)) return 'ultimate-peace';
          return b;
        }).filter(Boolean);
        setBundles(mappedBundles);
        setBio(user.bio || '');
        setProfilePhotoFilename(user.profilePhotoFilename || '');
        setVerificationStatus(user.verificationStatus || 'none');
        setIdDocFilename(user.idDocFilename || '');
      }
    } else if (!localStorage.getItem('user_token')) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    setUser(null);
    navigate('/');
  };

  const handleBioChange = (e) => {
    if (e.target.value.length <= MAX_BIO_CHARS) setBio(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = { name, gender };  // gender saved for all roles
      if (user.role === 'mentor') {
        payload.college = college === 'OTHER_MANUAL' ? customCollege : college;
        payload.branch = branch === 'OTHER_MANUAL' ? customBranch : branch;
        payload.cgpa = cgpa || undefined;
        payload.state = state;
        payload.category = category;
        payload.rank = rank;
        payload.categoryRank = categoryRank || undefined;
        payload.preferredLang = preferredLang;
        payload.bio = bio;
      }
      const res = await updateUser(payload);
      setUser(res.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    setError('');
    try {
      const res = await uploadProfilePhoto(file);
      setProfilePhotoFilename(res.filename);
      setSuccess('Profile photo updated!');
      setTimeout(() => setSuccess(''), 3000);
      setUser({ ...user, profilePhotoFilename: res.filename });
    } catch (err) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  // Trigger Google One-Tap to link account and sync profile picture
  const handleSyncGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google Sign-in is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file.');
      return;
    }
    if (!window.google?.accounts?.id) {
      setError('Google Sign-in script not loaded. Please refresh the page and try again.');
      return;
    }
    setSyncingGoogle(true);
    setError('');
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const data = await googleLogin(response.credential);
          if (data?.user) {
            setUser({ ...user, ...data.user });
            setSuccess('Google account linked! Your profile picture has been synced. ✅');
            setTimeout(() => setSuccess(''), 4000);
          } else {
            setError('Could not retrieve Google account info. Please try again.');
          }
        } catch (err) {
          setError(err.message || 'Failed to link Google account.');
        } finally {
          setSyncingGoogle(false);
        }
      },
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setSyncingGoogle(false);
        setError('Google Sign-in prompt was dismissed. Please try again.');
      }
    });
  };


  const handleIdDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIdDocUploading(true);
    setError('');
    try {
      const res = await uploadIdDoc(file);
      setVerificationStatus(res.verificationStatus);
      if (res.filename) setIdDocFilename(res.filename);
      setSuccess(res.message || 'ID document uploaded successfully!');
      setUser({ ...user, verificationStatus: res.verificationStatus, idDocFilename: res.filename });
    } catch (err) {
      setError(err.message || 'Failed to upload ID document');
    } finally {
      setIdDocUploading(false);
    }
  };

  const handleDeleteIdDoc = async () => {
    if (!window.confirm('Are you sure you want to delete your uploaded document?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await deleteIdDoc();
      setVerificationStatus(res.verificationStatus);
      setIdDocFilename('');
      setSuccess(res.message || 'ID document deleted successfully!');
      setUser({ ...user, verificationStatus: res.verificationStatus, idDocFilename: '' });
    } catch (err) {
      setError(err.message || 'Failed to delete ID document');
    }
  };

  const photoSrc = profilePhotoFilename
    ? `${API_BASE}/api/upload/profile-photo/${profilePhotoFilename}`
    : (user?.googleAvatar || null);

  const initials = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : (user?.role === 'mentor' ? 'M' : 'S');

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'bookings', label: 'My Bookings', icon: <ShoppingBag className="w-4 h-4" />, count: bookings.length },
    ...(user.role === 'mentor' ? [{ id: 'verification', label: 'Verification', icon: <Lock className="w-4 h-4" /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#0B0F2E] py-8 px-4">

      {/* ── Hero Header Card ── */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#141936] to-[#0d1128] border border-white/10 shadow-2xl">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B2B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* ── Avatar ── */}
              <div
                className="relative flex-shrink-0 group cursor-pointer"
                onMouseEnter={() => setPhotoHover(true)}
                onMouseLeave={() => setPhotoHover(false)}
                onClick={() => photoInputRef.current?.click()}
                title="Click to change photo"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                  {/* Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#FFB38E] p-[3px]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#141936]">
                      {photoSrc ? (
                        <img src={photoSrc} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br from-[#FF6B2B]/30 to-purple-500/20">
                          {initials}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className={`absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center transition-all duration-200 ${photoHover ? 'opacity-100' : 'opacity-0'}`}>
                    {photoUploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-white mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[9px] text-white font-bold">Change</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Source badge: Google avatar vs. custom upload */}
                {user?.googleAvatar && !profilePhotoFilename ? (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full border-2 border-[#141936] flex items-center justify-center shadow-md" title="Using Google profile photo">
                    <svg viewBox="0 0 24 24" className="w-3 h-3" aria-label="Google">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#141936]" />
                )}
              </div>
              <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} accept="image/jpeg,image/png,image/webp" className="hidden" />

              {/* Sync from Google button – shown when user has gmail but no google avatar */}
              {!user?.googleAvatar && !profilePhotoFilename && user?.email?.endsWith('@gmail.com') && (
                <button
                  type="button"
                  onClick={handleSyncGoogle}
                  disabled={syncingGoogle}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] font-bold transition-all duration-200 disabled:opacity-60"
                  title="Sync your Google profile picture"
                >
                  {syncingGoogle ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {syncingGoogle ? 'Syncing…' : 'Sync from Google'}
                </button>
              )}


              {/* ── Name & Info ── */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{name || 'Your Name'}</h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    user.role === 'mentor' ? 'bg-[#FF6B2B]/20 text-[#FF6B2B]' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {user.role === 'mentor' ? '🎓 Mentor' : '📚 Student'}
                  </span>
                  {user.role === 'mentor' && verificationStatus === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/20 text-green-400">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-sm mt-1 font-medium">
                  {user.phone ? `+91 ${user.phone}` : user.email || '—'}
                </p>
                {user.role === 'mentor' && user.college && (
                  <p className="text-white/60 text-sm mt-0.5">📍 {user.college}{user.branch ? ` · ${user.branch}` : ''}</p>
                )}

                {/* Profile completion bar */}
                <div className="mt-3 max-w-xs mx-auto sm:mx-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/40 font-semibold">Profile Completion</span>
                    <span className={`text-[11px] font-black ${completion === 100 ? 'text-green-400' : 'text-[#FF6B2B]'}`}>{completion}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${completion}%`,
                        background: completion === 100 ? '#22c55e' : 'linear-gradient(90deg, #FF6B2B, #FFB38E)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Logout ── */}
              <button
                type="button"
                onClick={handleLogout}
                className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-400/80 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition border border-red-500/10"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <StatCard 
                icon={Flame} 
                label="Current Streak" 
                value={`${user.currentStreak || 0}d`} 
                nudge={!user.currentStreak ? "Complete your first task to start a streak" : null}
              />
              <StatCard 
                icon={Trophy} 
                label="Best Streak" 
                value={`${user.longestStreak || 0}d`} 
                nudge={!user.longestStreak ? "Build a daily habit!" : null}
              />
              <StatCard 
                icon={BarChart2} 
                label="Progress" 
                value={`${Math.round(user.overallProgress || 0)}%`} 
                nudge={!user.overallProgress ? "Start exploring college guide!" : null}
              />
              {user.referralCode ? (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(user.referralCode);
                    setSuccess('Referral code copied!');
                    setTimeout(() => setSuccess(''), 2000);
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-center gap-1 transition-all duration-200 group min-h-[130px]"
                  title="Click to copy referral code"
                >
                  <Gift className="w-6 h-6 text-[#FF6B2B]" strokeWidth={2} />
                  <span className="text-sm font-black text-white leading-tight font-mono tracking-wider mt-1">{user.referralCode}</span>
                  <span className="text-[10px] font-semibold text-[#FF6B2B]/80 uppercase tracking-wider group-hover:text-[#FF6B2B]">Copy Referral</span>
                  {!user.referralCount && (
                    <span className="text-[9px] text-[#FFB38E] mt-1 leading-tight font-medium max-w-[130px]">Share with friends to get rewards!</span>
                  )}
                </button>
              ) : (
                <StatCard 
                  icon={Users} 
                  label="Referrals" 
                  value={user.referralCount || 0} 
                  nudge={!user.referralCount ? "Invite friends to earn rewards" : null}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="max-w-3xl mx-auto space-y-3 mb-4">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-medium border border-red-100">
            <span className="text-lg shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-medium border border-green-100">
            <span className="text-lg shrink-0">✅</span>
            <span>{success}</span>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="max-w-3xl mx-auto mb-5">
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10 overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-[#0B0F2E] shadow-sm'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#FF6B2B] text-white' : 'bg-white/10 text-white/60'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────────── TAB: PROFILE ──────────────────── */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto space-y-5">
          <form onSubmit={handleSave} className="space-y-5">

            {/* Basic Info */}
            <Section title="Basic Information" icon="🪪">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone Number">
                  <input type="tel" disabled value={user.phone || '—'} className={disabledCls} />
                </Field>
                {user.email && (
                  <Field label="Email Address">
                    <input type="email" disabled value={user.email} className={disabledCls} />
                  </Field>
                )}
                {user.role === 'student' && (
                  <Field label="Gender">
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectCls}>
                      <option value="">Select gender...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </Field>
                )}
                <Field label="Member Since">
                  <input
                    type="text" disabled
                    value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    className={disabledCls}
                  />
                </Field>
              </div>
            </Section>

            {/* Mentor-specific */}
            {user.role === 'mentor' && (
              <>
                {/* Academic Details */}
                <Section title="Academic Details" icon="🎓">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="College Type" required>
                        <select
                          required value={collegeType}
                          onChange={(e) => { setCollegeType(e.target.value); setCollege(''); setCustomCollege(''); }}
                          className={selectCls}
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="IIT">IIT</option>
                          <option value="NIT">NIT</option>
                          <option value="IIIT">IIIT</option>
                          <option value="STATE GOV.">STATE GOV.</option>
                          <option value="PRIVATE">PRIVATE</option>
                          <option value="OTHERS">OTHERS</option>
                        </select>
                      </Field>
                      <Field label="College Name" required>
                        <select
                          required disabled={!collegeType} value={college}
                          onChange={(e) => { setCollege(e.target.value); if (e.target.value !== 'OTHER_MANUAL') setCustomCollege(''); }}
                          className={`${selectCls} disabled:opacity-60`}
                        >
                          <option value="">{collegeType ? 'Select College' : 'Choose Type First'}</option>
                          {activeCollegeList.map(n => <option key={n} value={n}>{n}</option>)}
                          {collegeType && <option value="OTHER_MANUAL">Other / Not Listed</option>}
                        </select>
                      </Field>
                    </div>

                    {college === 'OTHER_MANUAL' && (
                      <Field label="Type Your College Name" required hint="Enter the full official name of your institution.">
                        <input
                          type="text" required value={customCollege}
                          onChange={(e) => setCustomCollege(e.target.value)}
                          placeholder="e.g. Harcourt Butler Technical University"
                          className={inputCls}
                        />
                      </Field>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="sm:col-span-2">
                        <Field label="Department / Branch" required>
                          <select
                            required value={branch}
                            onChange={(e) => { setBranch(e.target.value); if (e.target.value !== 'OTHER_MANUAL') setCustomBranch(''); }}
                            className={selectCls}
                          >
                            <option value="" disabled>Select Department</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            <option value="OTHER_MANUAL">Other (Type Manually)</option>
                          </select>
                        </Field>
                      </div>
                      <Field label="CGPA (Optional)">
                        <input
                          type="number" step="0.01" min="0" max="10"
                          value={cgpa} onChange={(e) => setCgpa(e.target.value)}
                          placeholder="e.g. 8.45" className={inputCls}
                        />
                      </Field>
                    </div>

                    {branch === 'OTHER_MANUAL' && (
                      <Field label="Type Your Department" required hint="Enter your department or specialized branch.">
                        <input
                          type="text" required value={customBranch}
                          onChange={(e) => setCustomBranch(e.target.value)}
                          placeholder="e.g. Industrial Design / Materials Science"
                          className={inputCls}
                        />
                      </Field>
                    )}
                  </div>
                </Section>

                {/* JEE Details */}
                <Section title="JEE Counselling Profile" icon="📈">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field label="JEE Rank (CRL)" required>
                      <input
                        type="number" required value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        placeholder="e.g. 1500" className={inputCls}
                      />
                    </Field>
                    <Field label="Admission Category" required>
                      <select required value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
                        <option value="General">General / OPEN</option>
                        <option value="OBC-NCL">OBC-NCL</option>
                        <option value="EWS">EWS</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="PwD">PwD</option>
                      </select>
                    </Field>
                    <Field label="Category Rank (Optional)">
                      <input
                        type="number" value={categoryRank}
                        onChange={(e) => setCategoryRank(e.target.value)}
                        placeholder="e.g. 420" className={inputCls}
                      />
                    </Field>
                    <Field label="Home State" required>
                      <select required value={state} onChange={(e) => setState(e.target.value)} className={selectCls}>
                        <option value="">Select state...</option>
                        {ALL_INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Preferred Language" required>
                      <select required value={preferredLang} onChange={(e) => setPreferredLang(e.target.value)} className={selectCls}>
                        <option value="" disabled>Select Language</option>
                        {POPULAR_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Gender">
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectCls}>
                        <option value="">Select gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                    </Field>
                  </div>
                </Section>

                {/* Bio */}
                <Section title="Your Mentor Pitch" icon="✍️">
                  <Field
                    label="Bio / One-Liner"
                    hint="Students come to you for one big decision — which college and branch to pick. Write a short pitch telling them why you're the right mentor."
                  >
                    <div className="relative">
                      <textarea
                        value={bio}
                        onChange={handleBioChange}
                        placeholder="NIT Trichy CSE, AIR 1,800. I'll help you pick the right college-branch combo for your rank — no generic advice, just what actually worked."
                        rows={4}
                        maxLength={MAX_BIO_CHARS}
                        className={`${inputCls} resize-none pb-8`}
                      />
                      <div className="absolute bottom-3 right-4 text-xs font-medium text-slate-300 pointer-events-none">
                        <span className={bio.length >= MAX_BIO_CHARS ? 'text-red-500 font-semibold' : ''}>{bio.length}</span>
                        <span>/{MAX_BIO_CHARS}</span>
                      </div>
                    </div>
                  </Field>
                </Section>

                {/* Bundles — read-only */}
                <Section title="Assigned Bundles" icon={<ShieldCheck className="w-4 h-4 text-[#FF6B2B]" />}>
                  <p className="text-xs text-slate-400 mb-4">Managed by the Atyant team. To add or change packages, contact admin support.</p>
                  <div className="space-y-4">
                    {AVAILABLE_BUNDLES.map(b => {
                      const isSelected = bundles.includes(b.id);
                      return (
                        <div
                          key={b.id}
                          className={`relative flex gap-4 p-5 rounded-lg border transition-all duration-200 cursor-default ${
                            isSelected ? 'border-[#FF6B2B] bg-[#FF6B2B]/10' : 'border-white/10 bg-white/5 opacity-50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-[#FF6B2B] border-[#FF6B2B]' : 'border-white/20'}`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-sm font-black text-white">{b.name}</span>
                              <span className="text-sm font-black text-white flex-shrink-0">₹{b.price}</span>
                            </div>
                            <p className="text-xs text-slate-400 italic">{b.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              </>
            )}

            {/* Save */}
            <div className="pb-8">
              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] text-white font-black text-base hover:opacity-90 transition-all disabled:opacity-60 shadow-xl shadow-[#FF6B2B]/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes…
                  </span>
                ) : '💾 Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── TAB: BOOKINGS ─── */}
      {activeTab === 'bookings' && (
        <div className="max-w-3xl mx-auto pb-8">
          {loadingBookings ? (
            <div className="bg-[#0F143C]/50 rounded-lg p-10 text-center border border-white/10 shadow-sm">
              <div className="w-6 h-6 border-2 border-[#FF6B2B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Loading your bookings…</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-[#0F143C]/50 rounded-lg border border-white/10 shadow-sm p-5 hover:border-white/20 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white">{booking.planTitle}</span>
                        <span className="text-[10px] font-bold bg-green-500/15 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/20">Paid</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Ordered on {new Date(booking.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-lg font-black text-[#FF6B2B]">₹{booking.amount / 100}</div>
                  </div>

                  {booking.mentorId ? (
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B2B]/20 to-[#FF8E53]/25 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                        {booking.mentorId.profilePhotoFilename ? (
                          <img src={`${API_BASE}/api/upload/profile-photo/${booking.mentorId.profilePhotoFilename}`} alt={booking.mentorId.name} className="w-full h-full object-cover" />
                        ) : booking.mentorId.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{booking.mentorId.name}</div>
                        <div className="text-[10px] text-[#FF6B2B] font-semibold">{booking.mentorId.college}</div>
                        <div className="text-[9px] text-slate-400">AIR {booking.mentorId.rank || 'N/A'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic mb-4">No specific mentor assigned yet. Support will assign one!</div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">ℹ️ Connect on WhatsApp after payment</span>
                    <a
                      href={getDetailedWhatsAppLink(booking)} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba56] transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      💬 Connect on WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0F143C]/50 rounded-lg p-10 text-center border border-white/10 shadow-sm">
              <GraduationCap className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">No mentorship sessions purchased yet.</p>
              <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">Get rank-based guidance from NIT/IIT seniors and secure your dream seat.</p>
              <button
                onClick={() => navigate('/mentors')}
                className="px-6 py-2.5 rounded-lg bg-[#FF6B2B] text-white text-sm font-bold hover:bg-orange-600 transition"
              >
                Browse Mentors & Bundles
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: VERIFICATION (mentors only) ─── */}
      {activeTab === 'verification' && user.role === 'mentor' && (
        <div className="max-w-3xl mx-auto pb-8">
          <Section title="Identity Verification" icon={<Lock className="w-4 h-4 text-[#FF6B2B]" />}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="text-sm font-bold text-white">Verification Status</h4>
                <p className="text-xs text-slate-400 mt-0.5">Upload your College ID or Aadhaar Card to get verified and appear to students.</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide ${
                verificationStatus === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                verificationStatus === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                verificationStatus === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-white/5 text-slate-400 border border-white/10'
              }`}>
                {verificationStatus.toUpperCase()}
              </div>
            </div>

            {verificationStatus === 'verified' && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400 font-medium flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                <span>Your identity has been verified! Students can see your verified badge.</span>
              </div>
            )}

            {verificationStatus === 'pending' && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 font-medium flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Your document is under review. This usually takes 1–2 business days.</span>
              </div>
            )}

            {verificationStatus !== 'verified' && (
              <div className="mt-2">
                <input type="file" ref={idDocInputRef} onChange={handleIdDocUpload} accept="image/jpeg,image/png,application/pdf" className="hidden" />
                <button
                  type="button"
                  onClick={() => idDocInputRef.current?.click()}
                  disabled={idDocUploading}
                  className="w-full py-4 bg-white/5 border-2 border-dashed border-white/20 rounded-lg text-slate-300 font-bold hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  {idDocUploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading…</>
                  ) : (
                    <><FileText className="w-4 h-4" />Select Document to Upload</>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">Accepted: JPG, PNG, PDF · Max size 10MB</p>
              </div>
            )}

            {idDocFilename && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-white truncate max-w-[180px]" title={idDocFilename}>{idDocFilename}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <a
                    href={`${API_BASE}/api/upload/id-doc/${user.id || user._id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs font-bold text-[#FF6B2B] hover:text-orange-600 transition"
                  >
                    View ↗
                  </a>
                  <button
                    type="button"
                    onClick={handleDeleteIdDoc}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition border-l border-white/10 pl-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Section>
        </div>
      )}

    </div>
  );
}