import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveCourses } from '../utils/api';
import { BookOpen, Sparkles, Trophy, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentModal } from './PricingCard';
import { getUserMe } from '../utils/api';

export default function CoursePricingCards() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getActiveCourses()
      .then(res => setCourses(res.courses || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    const token = localStorage.getItem('user_token');
    if (token) {
      getUserMe().then(res => setUser(res.user)).catch(() => {});
    }
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#FF6B2B] rounded-full animate-spin" />
      </div>
    );
  }

  if (courses.length === 0) {
    return null; // Don't show anything if no courses
  }

  const handleEnrollClick = (course) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedCourse(course);
    setShowPayment(true);
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#FF6B2B]" />
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#FFB38E] text-center">
          Choose your best course
        </h2>
        <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#FF6B2B]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, idx) => (
          <div 
            key={course.id}
            className="relative overflow-hidden rounded-lg border border-white/10 bg-white/3 p-8 shadow-sm flex flex-col justify-between hover:border-[#FF6B2B]/40 transition duration-300"
          >
            {course.price === 4999 && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FF6B2B] to-[#ff8a57] text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-lg tracking-widest shadow-lg">
                Most Popular
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="rounded-full bg-green-500/15 border border-green-500/25 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-400">
                  Active Now
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white border border-white/10">
                  <BookOpen className="h-6 w-6 text-[#FF6B2B]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                {course.title}
              </h3>
              <div className="mb-2">
                <span className="text-3xl font-black text-white">₹{course.price}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 mb-8 min-h-[40px]">
                {course.description}
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { label: 'Comprehensive Modules', icon: <BookOpen className="h-4 w-4" /> },
                  { label: 'Video & PDF Resources', icon: <Sparkles className="h-4 w-4" /> },
                  { label: 'Lifetime Access', icon: <TrendingUp className="h-4 w-4" /> },
                  { label: 'Community Support', icon: <Users className="h-4 w-4" /> },
                ].map((bullet, index) => (
                  <div key={index} className="flex items-center gap-3.5 text-sm text-slate-300">
                    <div className="text-[#FF6B2B]">{bullet.icon}</div>
                    <span>{bullet.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleEnrollClick(course)}
              className="w-full py-4 rounded-lg bg-[#FF6B2B] text-white font-bold text-sm tracking-wide shadow-lg hover:bg-[#e05a1f] hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Enroll Now →
            </button>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <PaymentModal 
          open={showPayment} 
          onClose={() => setShowPayment(false)} 
          planTitle={selectedCourse.slug} 
          planPrice={selectedCourse.price} 
          onSuccessRedirectUrl={`/courses/${selectedCourse.slug}?payment=success`} 
        />
      )}
    </div>
  );
}
