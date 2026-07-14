import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import RoadmapHero from '../components/roadmap/RoadmapHero';
import PillarTabs from '../components/roadmap/PillarTabs';
import PillarModal from '../components/roadmap/PillarModal';
import ItemViewerModal from '../components/roadmap/ItemViewerModal';
import CareerPathsSection from '../components/roadmap/CareerPathsSection';
import ReferralCard from '../components/roadmap/ReferralCard';
import FaqVideoSection from '../components/roadmap/FaqVideoSection';
import {
  getRoadmapPillars,
  completeRoadmapItem,
  getStreak,
  getMyBatch,
  getCareerPaths,
  getReferralStatus,
  getFaqVideos,
  resolveAssetUrl,
} from '../utils/api';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

export default function RoadmapPage({ user }) {
  const isLoggedIn = !!user;
  const referralRef = useRef(null);

  const [pillars, setPillars] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [batch, setBatch] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [openPillarKey, setOpenPillarKey] = useState(null); // which pillar's popup is open
  const [loading, setLoading] = useState(true);
  const [openingItemId, setOpeningItemId] = useState(null);
  const [error, setError] = useState('');
  const [careerPaths, setCareerPaths] = useState({ featured: [], more: [], totalCount: 0, remainingCount: 0 });
  const [referral, setReferral] = useState(null);
  const [faqVideos, setFaqVideos] = useState([]);
  const [viewingItem, setViewingItem] = useState(null); // item currently open in viewer modal

  const loadPillars = useCallback(async () => {
    try {
      const res = await getRoadmapPillars();
      setPillars(res.pillars || []);
      setOverallProgress(res.overallProgress || 0);
    } catch (err) {
      setError(err.message || 'Could not load the roadmap right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPillars();
  }, [loadPillars]);

  useEffect(() => {
    getCareerPaths()
      .then((res) =>
        setCareerPaths({
          featured: res.featured || [],
          more: res.more || [],
          totalCount: res.totalCount || 0,
          remainingCount: res.remainingCount || 0,
        })
      )
      .catch(() => {});
    getFaqVideos().then((res) => setFaqVideos(res.faqVideos || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    getStreak().then(setStreak).catch(() => {});
    getMyBatch()
      .then((res) => {
        setBatch(res.batch);
        setMemberCount(res.memberCount || 0);
      })
      .catch(() => {});
    getReferralStatus().then(setReferral).catch(() => {});
  }, [isLoggedIn]);

  const openPillar = useMemo(
    () => pillars.find((p) => p.key === openPillarKey) || null,
    [pillars, openPillarKey]
  );

  // Opening a video/PDF/article IS the completion action — there is no
  // separate "mark complete" button. Task/quiz items (no file to open yet)
  // are completed the same way, by tapping the row.
  const handleOpenItem = async (item) => {
    if (!isLoggedIn || openingItemId) return;

    // Open the item in the viewer modal (type-specific: video player, PDF iframe, etc.)
    setViewingItem(item);

    const alreadyDone = openPillar?.progress?.completedItemIds?.includes(item.id);
    if (alreadyDone) return;

    setOpeningItemId(item.id);
    try {
      const res = await completeRoadmapItem(item.id);
      setStreak({ currentStreak: res.currentStreak, longestStreak: res.longestStreak });
      setOverallProgress(res.overallProgress);
      setPillars((prev) =>
        prev.map((p) => {
          if (!p.items.some((i) => i.id === item.id)) return p;
          const completedItemIds = Array.from(new Set([...(p.progress?.completedItemIds || []), item.id]));
          return { ...p, progress: { percent: res.pillarProgress, completedItemIds } };
        })
      );
    } catch (err) {
      setError(err.message || 'Could not save your progress. Please try again.');
    } finally {
      setOpeningItemId(null);
    }
  };

  // Referral-gated item tapped: close the popup and scroll to the referral
  // card so the student can see exactly how many more friends they need.
  const handleLockedClick = () => {
    setOpenPillarKey(null);
    setTimeout(() => referralRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  };

  return (
    <main>
      <RoadmapHero
        user={user}
        streak={streak}
        overallProgress={overallProgress}
        batch={batch}
        memberCount={memberCount}
      />

      <motion.section
        id="pillars"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="bg-[#0B0F2E] pb-16 pt-4 sm:pb-20"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#FF9E6B]">The Roadmap</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Your complete roadmap. All in one place.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/60">
              7 structured pillars from arrival to placement — tap a tab to open its videos and
              PDFs. Opening a resource marks it complete automatically and builds your streak.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#FF6B2B]" />
            </div>
          ) : error && !pillars.length ? (
            <p className="rounded-2xl border border-red-400/20 bg-red-500/5 px-6 py-8 text-center text-sm text-red-300">
              {error}
            </p>
          ) : (
            <>
              <PillarTabs pillars={pillars} activeKey={openPillarKey} onChange={setOpenPillarKey} />
              {error && <p className="mt-4 text-center text-sm text-red-300">{error}</p>}
              {!isLoggedIn && (
                <p className="mt-8 text-center text-sm text-white/50">
                  <a href="/login" className="font-semibold text-[#FF6B2B] hover:underline">
                    Log in
                  </a>{' '}
                  to open resources, track your streak, and join your cohort.
                </p>
              )}
            </>
          )}
        </div>
      </motion.section>

      {isLoggedIn && referral && (
        <section ref={referralRef} className="bg-[#0B0F2E] pb-16 sm:pb-20">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <ReferralCard referral={referral} />
          </div>
        </section>
      )}

      <CareerPathsSection
        featured={careerPaths.featured}
        more={careerPaths.more}
        totalCount={careerPaths.totalCount}
        remainingCount={careerPaths.remainingCount}
        isLoggedIn={isLoggedIn}
      />

      <FaqVideoSection faqVideos={faqVideos} />

      <PillarModal
        pillar={openPillar}
        isLoggedIn={isLoggedIn}
        openingItemId={openingItemId}
        onOpenItem={handleOpenItem}
        onLockedClick={handleLockedClick}
        onClose={() => setOpenPillarKey(null)}
      />

      {/* Per-item viewer modal: video player / PDF iframe / article link / task / quiz */}
      <ItemViewerModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
      />
    </main>
  );
}
