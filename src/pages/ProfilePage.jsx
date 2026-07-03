import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_INDIAN_STATES, POPULAR_LANGUAGES, COLLEGES_BY_TYPE, DEPARTMENTS } from '../data/siteContent';
import { getUserMe, updateUser, uploadProfilePhoto, uploadIdDoc, getMyBookings, deleteIdDoc, verifyPayment } from '../utils/api';
import API_BASE from '../utils/api';
import { getDetailedWhatsAppLink } from '../utils/whatsapp';

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

export default function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  
  // Mentor-specific Profile Fields State
  const [collegeType, setCollegeType] = useState('');
  const [college, setCollege] = useState('');
  const [customCollege, setCustomCollege] = useState(''); // State to hold custom typed college name
  const [branch, setBranch] = useState('');
  const [customBranch, setCustomBranch] = useState(''); // State to hold custom typed department/branch name
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

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const photoInputRef = useRef(null);
  const idDocInputRef = useRef(null);

  // Maximum character restriction constant (set to 2000 or 5000 depending on your choice)
  const MAX_BIO_CHARS = 5000;

  useEffect(() => {
    if (user) {
      setLoadingBookings(true);
      getMyBookings()
        .then((res) => {
          if (res?.bookings) setBookings(res.bookings);
        })
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
      
      // Clean query parameter immediately from the browser history so refresh doesn't trigger verification again
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      verifyPayment({ cashfreeOrderId: orderId })
        .then((res) => {
          setSuccess('Payment successful! Welcome to premium mentorship!');
          setTimeout(() => setSuccess(''), 5000);
          
          // Re-fetch bookings and user info
          getUserMe().then(r => {
            if (r?.user) setUser(r.user);
          });
          getMyBookings().then(r => {
            if (r?.bookings && r.bookings.length > 0) {
              setBookings(r.bookings);
              const freshBooking = r.bookings[0];
              if (freshBooking) {
                const redirectLink = getDetailedWhatsAppLink(freshBooking);
                localStorage.removeItem('atyant_pending_redirect');
                setTimeout(() => {
                  window.open(redirectLink, '_blank');
                }, 1500);
              }
            } else {
              if (r?.bookings) setBookings(r.bookings);
              // Perform WhatsApp auto-launch if redirect url exists in localStorage
              const pendingRedirect = localStorage.getItem('atyant_pending_redirect');
              if (pendingRedirect) {
                localStorage.removeItem('atyant_pending_redirect');
                setTimeout(() => {
                  window.open(pendingRedirect, '_blank');
                }, 1500);
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

  // Dynamically reset college selection if type parameter alterations manifest
  const activeCollegeList = useMemo(() => {
    if (!collegeType) return [];
    return COLLEGES_BY_TYPE[collegeType] || [];
  }, [collegeType]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (user.role === 'mentor') {
        // Attempt to determine category type index configuration from value string
        if (user.college) {
          const matchedType = Object.keys(COLLEGES_BY_TYPE).find(type => 
            COLLEGES_BY_TYPE[type].includes(user.college)
          );
          if (matchedType) {
            setCollegeType(matchedType);
            setCollege(user.college);
            setCustomCollege('');
          } else {
            // Value is not in our predefined static lists, treat as custom manual input
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
          if (b === 'Quick Clarity' || b === 'quick-clarity' || b === 'Starter Clarity' || b === 'starter-clarity') {
            return null;
          }
          if (b === 'Complete Guidance' || b === 'complete-guidance') {
            return null;
          }
          if (b === 'Dream Seat Protection™' || b === 'dream-seat' || b === 'Complete Round Support' || b === 'complete-round') {
            return 'complete-round';
          }
          if (b === 'Ultimate Peace of Mind' || b === 'ultimate-peace') {
            return 'ultimate-peace';
          }
          return b;
        }).filter(Boolean);
        setBundles(mappedBundles);
        setBio(user.bio || '');
        setProfilePhotoFilename(user.profilePhotoFilename || '');
        setVerificationStatus(user.verificationStatus || 'none');
        setIdDocFilename(user.idDocFilename || '');
        
        // Show popup if profile is incomplete or verification is pending
        if (!user.college || !user.rank || user.verificationStatus === 'none') {
          setError('Please complete your profile and upload your ID document to get verified.');
        }
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

  // NOTE: bundles are now admin-managed only (backend security fix — a
  // mentor could previously self-grant any paid bundle via this form). This
  // form no longer lets mentors toggle bundles; it just displays what an
  // admin has assigned. See adminUpdateMentorBundles in the backend and the
  // read-only bundle list below.

  // Safe character limit handler function
  const handleBioChange = (e) => {
    if (e.target.value.length <= MAX_BIO_CHARS) {
      setBio(e.target.value);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = { name };
      if (user.role === 'mentor') {
        payload.college = college === 'OTHER_MANUAL' ? customCollege : college;
        payload.branch = branch === 'OTHER_MANUAL' ? customBranch : branch;
        payload.cgpa = cgpa || undefined;
        payload.state = state;
        payload.category = category;
        payload.rank = rank;
        payload.categoryRank = categoryRank || undefined;
        payload.preferredLang = preferredLang;
        payload.gender = gender;
        // bundles intentionally omitted — admin-managed only, see note above.
        payload.bio = bio;
      }

      const res = await updateUser(payload);
      setUser(res.user);
      setSuccess('Profile updated successfully!');
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
      setSuccess('Profile photo updated successfully!');
      // Update local user state
      setUser({ ...user, profilePhotoFilename: res.filename });
    } catch (err) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleIdDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIdDocUploading(true);
    setError('');
    try {
      const res = await uploadIdDoc(file);
      setVerificationStatus(res.verificationStatus);
      if (res.filename) {
        setIdDocFilename(res.filename);
      }
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

  if (!user) return null;
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-[#0B0F2E]">Your Profile</h1>
            <p className="text-slate-500 mt-1 capitalize font-medium">{user.role} Account</p>
          </div>
          <button
            type="button" onClick={handleLogout}
            className="px-4 py-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition"
          >
            Logout
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100">{success}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          
          {user.role === 'mentor' && (
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <div className="relative">
                {profilePhotoFilename ? (
                  <img 
                    src={`${API_BASE}/api/upload/profile-photo/${profilePhotoFilename}`} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm">
                    {name ? name.charAt(0).toUpperCase() : 'M'}
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  className="absolute bottom-0 right-0 bg-[#FF6B2B] text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                  title="Upload Photo"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <input 
                  type="file" 
                  ref={photoInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-slate-800">Profile Photo</h3>
                <p className="text-xs text-slate-500 mt-1">Upload a professional looking photo of yourself. This builds trust with students.</p>
                {photoUploading && <p className="text-xs text-[#FF6B2B] mt-2 font-medium animate-pulse">Uploading...</p>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              disabled
              value={user.phone}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* ── MENTOR SPECIFIC EXTENSIONS ── */}
          {user.role === 'mentor' && (
            <>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Identity Verification</h3>
                    <p className="text-xs text-slate-500 mt-1">Upload your College ID or Aadhaar Card to get verified.</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                    verificationStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                    verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {verificationStatus.toUpperCase()}
                  </div>
                </div>
                
                {verificationStatus !== 'verified' && (
                  <div>
                    <input 
                      type="file" 
                      ref={idDocInputRef} 
                      onChange={handleIdDocUpload} 
                      accept="image/jpeg, image/png, application/pdf" 
                      className="hidden" 
                    />
                    <button 
                      type="button"
                      onClick={() => idDocInputRef.current?.click()}
                      disabled={idDocUploading}
                      className="w-full py-3 bg-white border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition"
                    >
                      {idDocUploading ? 'Uploading...' : 'Select Document to Upload'}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2">Accepted formats: JPG, PNG, PDF. Max size: 10MB.</p>
                  </div>
                )}

                {idDocFilename && (
                  <div className="mt-4 p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-sm">📄</span>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[220px]" title={idDocFilename}>
                        {idDocFilename}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <a 
                        href={`${API_BASE}/api/upload/id-doc/${user.id || user._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#FF6B2B] hover:text-orange-600 transition flex items-center gap-1"
                      >
                        View Document ↗
                      </a>
                      <button
                        type="button"
                        onClick={handleDeleteIdDoc}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition flex items-center gap-1 border-l border-slate-200 pl-3"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">College Type</label>
                  <select
                    required value={collegeType} onChange={(e) => { setCollegeType(e.target.value); setCollege(''); setCustomCollege(''); }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition bg-white"
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="IIT">IIT</option>
                    <option value="NIT">NIT</option>
                    <option value="IIIT">IIIT</option>
                    <option value="STATE GOV.">STATE GOV.</option>
                    <option value="PRIVATE">PRIVATE</option>
                    <option value="OTHERS">OTHERS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">College Name</label>
                  <select
                    required disabled={!collegeType} value={college} onChange={(e) => {
                      setCollege(e.target.value);
                      if (e.target.value !== 'OTHER_MANUAL') {
                        setCustomCollege('');
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition bg-white disabled:opacity-60"
                  >
                    <option value="">{collegeType ? 'Select College Name' : 'Choose College Type First'}</option>
                    {activeCollegeList.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                    {collegeType && (
                      <option value="OTHER_MANUAL">Other / Not Listed (Type Manually)</option>
                    )}
                  </select>
                </div>
              </div>

              {college === 'OTHER_MANUAL' && (
                <div className="mt-4 animate-fadeIn p-5 bg-orange-50/20 border-2 border-dashed border-[#FF6B2B]/20 rounded-2xl">
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Type Your College Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">Please type the full official name of your institution (e.g. Harcourt Butler Technical University, Kanpur).</p>
                  <input
                    type="text"
                    required
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    placeholder="e.g. Harcourt Butler Technical University, Kanpur"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6B2B] focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/20 transition bg-white"
                  />
                </div>
              )}

              {/* Academics Track Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                  <select
                    required value={branch} onChange={(e) => {
                      setBranch(e.target.value);
                      if (e.target.value !== 'OTHER_MANUAL') {
                        setCustomBranch('');
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition bg-white"
                  >
                    <option value="" disabled>Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                    <option value="OTHER_MANUAL">Other: (Type Manually)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">CGPA (Optional)</label>
                  <input
                    type="number" step="0.01" min="0" max="10" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="e.g. 8.45"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
                  />
                </div>
              </div>

              {branch === 'OTHER_MANUAL' && (
                <div className="mt-4 animate-fadeIn p-5 bg-orange-50/20 border-2 border-dashed border-[#FF6B2B]/20 rounded-2xl">
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Type Your Department / Branch <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">Please type the name of your department or specialized branch (e.g. Industrial Design / Materials Science).</p>
                  <input
                    type="text"
                    required
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    placeholder="e.g. Industrial Design / Materials Science"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6B2B] focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/20 transition bg-white"
                  />
                </div>
              )}

              {/* Counselling Parameters Section Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Home State / Hometown</label>
                  <select
                    required value={state} onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition bg-white"
                  >
                    <option value="">Select your state...</option>
                    {ALL_INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Language</label>
                  <select
                    required value={preferredLang} onChange={(e) => setPreferredLang(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition bg-white"
                  >
                    <option value="" disabled>Select Language</option>
                    {POPULAR_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ranks & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">JEE Rank (CRL)</label>
                  <input
                    type="number" required value={rank} onChange={(e) => setRank(e.target.value)} placeholder="e.g. 1500"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Admission Category</label>
                  <select
                    required value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition bg-white"
                  >
                    <option value="General">General / OPEN</option>
                    <option value="OBC-NCL">OBC-NCL</option>
                    <option value="EWS">EWS</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="PwD">PwD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category Rank (Optional)</label>
                  <input
                    type="number" value={categoryRank} onChange={(e) => setCategoryRank(e.target.value)} placeholder="e.g. 420"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition"
                  />
                </div>
              </div>

              {/* Bio Pitch text with Dynamic Character Counter Block */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Your Pitch / Bio / One Liner</label>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">Students come to you for one big decision — which college and branch to pick with their rank. Write a short pitch telling them why you're the right mentor to guide that choice.</p>
                <div className="relative">
                  <textarea
                    value={bio} 
                    onChange={handleBioChange}
                    placeholder="NIT Trichy CSE, AIR 1,800. I'll help you pick the right college-branch combo for your rank — no generic advice, just what actually worked."
                    rows={4}
                    maxLength={MAX_BIO_CHARS}
                    className="w-full px-4 py-3 pb-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition resize-none"
                  />
                  {/* Absolute Counter Box overlay */}
                  <div className="absolute bottom-3 right-4 text-xs font-medium text-slate-400 pointer-events-none">
                    <span className={bio.length >= MAX_BIO_CHARS ? 'text-red-500 font-semibold' : ''}>
                      {bio.length}
                    </span>
                    <span>/{MAX_BIO_CHARS}</span>
                  </div>
                </div>
              </div>

              {/* Product Bundles — read-only display.
                  Bundles used to be self-service (mentors could check/uncheck
                  any package here, which meant a mentor could grant
                  themselves any paid bundle without actually being verified
                  for it). That's now an admin-only action; this section just
                  shows what's currently assigned. */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bundles You Offer</label>
                <p className="text-xs text-slate-500 mb-4">
                  Managed by the Atyant team. To add or change the packages you deliver, contact admin support — this list is read-only.
                </p>
                <div className="space-y-4">
                  {AVAILABLE_BUNDLES.map(b => {
                    const isSelected = bundles.includes(b.id);
                    return (
                      <div
                        key={b.id}
                        aria-disabled="true"
                        className={`relative flex gap-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-default ${
                          isSelected
                            ? 'border-[#FF6B2B] bg-[#FF6B2B]/5 shadow-md shadow-[#FF6B2B]/10'
                            : 'border-slate-100 opacity-60'
                        }`}
                      >
                        <div className="flex-shrink-0 pt-0.5">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-[#FF6B2B] border-[#FF6B2B]' : 'border-slate-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-black text-[#0B0F2E]">
                                {b.icon} {b.name}
                              </span>
                              {b.badge && (
                                <span className="text-[10px] font-bold bg-[#FF6B2B] text-white px-2 py-0.5 rounded-full">
                                  {b.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-black text-[#0B0F2E]">₹{b.price}</span>
                                {b.originalPrice && <span className="text-sm text-slate-400 line-through">₹{b.originalPrice}</span>}
                              </div>
                              {b.discount && <span className="text-[10px] font-bold text-[#FF6B2B]">{b.discount}</span>}
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 mb-3 leading-relaxed italic">{b.desc}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                            {b.includes.map(item => (
                              <div key={item} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                                <span className="text-[#FF6B2B] mt-0.5 font-bold leading-none">✓</span>
                                <span className="leading-snug">{item}</span>
                              </div>
                            ))}
                          </div>

                          <div className={`mt-3 text-[11px] px-3 py-2 rounded-lg font-medium ${
                            isSelected ? 'bg-[#FF6B2B]/10 text-[#FF6B2B]' : 'bg-slate-100 text-slate-500'
                          }`}>
                            📋 {b.mentorNote}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit" disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-[#0B0F2E] text-white font-black hover:bg-[#12183f] transition-all disabled:opacity-70 shadow-lg shadow-[#0B0F2E]/20"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

      </div>

      {/* Bookings Section */}
      <div className="max-w-2xl mx-auto mt-8">
        {loadingBookings ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center text-slate-500">
            <div className="w-6 h-6 border-2 border-[#FF6B2B] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading purchased packages...
          </div>
        ) : (
          bookings.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl">🛍️</span>
                <h3 className="text-lg font-black text-[#0B0F2E]">My Bookings & Purchased Packages</h3>
              </div>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800">{booking.planTitle}</span>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full uppercase border border-emerald-100">
                            Paid
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Ordered on {new Date(booking.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-xs font-bold text-[#FF6B2B] mt-2">
                          Amount paid: ₹{booking.amount / 100}
                        </div>
                      </div>
                      
                      {booking.mentorId ? (
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {booking.mentorId.profilePhotoFilename ? (
                              <img 
                                src={`${API_BASE}/api/upload/profile-photo/${booking.mentorId.profilePhotoFilename}`} 
                                alt={booking.mentorId.name} 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              booking.mentorId.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{booking.mentorId.name}</div>
                            <div className="text-[10px] text-blue-600 font-semibold">{booking.mentorId.college}</div>
                            <div className="text-[9px] text-slate-400">Rank: AIR {booking.mentorId.rank || 'N/A'}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">No specific mentor assigned yet. Support will assign one!</div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-50 pt-3">
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        ℹ️ After payment, connect to WhatsApp from here
                      </span>
                      <a 
                        href={getDetailedWhatsAppLink(booking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba56] transition-all flex items-center gap-1.5 shadow-sm shadow-[#25D366]/10"
                      >
                        <span>💬 Connect on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            user.role !== 'mentor' && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center text-slate-500">
                <span className="text-3xl block mb-2">🎓</span>
                <p className="text-sm font-semibold text-slate-700">No mentorship sessions purchased yet.</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Get rank-based guidance from NIT/IIT seniors and secure your dream seat today!</p>
                <button 
                  onClick={() => navigate('/mentors')}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#FF6B2B] text-white text-xs font-bold hover:bg-orange-600 transition"
                >
                  Browse Mentors & Bundles
                </button>
              </div>
            )
          )
        )}
      </div>

    </div>
  );
}