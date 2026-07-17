import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, BookOpen, Star, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';
import { PaymentModal } from '../components/PricingCard';
import API_BASE, { getMentors, isUserLoggedIn } from '../utils/api';
import { ALL_INDIAN_STATES, COLLEGES_BY_TYPE, DEPARTMENTS } from '../data/siteContent';

// ─── Bundle definitions ────────────────────────────────────────────────────
const BUNDLES = [
  {
    id: 'complete-round',
    name: 'Complete Round Support',
    sub: 'Full JoSAA + CSAB support',
    price: '₹999',
    originalPrice: '₹1,999',
    discount: '50% OFF',
    popular: true,
    color: '#E28743',
    bg: '#FFFBF5',
    wa: 'Hi+Atyant%2C+I+am+interested+in+Complete+Round+Support.%0A%0AMy+exam%3A%0AMy+rank%2Fpercentile%3A%0AMy+main+confusion%3A%0A',
  },
  {
    id: 'ultimate-peace',
    name: 'Ultimate Peace of Mind',
    sub: '1-on-1 premium guidance from start to finish',
    price: '₹1,999',
    originalPrice: '₹2,999',
    discount: '33% OFF',
    color: '#534AB7',
    bg: '#EEEDFE',
    wa: 'Hi+Atyant%2C+I+am+interested+in+Ultimate+Peace+of+Mind.%0A%0AMy+exam%3A%0AMy+rank%2Fpercentile%3A%0AMy+main+confusion%3A%0A',
  },
];

const BUNDLE_MAP = {
  ...Object.fromEntries(BUNDLES.map((b) => [b.id, b])),
  'dream-seat': BUNDLES[0], // alias Complete Round Support
};

// ─── Normalise a bundle value (name or id) → canonical id ────────────────
// FIX (Backend gap): bundles stored as names OR ids — normalise to id always.
function normaliseBundleId(b) {
  if (!b) return null;
  const byId = BUNDLES.find((x) => x.id === b);
  if (byId) return byId.id;
  const byName = BUNDLES.find((x) => x.name === b);
  if (byName) return byName.id;
  return null;
}

const AVATAR_COLORS = [
  { bg: '#E6F1FB', text: '#0C447C' },
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#FAEEDA', text: '#633806' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#FBEAF0', text: '#72243E' },
  { bg: '#EAF3DE', text: '#27500A' },
];

// ─── Rank config ──────────────────────────────────────────────────────────
const RANK_MIN = 0;
const RANK_MAX = 1000000;

const RANK_PRESETS = [
  { label: 'Top 1K', min: 0, max: 1000 },
  { label: '1K–5K', min: 1000, max: 5000 },
  { label: '5K–10K', min: 5000, max: 10000 },
  { label: '10K–25K', min: 10000, max: 25000 },
  { label: '25K–50K', min: 25000, max: 50000 },
  { label: '50K–1L', min: 50000, max: 100000 },
  { label: '1L–2L', min: 100000, max: 200000 },
  { label: '2L–5L', min: 200000, max: 500000 },
  { label: '5L–10L', min: 500000, max: 1000000 },
];

function formatRank(n) {
  if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function getInitials(name) {
  return name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
    : 'M';
}

// ─── FIX (Logic): data-driven college type matcher ────────────────────────
// Instead of fragile hardcoded acronym lists, rely on the mentor's own
// `collegeType` field (added to backend schema). Falls back to a lightweight
// heuristic only when the field is absent (legacy records).
function matchesCollegeType(mentor, filterCollegeType) {
  if (!filterCollegeType) return true;

  // ✅ Primary path: use the stored field (requires backend field)
  if (mentor.collegeType) {
    return mentor.collegeType.toUpperCase() === filterCollegeType.toUpperCase();
  }

  // ⚠️ Fallback heuristic for legacy records without collegeType field
  const col = (mentor.college || '').toLowerCase();
  switch (filterCollegeType) {
    case 'IIT':
      // Must contain 'iit' but NOT 'iiit'
      return /\biit\b/.test(col) && !/\biiit\b/.test(col);
    case 'NIT':
      return /\bnit\b/.test(col) || col.includes('national institute of technology');
    case 'IIIT':
      return /\biiit\b/.test(col) || col.includes('indian institute of information technology');
    case 'STATE GOV.':
      // Known state govt colleges — extend this list as needed
      return (
        /\b(dtu|nsut|vjti|coep|jadavpur|iet|hbtu|sgsits|pec|thapar|mnit|mnnit|mit manipal)\b/.test(
          col
        ) || col.includes('state')
      );
    case 'PRIVATE':
      return /\b(bits|vit|manipal|srm|rvce|bmsce|msrit|lnmiit|nirma|kiit|kiet|amrita)\b/.test(col);
    case 'OTHERS':
      // Anything that doesn't match the above known patterns
      return (
        !/\biit\b/.test(col) &&
        !/\bnit\b/.test(col) &&
        !/\biiit\b/.test(col) &&
        !/\b(dtu|nsut|vjti|coep|jadavpur|iet|hbtu|sgsits|state)\b/.test(col) &&
        !/\b(bits|vit|manipal|srm|rvce|bmsce|msrit|lnmiit|nirma|kiit|kiet|amrita)\b/.test(col)
      );
    default:
      return true;
  }
}

// ─── Bundle row ───────────────────────────────────────────────────────────
function BundleRow({ bundleId, isSelected, onSelect }) {
  const b = BUNDLE_MAP[bundleId];
  if (!b) return null;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 border transition-all text-left"
      style={{
        borderColor: isSelected ? b.color : 'rgba(255,255,255,0.06)',
        backgroundColor: isSelected ? b.color + '15' : 'transparent',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white">{b.name}</span>
            {b.popular && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: b.color }}
              >
                Popular
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">{b.sub}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        {b.originalPrice && (
          <span className="text-[9px] text-slate-400 line-through leading-none">
            {b.originalPrice}
          </span>
        )}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-white">{b.price}</span>
          {b.discount && (
            <span
              className="text-[8px] font-bold px-1 py-0.5 rounded"
              style={{ backgroundColor: b.color + '22', color: b.color }}
            >
              {b.discount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Mentor card ──────────────────────────────────────────────────────────
function MentorCard({ mentor, index, defaultBundle }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const navigate = useNavigate();

  // FIX (Backend gap): normalise all bundle values to canonical IDs
  const mentorBundles = useMemo(
    () =>
      Array.isArray(mentor.bundles) ? mentor.bundles.map(normaliseBundleId).filter(Boolean) : [],
    [mentor.bundles]
  );

  const initialBundle =
    defaultBundle && mentorBundles.includes(defaultBundle)
      ? defaultBundle
      : mentorBundles.includes('complete-round')
        ? 'complete-round'
        : mentorBundles[0];

  const [selectedBundle, setSelectedBundle] = useState(initialBundle);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (defaultBundle && mentorBundles.includes(defaultBundle)) {
      setSelectedBundle(defaultBundle);
    }
  }, [defaultBundle, mentorBundles]);

  // FIX: stable mentor id as dep instead of entire mentor object
  const mentorId = mentor.id || mentor._id;
  useEffect(() => {
    const pending = localStorage.getItem('atyant_pending_booking');
    if (pending) {
      try {
        const { mentorId: pendingId, bundleId } = JSON.parse(pending);
        if (pendingId === mentorId) {
          if (bundleId && mentorBundles.includes(bundleId)) setSelectedBundle(bundleId);
          setShowPayment(true);
          localStorage.removeItem('atyant_pending_booking');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [mentorId, mentorBundles]);

  const bundle = BUNDLE_MAP[selectedBundle];
  const waUrl = `https://wa.me/919579040183?text=${bundle?.wa ?? ''}`;

  const handleBookClick = () => {
    if (!isUserLoggedIn()) {
      localStorage.setItem(
        'atyant_pending_booking',
        JSON.stringify({
          mentorId,
          bundleId: selectedBundle,
        })
      );
      navigate('/login', {
        state: { message: 'Please sign up or log in as a Student to buy a mentorship plan.' },
      });
      return;
    }
    setShowPayment(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, delay: index * 0.04 }}
      className="bg-white/3 border border-white/5 rounded-lg p-5 flex flex-col hover:border-white/15 hover:shadow-lg hover:bg-white/5 transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-4">
        {mentor.profilePhotoFilename ? (
          <img
            src={`${API_BASE}/api/upload/profile-photo/${mentor.profilePhotoFilename}`}
            alt={mentor.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white/5 flex-shrink-0 shadow-sm"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-base font-extrabold flex-shrink-0"
            style={{ backgroundColor: color.bg, color: color.text }}
          >
            {getInitials(mentor.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-white truncate">{mentor.name}</h4>
          <p className="text-xs font-semibold text-blue-400 truncate">{mentor.college}</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1 border border-emerald-500/20 flex-shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified
        </div>
      </div>

      <div className="space-y-1.5 pb-4 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          {mentor.state || 'N/A'} {mentor.year ? `· ${mentor.year}` : ''}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          {mentor.branch || 'B.Tech'}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <Star className="w-3.5 h-3.5 flex-shrink-0 fill-amber-400 text-amber-400" />
          {mentor.rating || 5.0} · {mentor.sessions || 0} sessions done
        </div>
      </div>

      {mentor.bio && (
        <div className="mb-4 pb-4 border-b border-white/5">
          <p className="text-[11px] text-slate-300 italic leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5 relative">
            <span className="absolute -top-2 left-2 text-xl text-slate-400">"</span>
            {mentor.bio}
          </p>
        </div>
      )}

      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Available bundles
        </p>
        <div className="space-y-1.5">
          {mentorBundles.map((bid) => (
            <BundleRow
              key={bid}
              bundleId={bid}
              isSelected={selectedBundle === bid}
              onSelect={() => setSelectedBundle(bid)}
            />
          ))}
          {mentorBundles.length === 0 && (
            <p className="text-xs text-slate-400 italic">No bundles offered yet.</p>
          )}
        </div>
      </div>

      <button
        onClick={handleBookClick}
        className="mt-4 w-full py-2.5 rounded-lg bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition-all duration-200"
      >
        Book {bundle?.name} →
      </button>

      {bundle && (
        <PaymentModal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          planTitle={bundle.name}
          planPrice={bundle.price.replace(/[^\d]/g, '')}
          mentorId={mentorId}
          onSuccessRedirectUrl={waUrl}
        />
      )}
    </motion.div>
  );
}

// ─── Custom Range Modal ───────────────────────────────────────────────────
function CustomRangeModal({ open, onClose, onApply }) {
  const [minVal, setMinVal] = useState('');
  const [maxVal, setMaxVal] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleApply = () => {
    const mn = parseInt(minVal);
    const mx = parseInt(maxVal);
    if (!minVal || !maxVal || isNaN(mn) || isNaN(mx)) {
      setError('Please enter both values.');
      return;
    }
    if (mn >= mx) {
      setError('Min rank must be less than max rank.');
      return;
    }
    if (mn < 1 || mx > 1000000) {
      setError('Values must be between 1 and 10,00,000.');
      return;
    }
    setError('');
    onApply(mn, mx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0B0F2E] border border-white/10 rounded-lg p-6 w-full max-w-sm shadow-xl"
      >
        <h3 className="text-base font-black text-white mb-1">Custom Rank Range</h3>
        <p className="text-xs text-slate-400 mb-4">Type your exact JEE rank range</p>
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Min Rank
            </label>
            <input
              type="number"
              placeholder="e.g. 40000"
              value={minVal}
              onChange={(e) => setMinVal(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 py-2 px-3 text-sm text-white outline-none focus:border-[#FF6B2B] focus:bg-white/10 transition"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Max Rank
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={maxVal}
              onChange={(e) => setMaxVal(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 py-2 px-3 text-sm text-white outline-none focus:border-[#FF6B2B] focus:bg-white/10 transition"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-lg bg-[#FF6B2B] text-white text-sm font-bold hover:bg-[#ff7b48] transition"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Dual thumb slider using react-range ─────────────────────────────────
function DualRangeSlider({ values, onChange }) {
  return (
    <Range
      step={1000}
      min={RANK_MIN}
      max={RANK_MAX}
      values={values}
      onChange={onChange}
      renderTrack={({ props, children }) => {
        const { key, ...restProps } = props;
        return (
          <div
            key={key}
            {...restProps}
            style={{
              ...restProps.style,
              height: '6px',
              width: '100%',
              borderRadius: '3px',
              background: getTrackBackground({
                values,
                colors: ['#e2e8f0', '#3b82f6', '#e2e8f0'],
                min: RANK_MIN,
                max: RANK_MAX,
              }),
            }}
          >
            {children}
          </div>
        );
      }}
      renderThumb={({ props, isDragged }) => {
        const { key, ...restProps } = props;
        return (
          <div
            key={key}
            {...restProps}
            style={{
              ...restProps.style,
              height: '20px',
              width: '20px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: isDragged ? '2px solid #3b82f6' : '2px solid #94a3b8',
              boxShadow: isDragged
                ? '0 0 0 4px rgba(59,130,246,0.2)'
                : '0 1px 4px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isDragged ? '#3b82f6' : '#94a3b8',
              }}
            />
          </div>
        );
      }}
    />
  );
}

// ─── Pagination config ────────────────────────────────────────────────────
const PAGE_SIZE = 12;

// ─── Main page ─────────────────────────────────────────────────────────────
export default function MentorsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bundleParam = useMemo(
    () => new URLSearchParams(location.search).get('bundle'),
    [location.search]
  );

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  // FIX (Backend gap — pagination): track current page
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMentors()
      .then((res) => setMentors(res.mentors || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [search, setSearch] = useState('');
  const [filterCollegeType, setFilterCollegeType] = useState('');
  const [filterCollegeName, setFilterCollegeName] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [rankValues, setRankValues] = useState([RANK_MIN, RANK_MAX]);
  const [activePreset, setActivePreset] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const rankMin = rankValues[0];
  const rankMax = rankValues[1];
  const isRankFiltered = rankMin > RANK_MIN || rankMax < RANK_MAX;

  const handleCollegeTypeChange = (e) => {
    setFilterCollegeType(e.target.value);
    setFilterCollegeName('');
    setPage(1);
  };

  const handlePresetClick = useCallback(
    (preset) => {
      if (activePreset === preset.label) {
        setActivePreset(null);
        setRankValues([RANK_MIN, RANK_MAX]);
      } else {
        setActivePreset(preset.label);
        setRankValues([preset.min, preset.max]);
      }
      setPage(1);
    },
    [activePreset]
  );

  const handleCustomApply = useCallback((mn, mx) => {
    setActivePreset(`${formatRank(mn)}–${formatRank(mx)}`);
    setRankValues([mn, mx]);
    setPage(1);
  }, []);

  const handleSliderChange = useCallback((vals) => {
    setRankValues(vals);
    const matched = RANK_PRESETS.find((p) => p.min === vals[0] && p.max === vals[1]);
    setActivePreset(matched ? matched.label : `${formatRank(vals[0])}–${formatRank(vals[1])}`);
    setPage(1);
  }, []);

  const activeCollegeList = useMemo(() => {
    if (!filterCollegeType) return [];
    return COLLEGES_BY_TYPE[filterCollegeType] || [];
  }, [filterCollegeType]);

  // ─── FIX: bundleParam guard — unknown values should not hide all mentors
  const validBundleParam = useMemo(() => {
    if (!bundleParam) return null;
    return BUNDLES.some((b) => b.id === bundleParam) ? bundleParam : null;
  }, [bundleParam]);

  const filtered = useMemo(() => {
    let list = mentors.filter((m) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        (m.college ?? '').toLowerCase().includes(searchLower) ||
        (m.name ?? '').toLowerCase().includes(searchLower);

      // FIX (Logic): data-driven college type matching via helper
      const matchType = matchesCollegeType(m, filterCollegeType);

      const matchCollegeName =
        !filterCollegeName ||
        (m.college || '').toLowerCase().includes(filterCollegeName.toLowerCase());
      const matchState =
        !filterState || (m.state || '').toLowerCase() === filterState.toLowerCase();
      const matchBranch =
        !filterBranch || (m.branch || '').toLowerCase().includes(filterBranch.toLowerCase());

      // FIX (Filtering bug): when rank filter is active, mentors with NO rank
      // are excluded rather than silently passing through.
      let matchRank = true;
      if (isRankFiltered) {
        // Only include mentors that have a valid rank within the selected range
        matchRank = typeof m.rank === 'number' && m.rank >= rankMin && m.rank <= rankMax;
      }

      // FIX (Filtering bug): use validated bundleParam; normalise stored bundles to ids
      let matchBundleParam = true;
      if (validBundleParam) {
        matchBundleParam =
          Array.isArray(m.bundles) &&
          m.bundles.some((b) => {
            const normalized = normaliseBundleId(b);
            const canonicalValid =
              validBundleParam === 'dream-seat' ? 'complete-round' : validBundleParam;
            const canonicalNorm = normalized === 'dream-seat' ? 'complete-round' : normalized;
            return canonicalNorm === canonicalValid;
          });
      }

      return (
        matchSearch &&
        matchType &&
        matchCollegeName &&
        matchState &&
        matchBranch &&
        matchRank &&
        matchBundleParam
      );
    });

    if (sortBy === 'rating') list = [...list].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    if (sortBy === 'sessions')
      list = [...list].sort((a, b) => (b.sessions || 0) - (a.sessions || 0));
    if (sortBy === 'priceLow') {
      const getMinPrice = (mentor) => {
        if (!Array.isArray(mentor.bundles) || mentor.bundles.length === 0) return Infinity;
        return Math.min(
          ...mentor.bundles
            .map((b) => BUNDLE_MAP[normaliseBundleId(b)])
            .filter(Boolean)
            .map((b) => parseInt(b.price.replace(/[^\d]/g, '')))
        );
      };
      list = [...list].sort((a, b) => getMinPrice(a) - getMinPrice(b));
    }

    return list;
  }, [
    mentors,
    search,
    filterCollegeType,
    filterCollegeName,
    filterState,
    filterBranch,
    rankMin,
    rankMax,
    isRankFiltered,
    sortBy,
    validBundleParam,
  ]);

  // ─── FIX (Backend gap — pagination): slice results for current page ──────
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [filtered]);

  const hasFilter =
    search ||
    filterCollegeType ||
    filterCollegeName ||
    filterState ||
    filterBranch ||
    isRankFiltered ||
    validBundleParam;

  function clearFilters() {
    setSearch('');
    setFilterCollegeType('');
    setFilterCollegeName('');
    setFilterState('');
    setFilterBranch('');
    setRankValues([RANK_MIN, RANK_MAX]);
    setActivePreset(null);
    setSortBy('default');
    setPage(1);
    if (bundleParam) navigate(location.pathname, { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#0B0F2E] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B0F2E] to-[#12183f] border-b border-white/5 px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Find Your{' '}
            <span className="bg-gradient-to-r from-[#FF6B2B] to-[#ff955f] bg-clip-text text-transparent drop-shadow-sm">
              Mentor
            </span>
          </motion.h1>
          <p className="mt-4 text-base font-medium text-slate-300 max-w-xl mx-auto">
            Talk to current students from the exact colleges you're targeting. Real seats, real
            ranks, real counselling.
          </p>

          {/* ── Rank Range Selector ── */}
          <div className="mt-8 mx-auto max-w-2xl bg-white/5 backdrop-blur rounded-lg border border-white/10 shadow-lg p-5">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-black text-white">Filter by JEE Rank</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRankFiltered ? (
                    <>
                      Showing mentors with rank&nbsp;
                      <span className="font-bold text-[#FFB38E]">{formatRank(rankMin)}</span>
                      &nbsp;–&nbsp;
                      <span className="font-bold text-[#FFB38E]">{formatRank(rankMax)}</span>
                      &nbsp;·{' '}
                      <span className="text-amber-400">Mentors without rank data are hidden</span>
                    </>
                  ) : (
                    'Drag to filter by rank range'
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowCustomModal(true)}
                className="text-xs font-bold text-white bg-[#FF6B2B] hover:bg-[#ff7b48] px-3.5 py-1.5 rounded-full transition flex items-center gap-1 flex-shrink-0"
              >
                + Custom
              </button>
            </div>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {RANK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-1 rounded-full text-xs font-bold border transition-all"
                  style={{
                    backgroundColor:
                      activePreset === preset.label ? '#FF6B2B' : 'rgba(255,255,255,0.04)',
                    color: activePreset === preset.label ? '#ffffff' : '#cbd5e1',
                    borderColor:
                      activePreset === preset.label ? '#FF6B2B' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Dual thumb slider */}
            <div className="px-2">
              <DualRangeSlider values={rankValues} onChange={handleSliderChange} />
              <div className="flex justify-between mt-2">
                <span className="text-[11px] font-semibold text-[#FFB38E] bg-[#FF6B2B]/10 px-2 py-0.5 rounded-full border border-[#FF6B2B]/20">
                  {formatRank(rankMin)}
                </span>
                <span className="text-[11px] font-semibold text-[#FFB38E] bg-[#FF6B2B]/10 px-2 py-0.5 rounded-full border border-[#FF6B2B]/20">
                  {formatRank(rankMax)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Range Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <CustomRangeModal
            open={showCustomModal}
            onClose={() => setShowCustomModal(false)}
            onApply={handleCustomApply}
          />
        )}
      </AnimatePresence>

      {/* ── Horizontal Filter Ribbon ── */}
      <div className="sticky top-[72px] z-20 bg-[#0B0F2E]/90 backdrop-blur-xl border-b border-white/5 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[130px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or college..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#FF6B2B] focus:bg-white/10 transition"
            />
          </div>

          {/* College Type */}
          <div className="flex flex-col gap-1 flex-1 min-w-[110px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              College Type
            </label>
            <select
              value={filterCollegeType}
              onChange={handleCollegeTypeChange}
              className="rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-sm text-white outline-none focus:border-[#FF6B2B] focus:bg-white/10 transition"
            >
              <option value="" className="bg-[#0B0F2E] text-white">
                All Types
              </option>
              <option value="IIT" className="bg-[#0B0F2E] text-white">
                IIT
              </option>
              <option value="NIT" className="bg-[#0B0F2E] text-white">
                NIT
              </option>
              <option value="IIIT" className="bg-[#0B0F2E] text-white">
                IIIT
              </option>
              <option value="STATE GOV." className="bg-[#0B0F2E] text-white">
                STATE GOV.
              </option>
              <option value="PRIVATE" className="bg-[#0B0F2E] text-white">
                PRIVATE
              </option>
              <option value="OTHERS" className="bg-[#0B0F2E] text-white">
                OTHERS
              </option>
            </select>
          </div>

          {/* Specific College (cascading) */}
          {filterCollegeType && (
            <div className="flex flex-col gap-1 flex-1 min-w-[110px]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                College
              </label>
              <select
                value={filterCollegeName}
                onChange={(e) => {
                  setFilterCollegeName(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-sm text-white outline-none focus:border-[#FF6B2B] focus:bg-white/10 transition"
              >
                <option value="" className="bg-[#0B0F2E] text-white">
                  All {filterCollegeType}
                </option>
                {activeCollegeList.map((name) => (
                  <option key={name} value={name} className="bg-[#0B0F2E] text-white">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* State */}
          <div className="flex flex-col gap-1 flex-1 min-w-[110px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              State
            </label>
            <select
              value={filterState}
              onChange={(e) => {
                setFilterState(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-sm text-white outline-none focus:border-[#FF6B2B] focus:bg-white/10 transition"
            >
              <option value="" className="bg-[#0B0F2E] text-white">
                All States
              </option>
              {ALL_INDIAN_STATES.map((st) => (
                <option key={st} value={st} className="bg-[#0B0F2E] text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1 flex-1 min-w-[110px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Department
            </label>
            <select
              value={filterBranch}
              onChange={(e) => {
                setFilterBranch(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-sm text-white outline-none focus:border-[#FF6B2B] focus:bg-white/10 transition"
            >
              <option value="" className="bg-[#0B0F2E] text-white">
                All Departments
              </option>
              {DEPARTMENTS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Clear all */}
          {hasFilter && (
            <button
              onClick={clearFilters}
              className="py-2 px-3 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition self-end"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Results grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-300">
            {loading ? (
              'Loading mentors...'
            ) : (
              <>
                Showing{' '}
                <span className="font-bold text-white">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{' '}
                of <span className="font-bold text-white">{filtered.length}</span> mentors
              </>
            )}
          </p>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-xs text-slate-300 outline-none focus:border-[#FF6B2B] transition"
          >
            <option value="default" className="bg-[#0B0F2E] text-white">
              Sort: Recommended
            </option>
            <option value="priceLow" className="bg-[#0B0F2E] text-white">
              Price: low to high
            </option>
            <option value="rating" className="bg-[#0B0F2E] text-white">
              Highest rated
            </option>
            <option value="sessions" className="bg-[#0B0F2E] text-white">
              Most sessions
            </option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {paginated.map((mentor, i) => (
              <MentorCard
                key={mentor._id || mentor.id}
                mentor={mentor}
                index={i}
                defaultBundle={validBundleParam}
              />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-24 text-center">
              <h3 className="text-lg font-bold text-white">No mentors found matching criteria</h3>
              <p className="mt-1 text-sm text-slate-400">Try loosening your category parameters.</p>
            </div>
          )}
        </div>

        {/* ── FIX (Backend gap — pagination): pagination controls ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm font-bold border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-9 h-9 rounded-lg text-sm font-bold border transition"
                    style={{
                      backgroundColor: page === p ? '#FF6B2B' : 'transparent',
                      color: page === p ? '#fff' : '#cbd5e1',
                      borderColor: page === p ? '#FF6B2B' : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm font-bold border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
