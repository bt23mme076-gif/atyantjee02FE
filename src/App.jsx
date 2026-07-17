import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadCaptureModal from './components/LeadCaptureModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import { getUserMe, isUserLoggedIn } from './utils/api';

// Route-level code splitting: each page is only fetched when its route is
// actually visited, instead of all ~11 pages being bundled into one
// 792 KB+ initial chunk (see the `npm run build` warning before this
// change). Navbar/Footer/LeadCaptureModal/WhatsAppFloatingButton stay
// eager imports since they render on every route regardless.
const AtyantLoginPage = lazy(() => import('./pages/AtyantLoginPage'));
const LaunchpadPage = lazy(() => import('./pages/LaunchpadPage'));
const CollegePage = lazy(() => import('./pages/CollegePage'));
const FinalYearPage = lazy(() => import('./pages/FinalYearPage'));
const WorkingProPage = lazy(() => import('./pages/WorkingProPage'));
const MentorsPage = lazy(() => import('./pages/MentorsPage'));
const RankRadarPage = lazy(() => import('./pages/RankRadarPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const CareerPathDetailPage = lazy(() => import('./pages/CareerPathDetailPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const PaymentStatusPage = lazy(() => import('./pages/PaymentStatusPage'));

// Lightweight fallback shown while a route chunk downloads. Deliberately
// minimal (no layout shift risk, no dependency on page-specific styles).
function RouteLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#FF6B2B] rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    </div>
  );
}

function AppContent() {
  const [showLeadModal, setShowLeadModal] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Try to fetch logged in user on mount
    if (isUserLoggedIn()) {
      getUserMe()
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_logged_in');
        });
    }
  }, []);

  React.useEffect(() => {
    // Single-device login: backend flags an old token as invalid the moment
    // the same account logs in elsewhere. api.js dispatches this event so we
    // can drop the local session and nudge the user to log back in.
    function sessionInvalidatedHandler(e) {
      setUser(null);
      const message =
        e.detail?.message ||
        "You've been logged out because your account was signed in on another device.";
      navigate('/login', { state: { message } });
    }
    window.addEventListener('sessionInvalidated', sessionInvalidatedHandler);
    return () => window.removeEventListener('sessionInvalidated', sessionInvalidatedHandler);
  }, [navigate]);

  React.useEffect(() => {
    function openHandler() {
      setShowLeadModal(true);
    }
    window.addEventListener('openLeadModal', openHandler);
    return () => window.removeEventListener('openLeadModal', openHandler);
  }, []);

  // Monitor GetGabs WhatsApp widget height to safely style closed vs open state.
  //
  // Previously polled every 300ms via setInterval, scanning all <iframe>
  // elements on every tick regardless of whether anything changed — wasted
  // CPU on every page, forever, even when the widget was untouched.
  //
  // ResizeObserver fires only when an observed element's box actually
  // changes size, which is exactly the event we care about. It's attached
  // directly to matching iframes as they appear (a MutationObserver on
  // document.body watches for the GetGabs iframe being added/removed, since
  // it's injected by a third-party script after mount).
  //
  // Fallback: if a given iframe can't be resize-observed for some reason
  // (e.g. certain cross-origin embed configurations restrict box
  // measurement), we fall back to a MutationObserver on the iframe's parent
  // watching for attribute/style changes, which still catches most height
  // changes the GetGabs widget makes via inline style/class updates.
  React.useEffect(() => {
    const classifyHeight = (iframe) => {
      const height = iframe.offsetHeight || iframe.clientHeight || 0;
      if (height > 120) {
        iframe.classList.remove('gabs-closed');
        iframe.classList.add('gabs-open');
      } else if (height > 0) {
        iframe.classList.add('gabs-closed');
        iframe.classList.remove('gabs-open');
      }
    };

    const isGabsIframe = (iframe) =>
      iframe.src?.includes('getgabs') ||
      iframe.id?.includes('gabs') ||
      iframe.src?.includes('getredtowp') ||
      iframe.src?.includes('app.getgabs.com');

    const observedIframes = new Set();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver((entries) => {
            entries.forEach((entry) => classifyHeight(entry.target));
          })
        : null;

    // MutationObserver fallback, per-iframe, only used when ResizeObserver
    // isn't available or can't be attached (e.g. cross-origin restrictions
    // throwing on observe()). Watches the iframe's parent for attribute
    // changes, since the widget resizes itself via style/class mutations.
    const fallbackObservers = new Map();
    const attachFallback = (iframe) => {
      const parent = iframe.parentElement;
      if (!parent || fallbackObservers.has(iframe)) return;
      const mo = new MutationObserver(() => classifyHeight(iframe));
      mo.observe(parent, { attributes: true, attributeFilter: ['style', 'class'], subtree: true });
      fallbackObservers.set(iframe, mo);
    };

    const attachToIframe = (iframe) => {
      if (observedIframes.has(iframe) || !isGabsIframe(iframe)) return;
      observedIframes.add(iframe);
      classifyHeight(iframe); // initial classification, don't wait for first resize
      try {
        if (resizeObserver) {
          resizeObserver.observe(iframe);
        } else {
          attachFallback(iframe);
        }
      } catch (err) {
        // Cross-origin iframe rejected observation — fall back.
        attachFallback(iframe);
      }
    };

    // Attach to any GetGabs iframe already present on mount...
    document.querySelectorAll('iframe').forEach(attachToIframe);

    // ...and watch for the widget's iframe being injected later (it's added
    // by a third-party script after this component mounts).
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.tagName === 'IFRAME') {
            attachToIframe(node);
          } else {
            node.querySelectorAll?.('iframe').forEach(attachToIframe);
          }
        });
      });
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      resizeObserver?.disconnect();
      fallbackObservers.forEach((mo) => mo.disconnect());
      bodyObserver.disconnect();
    };
  }, []);

  // Set canonical URL for SEO (served from root, will be under /launchpad/ when proxied)
  React.useEffect(() => {
    const baseUrl = 'https://www.atyant.in';
    const isProduction =
      window.location.host !== 'localhost:5173' && window.location.host !== 'localhost:5174';

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

  const activeTab =
    location.pathname === '/mentors'
      ? 'mentors'
      : location.pathname === '/predictor'
        ? 'predictor'
        : location.pathname === '/college'
          ? 'college'
          : location.pathname === '/finalyear'
            ? 'finalyear'
            : location.pathname === '/workingpro'
              ? 'workingpro'
              : location.pathname === '/programs'
                ? 'programs'
                : location.pathname === '/roadmap'
                  ? 'roadmap'
                  : 'after12th';

  const handleTabChange = (tab) => {
    if (tab === 'after12th') navigate('/');
    else navigate(`/${tab}`);
  };

  const isDarkPage = true;
  const bgClass = 'bg-[#0B0F2E]';

  return (
    <div className={`min-h-screen ${bgClass} font-sans antialiased`} style={{ overflowX: 'clip' }}>
      <Navbar
        onLeadClick={() => setShowLeadModal(true)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
      />

      <div className="pt-20 lg:pt-24">
        <AnimatePresence mode="wait">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LaunchpadPage
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                      user={user}
                    />
                  </motion.div>
                }
              />
              <Route
                path="/college"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CollegePage activeTab={activeTab} onTabChange={handleTabChange} />
                  </motion.div>
                }
              />
              <Route
                path="/finalyear"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FinalYearPage activeTab={activeTab} onTabChange={handleTabChange} />
                  </motion.div>
                }
              />
              <Route
                path="/workingpro"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <WorkingProPage activeTab={activeTab} onTabChange={handleTabChange} />
                  </motion.div>
                }
              />
              <Route
                path="/predictor"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RankRadarPage />
                  </motion.div>
                }
              />
              <Route
                path="/mentors"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MentorsPage />
                  </motion.div>
                }
              />
              <Route
                path="/atyantlogin"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AtyantLoginPage />
                  </motion.div>
                }
              />
              <Route
                path="/login"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AuthPage setUser={setUser} />
                  </motion.div>
                }
              />
              <Route
                path="/profile"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProfilePage user={user} setUser={setUser} />
                  </motion.div>
                }
              />
              <Route
                path="/programs"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProgramsPage user={user} />
                  </motion.div>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RoadmapPage user={user} />
                  </motion.div>
                }
              />
              <Route
                path="/quiz"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuizPage />
                  </motion.div>
                }
              />
              <Route
                path="/career-path/:slug"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CareerPathDetailPage user={user} />
                  </motion.div>
                }
              />
              {/* Alias: all in-app links use /careers/:slug */}
              <Route
                path="/careers/:slug"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CareerPathDetailPage user={user} />
                  </motion.div>
                }
              />
              <Route
                path="/courses/:slug"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CourseDetailPage />
                  </motion.div>
                }
              />
              <Route
                path="/payment-status"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PaymentStatusPage />
                  </motion.div>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>

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
