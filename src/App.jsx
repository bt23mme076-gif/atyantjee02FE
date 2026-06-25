import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadCaptureModal from './components/LeadCaptureModal';
import AtyantLoginPage from './pages/AtyantLoginPage';
import LaunchpadPage from './pages/LaunchpadPage';
import CollegePage from './pages/CollegePage';
import FinalYearPage from './pages/FinalYearPage';
import WorkingProPage from './pages/WorkingProPage';
import MentorsPage from './pages/MentorsPage';
import RankRadarPage from './pages/RankRadarPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ProgramsPage from './pages/ProgramsPage';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import { getUserMe } from './utils/api';

function AppContent() {
  const [showLeadModal, setShowLeadModal] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Try to fetch logged in user on mount
    const token = localStorage.getItem('user_token');
    if (token) {
      getUserMe()
        .then((res) => {setUser(res.user);})
        .catch(() => localStorage.removeItem('user_token'));
    }
  }, []);

  React.useEffect(() => {
    function openHandler() {
      setShowLeadModal(true);
    }
    window.addEventListener('openLeadModal', openHandler);
    return () => window.removeEventListener('openLeadModal', openHandler);
  }, []);

  // Monitor GetGabs WhatsApp widget height to safely style closed vs open state
  React.useEffect(() => {
    const interval = setInterval(() => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src.includes('getgabs') || iframe.id.includes('gabs') || iframe.src.includes('getredtowp') || iframe.src.includes('app.getgabs.com')) {
          const height = iframe.offsetHeight || iframe.clientHeight || 0;
          if (height > 120) {
            iframe.classList.remove('gabs-closed');
            iframe.classList.add('gabs-open');
          } else if (height > 0) {
            iframe.classList.add('gabs-closed');
            iframe.classList.remove('gabs-open');
          }
        }
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Set canonical URL for SEO (served from root, will be under /launchpad/ when proxied)
  React.useEffect(() => {
    const baseUrl = 'https://www.atyant.in';
    const isProduction = window.location.host !== 'localhost:5173' && window.location.host !== 'localhost:5174';
    
    // In production (proxied), URLs are under /launchpad/; in dev/Vercel preview, they're at root
    const path = isProduction ? `/launchpad${window.location.pathname}` : window.location.pathname;
    const canonicalUrl = `${baseUrl}${path === '/launchpad/' ? '/launchpad/' : path}`;
    
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;
  }, []);

  const activeTab = location.pathname === '/mentors' ? 'mentors' : location.pathname === '/predictor' ? 'predictor' : location.pathname === '/college' ? 'college' : location.pathname === '/finalyear' ? 'finalyear' : location.pathname === '/workingpro' ? 'workingpro' : location.pathname === '/programs' ? 'programs' : 'after12th';

  const handleTabChange = (tab) => {
    if (tab === 'after12th') navigate('/');
    else navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased" style={{ overflowX: 'clip' }}>
      <Navbar 
        onLeadClick={() => setShowLeadModal(true)} 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <LaunchpadPage activeTab={activeTab} onTabChange={handleTabChange} user={user} />
            </motion.div>
          } />
          <Route path="/college" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <CollegePage activeTab={activeTab} onTabChange={handleTabChange} />
            </motion.div>
          } />
          <Route path="/finalyear" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <FinalYearPage activeTab={activeTab} onTabChange={handleTabChange} />
            </motion.div>
          } />
          <Route path="/workingpro" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <WorkingProPage activeTab={activeTab} onTabChange={handleTabChange} />
            </motion.div>
          } />
          <Route path="/predictor" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <RankRadarPage />
            </motion.div>
          } />
          <Route path="/mentors" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <MentorsPage />
            </motion.div>
          } />
          <Route path="/atyantlogin" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <AtyantLoginPage />
            </motion.div>
          } />
          <Route path="/login" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <AuthPage setUser={setUser} />
            </motion.div>
          } />
          <Route path="/profile" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <ProfilePage user={user} setUser={setUser} />
            </motion.div>
          } />
          <Route path="/programs" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              <ProgramsPage user={user} />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>

      <Footer />
      <LeadCaptureModal open={showLeadModal} onClose={() => setShowLeadModal(false)} />
      <WhatsAppFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
