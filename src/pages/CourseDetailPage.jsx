import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseDetails, getUserMe, isUserLoggedIn } from '../utils/api';
import {
  Lock,
  PlayCircle,
  FileText,
  ChevronDown,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { PaymentModal } from '../components/PricingCard';
import CourseChatbot from '../components/CourseChatbot';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courseData, setCourseData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModules, setExpandedModules] = useState({});
  const [showPayment, setShowPayment] = useState(false);

  const paymentSuccess = searchParams.get('payment') === 'success';

  useEffect(() => {
    if (isUserLoggedIn()) {
      getUserMe()
        .then((r) => setUser(r.user))
        .catch(() => {});
    }

    getCourseDetails(slug)
      .then((res) => {
        setCourseData(res);
        // auto expand first module
        if (res.modules && res.modules.length > 0) {
          setExpandedModules({ [res.modules[0].id]: true });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, paymentSuccess]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Loading course...
      </div>
    );
  if (error || !courseData)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500">
        {error || 'Course not found'}
      </div>
    );

  const { course, modules } = courseData;
  const hasPurchased = user?.purchasedCourses?.includes(course.slug);

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleItemClick = (mod, item) => {
    if (!hasPurchased && !mod.isFreePreview) {
      if (!user) {
        navigate('/auth'); // force login
      } else {
        setShowPayment(true);
      }
      return;
    }
    window.open(item.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-[#0B0F2E] text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">{course.title}</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">{course.description}</p>

          {!hasPurchased && (
            <button
              onClick={() => (user ? setShowPayment(true) : navigate('/auth'))}
              className="bg-[#FF6B2B] hover:bg-[#e05a1f] text-white font-bold py-4 px-10 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              Enroll Now for ₹{course.price}
            </button>
          )}
          {hasPurchased && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full font-bold">
              <CheckCircle2 className="w-5 h-5" /> Enrolled
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Course Curriculum</h2>

          <div className="space-y-4">
            {modules.map((mod, idx) => {
              const isUnlocked = hasPurchased || mod.isFreePreview;
              const isExpanded = expandedModules[mod.id];

              return (
                <div
                  key={mod.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className={`w-full flex items-center justify-between p-4 sm:p-5 text-left transition ${
                      isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                      <span className="font-bold text-slate-800">
                        Module {idx + 1}: {mod.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isUnlocked && <Lock className="w-4 h-4 text-slate-400" />}
                      {isUnlocked && !hasPurchased && mod.isFreePreview && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-white">
                      {mod.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(mod, item)}
                          className={`group flex items-center justify-between p-4 pl-12 border-b border-slate-50 last:border-b-0 cursor-pointer ${
                            isUnlocked ? 'hover:bg-blue-50/50' : 'hover:bg-slate-50 opacity-70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.type === 'video' ? (
                              <PlayCircle
                                className={`w-5 h-5 ${isUnlocked ? 'text-[#FF6B2B]' : 'text-slate-400'}`}
                              />
                            ) : (
                              <FileText
                                className={`w-5 h-5 ${isUnlocked ? 'text-blue-500' : 'text-slate-400'}`}
                              />
                            )}
                            <span
                              className={`text-sm font-medium ${isUnlocked ? 'text-slate-700 group-hover:text-blue-700' : 'text-slate-500'}`}
                            >
                              {item.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {item.durationLabel && (
                              <span className="text-xs font-medium text-slate-400">
                                {item.durationLabel}
                              </span>
                            )}
                            {isUnlocked ? (
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                        </div>
                      ))}
                      {mod.items.length === 0 && (
                        <div className="p-4 pl-12 text-sm text-slate-400">
                          No items available yet.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <CourseChatbot courseContext={course.title} />
      </div>

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        planTitle={course.slug}
        planPrice={course.price}
        onSuccessRedirectUrl={`/courses/${course.slug}?payment=success`}
      />
    </div>
  );
}
