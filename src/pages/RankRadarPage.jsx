import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Frown,
  Trophy,
  ClipboardList,
  User,
} from 'lucide-react';
import { STATES_INDIA, INST_STATE, DB } from '../data/rankRadarData';

// ─── Wizard step definitions ─────────────────────────────────────
const STEPS = [
  {
    id: 'exam',
    title: 'Exam Type',
    info: 'IIT predictions use JEE Advanced ranks. NIT/IIIT/GFTI predictions use JEE Main CRL.',
  },
  { id: 'rank', title: 'Your Rank', info: 'Enter your rank exactly as shown on your scorecard.' },
  {
    id: 'category',
    title: 'Category & PwD',
    info: 'Category determines the cutoff pool used for matching.',
  },
  {
    id: 'gender',
    title: 'Gender',
    info: 'Female candidates also see Female-Only seat pools which have relaxed cutoffs.',
  },
  {
    id: 'homeState',
    title: 'Home State',
    info: 'Applicable for NIT/IIIT quota. Home State quota typically has lower cutoffs.',
  },
  {
    id: 'counselling',
    title: 'Counselling Type',
    info: 'JoSAA is the primary round. CSAB fills remaining seats with relaxed cutoffs.',
  },
];

const CATEGORIES = [
  { v: 'OPEN', icon: '⚪', label: 'General (OPEN)', desc: 'No reservation category' },
  { v: 'EWS', icon: '🟡', label: 'EWS', desc: 'Economically Weaker Section' },
  { v: 'OBC-NCL', icon: '🟠', label: 'OBC-NCL', desc: 'Other Backward Class (Non-Creamy Layer)' },
  { v: 'SC', icon: '🔵', label: 'SC', desc: 'Scheduled Caste' },
  { v: 'ST', icon: '🟢', label: 'ST', desc: 'Scheduled Tribe' },
];

const R_PAGE_SIZE = 15;
const ORDER = { safe: 0, moderate: 1, borderline: 2, unlikely: 3 };

const INITIAL = {
  examType: null,
  rank: null,
  category: null,
  pwd: false,
  gender: null,
  homeState: null,
  counselling: null,
};

// ─── Prediction helpers ──────────────────────────────────────────
function getConfidence(rank, openRank, closeRank) {
  const margin = closeRank - rank;
  const range = closeRank - openRank;
  if (margin < 0)
    return {
      label: 'Unlikely',
      pct: Math.max(5, Math.round(20 * (1 + margin / closeRank))),
      cls: 'unlikely',
    };
  const safeMargin = closeRank * 0.1;
  const modMargin = closeRank * 0.2;
  if (margin >= modMargin)
    return {
      label: 'Safe',
      pct: Math.min(99, Math.round(85 + 15 * (margin / range))),
      cls: 'safe',
    };
  if (margin >= safeMargin)
    return { label: 'Moderate', pct: Math.round(60 + 25 * (margin / modMargin)), cls: 'moderate' };
  return {
    label: 'Borderline',
    pct: Math.round(40 + 20 * (margin / safeMargin)),
    cls: 'borderline',
  };
}

function computeResults(state) {
  const { rank, category, pwd, gender, counselling, examType, homeState } = state;
  const catKey = pwd ? `${category}-PwD` : category;
  const eligiblePools = gender === 'Female' ? ['GN', 'FO'] : ['GN'];
  const eligibleCats = pwd ? [catKey, category] : [catKey];
  const eligibleQuotas = ['AI', 'OS'];
  if (homeState && homeState !== 'All India') eligibleQuotas.push('HS');
  const eligibleCounselling = counselling === 'Both' ? ['JoSAA', 'CSAB'] : [counselling];

  let results = DB.filter((r) => {
    if (r.examType !== examType) return false;
    if (!eligibleCats.includes(r.category)) return false;
    if (!eligiblePools.includes(r.genderPool)) return false;
    if (!eligibleQuotas.includes(r.quota)) return false;
    if (!eligibleCounselling.includes(r.counselling)) return false;
    if (r.quota === 'HS' && INST_STATE[r.institute] !== homeState) return false;
    return true;
  });

  results = results.map((r) => ({
    ...r,
    conf: getConfidence(rank, r.openRank, r.closeRank),
    diff: r.closeRank - rank,
  }));
  results.sort((a, b) => {
    const oc = ORDER[a.conf.cls] - ORDER[b.conf.cls];
    if (oc !== 0) return oc;
    return b.diff - a.diff;
  });
  return results;
}

// ═══════════════════════════════════════════════════════════════
export default function RankRadarPage() {
  const [state, setState] = useState(INITIAL);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState(null); // null = wizard view

  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  const totalSteps = state.examType === 'JEE Adv' ? 4 : STEPS.length;

  const goNext = () => {
    if (step === 0 && !state.examType) return alert('Please select exam type.');
    if (step === 1 && !state.rank) return alert('Please enter your rank.');
    if (step === 2 && !state.category) return alert('Please select your category.');
    if (step === 3 && !state.gender) return alert('Please select gender.');

    // IIT flow ends after gender (step 3)
    if (state.examType === 'JEE Adv' && step === 3) {
      const finalState = { ...state, homeState: 'All India', counselling: 'JoSAA' };
      setState(finalState);
      setResults(computeResults(finalState));
      return;
    }
    // JEE Main last step
    if (step === totalSteps - 1) {
      if (!state.counselling) return alert('Please select counselling type.');
      setResults(computeResults(state));
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const reset = () => {
    setState(INITIAL);
    setStep(0);
    setResults(null);
  };

  return (
    <div className="rr-scope">
      <style>{RR_STYLES}</style>
      <div className="rr-app">
        <div className="rr-topbar">
          <div className="rr-brand">
            <div className="rr-logo">
              <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 1.5L11.5 7H16L12.5 10.5L14 16.5L9 13.5L4 16.5L5.5 10.5L2 7H6.5L9 1.5Z"
                  fill="#e8d5b7"
                />
              </svg>
            </div>
            <div>
              <span className="rr-brand-name">RankRadar</span>
              <span className="rr-brand-sub">&nbsp;JEE Counselling Predictor</span>
            </div>
            <span className="rr-pro-tag">PRO</span>
          </div>
          <span className="rr-badge-year">2025 Data · JoSAA + CSAB</span>
        </div>

        <div className="rr-main">
          {results === null ? (
            <Wizard
              state={state}
              step={step}
              totalSteps={totalSteps}
              set={set}
              setStep={setStep}
              goNext={goNext}
              goBack={goBack}
            />
          ) : (
            <Results state={state} results={results} onReset={reset} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Wizard ──────────────────────────────────────────────────────
function Wizard({ state, step, totalSteps, set, goNext, goBack }) {
  const stepDef = STEPS[step] || STEPS[0];

  return (
    <div className="rr-wizard">
      <div className="rr-wizard-header">
        <div className="rr-step-indicators">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const cls = i < step ? 'done' : i === step ? 'active' : 'pending';
            return (
              <React.Fragment key={i}>
                {i > 0 && <div className="rr-step-line" />}
                <div className={`rr-step-dot ${cls}`}>
                  {i < step ? <Check size={11} strokeWidth={3} /> : i + 1}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="rr-wizard-title">{`Step ${step + 1} of ${totalSteps} — ${stepDef.title}`}</div>
      </div>

      <div className="rr-wizard-body">
        {step === 0 && <ExamStep state={state} set={set} />}
        {step === 1 && <RankStep state={state} set={set} />}
        {step === 2 && <CategoryStep state={state} set={set} />}
        {step === 3 && <GenderStep state={state} set={set} />}
        {step === 4 && <HomeStateStep state={state} set={set} />}
        {step === 5 && <CounsellingStep state={state} set={set} />}
      </div>

      <div className="rr-wizard-footer">
        <span className="rr-footer-info">{stepDef.info}</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button className="rr-btn rr-btn-secondary" onClick={goBack}>
              ← Back
            </button>
          )}
          <button className="rr-btn rr-btn-primary" onClick={goNext}>
            {step === totalSteps - 1 ? 'See Predictions →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepIntro({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--rr-text)', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: 'var(--rr-text3)' }}>{sub}</div>
    </div>
  );
}

function ExamStep({ state, set }) {
  return (
    <>
      <StepIntro
        title="Which exam did you give?"
        sub="This determines which colleges and cutoffs are shown."
      />
      <div className="rr-option-grid rr-cols-2">
        <div
          className={`rr-opt-card ${state.examType === 'JEE Adv' ? 'selected' : ''}`}
          onClick={() => set({ examType: 'JEE Adv' })}
        >
          <div className="rr-opt-icon">
            <Trophy className="w-5 h-5 text-[#FF6B2B]" strokeWidth={2} />
          </div>
          <div className="rr-opt-label">JEE Advanced</div>
          <div className="rr-opt-desc">IITs only — rank from JEE Adv scorecard</div>
        </div>
        <div
          className={`rr-opt-card ${state.examType === 'JEE Main' ? 'selected' : ''}`}
          onClick={() => set({ examType: 'JEE Main' })}
        >
          <div className="rr-opt-icon">
            <ClipboardList className="w-5 h-5 text-[#FF6B2B]" strokeWidth={2} />
          </div>
          <div className="rr-opt-label">JEE Main</div>
          <div className="rr-opt-desc">NITs, IIITs, GFTIs — CRL rank from NTA</div>
        </div>
      </div>
    </>
  );
}

function RankStep({ state, set }) {
  const label = state.examType === 'JEE Adv' ? 'JEE Advanced Rank (AIR)' : 'JEE Main CRL Rank';
  const hint =
    state.examType === 'JEE Adv'
      ? 'Ranks typically range from 1 to ~25,000'
      : 'Ranks range from 1 to ~11,00,000';
  return (
    <>
      <StepIntro title="Enter your rank" sub="Use the rank from your official scorecard." />
      <div className="rr-rank-section">
        <div className="rr-rank-field">
          <label>{label}</label>
          <input
            className="rr-rank-input"
            type="number"
            autoFocus
            value={state.rank || ''}
            min="1"
            placeholder="e.g. 5000"
            onChange={(e) => set({ rank: parseInt(e.target.value, 10) || null })}
          />
          <div className="rr-rank-hint">{hint}</div>
        </div>
      </div>
    </>
  );
}

function CategoryStep({ state, set }) {
  return (
    <>
      <StepIntro
        title="Category & PwD Status"
        sub="Determines which cutoff pool is used for your prediction."
      />
      <div className="rr-option-grid rr-cols-5" style={{ marginBottom: 20 }}>
        {CATEGORIES.map((c) => (
          <div
            key={c.v}
            className={`rr-opt-card ${state.category === c.v ? 'selected' : ''}`}
            onClick={() => set({ category: c.v })}
          >
            <div className="rr-opt-icon">{c.icon}</div>
            <div className="rr-opt-label">{c.label}</div>
            <div className="rr-opt-desc">{c.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--rr-text2)', marginBottom: 10 }}>
          PwD (Persons with Disability)
        </div>
        <div className="rr-chips">
          <div
            className={`rr-chip ${!state.pwd ? 'selected' : ''}`}
            onClick={() => set({ pwd: false })}
          >
            No PwD
          </div>
          <div
            className={`rr-chip ${state.pwd ? 'selected' : ''}`}
            onClick={() => set({ pwd: true })}
          >
            Yes, I have PwD certificate
          </div>
        </div>
      </div>
      {state.pwd && (
        <div className="rr-note rr-note-orange" style={{ marginTop: 10 }}>
          PwD cutoffs are significantly relaxed. Results will include PwD pool seats.
        </div>
      )}
    </>
  );
}

function GenderStep({ state, set }) {
  return (
    <>
      <StepIntro
        title="Gender"
        sub="Female candidates are eligible for both Gender Neutral and Female Only seat pools."
      />
      <div className="rr-option-grid rr-cols-2">
        <div
          className={`rr-opt-card ${state.gender === 'Male' ? 'selected' : ''}`}
          onClick={() => set({ gender: 'Male' })}
        >
          <div className="rr-opt-icon">
            <User className="w-5 h-5 text-[#FF6B2B]" strokeWidth={2} />
          </div>
          <div className="rr-opt-label">Male</div>
          <div className="rr-opt-desc">Gender Neutral pool only</div>
        </div>
        <div
          className={`rr-opt-card ${state.gender === 'Female' ? 'selected' : ''}`}
          onClick={() => set({ gender: 'Female' })}
        >
          <div className="rr-opt-icon">
            <User className="w-5 h-5 text-[#FF6B2B]" strokeWidth={2} />
          </div>
          <div className="rr-opt-label">Female</div>
          <div className="rr-opt-desc">Gender Neutral + Female Only pools</div>
        </div>
      </div>
    </>
  );
}

function HomeStateStep({ state, set }) {
  return (
    <>
      <StepIntro
        title="Your Home State"
        sub="Used to determine Home State (HS) quota eligibility for NITs and IIITs. HS quota seats have lower cutoffs."
      />
      <select
        className="rr-state-select"
        value={state.homeState || ''}
        onChange={(e) => set({ homeState: e.target.value || null })}
      >
        <option value="">— Select your home state —</option>
        {STATES_INDIA.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {state.homeState && (
        <div className="rr-note rr-note-green" style={{ marginTop: 12 }}>
          Home State: <strong>{state.homeState}</strong> — You qualify for HS quota in NITs/IIITs of
          this state.
        </div>
      )}
    </>
  );
}

function CounsellingStep({ state, set }) {
  return (
    <>
      <StepIntro
        title="Counselling Type"
        sub="JoSAA is the main joint seat allocation. CSAB runs special rounds with typically relaxed cutoffs for remaining seats."
      />
      <div className="rr-chips">
        {['JoSAA', 'CSAB', 'Both'].map((c) => (
          <div
            key={c}
            className={`rr-chip ${state.counselling === c ? 'selected' : ''}`}
            onClick={() => set({ counselling: c })}
          >
            {c === 'Both' ? 'Both (combined view)' : `${c} 2025`}
          </div>
        ))}
      </div>
      <div className="rr-info-block" style={{ marginTop: 16 }}>
        <strong>JoSAA:</strong> Primary counselling. Runs 6 rounds. Higher competition.
        <br />
        <strong>CSAB:</strong> Supplemental counselling after JoSAA. Typically lower cutoffs.
        <br />
        <strong>Both:</strong> Shows all available options from both systems.
      </div>
    </>
  );
}

// ─── Results ─────────────────────────────────────────────────────
function Results({ state, results, onReset }) {
  const [rPage, setRPage] = useState(0);
  const [rSearch, setRSearch] = useState('');
  const [rType, setRType] = useState('');
  const [rConf, setRConf] = useState('');
  const [rCounsel, setRCounsel] = useState('');
  const [docsOpen, setDocsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = rSearch.toLowerCase().trim();
    return results.filter((r) => {
      if (rType && r.type !== rType) return false;
      if (rConf && r.conf.cls !== rConf) return false;
      if (rCounsel && r.counselling !== rCounsel) return false;
      if (q && !r.institute.toLowerCase().includes(q) && !r.branch.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [results, rSearch, rType, rConf, rCounsel]);

  useEffect(() => {
    setRPage(0);
  }, [rSearch, rType, rConf, rCounsel]);

  const stats = useMemo(() => {
    const safe = results.filter((r) => r.conf.cls === 'safe').length;
    const instSet = new Set(results.map((r) => r.institute));
    const bestSafe = results.find((r) => r.conf.cls === 'safe');
    return {
      total: results.length,
      safe,
      institutes: instSet.size,
      best: bestSafe ? `${bestSafe.institute.substring(0, 20)}…` : '—',
    };
  }, [results]);

  const start = rPage * R_PAGE_SIZE;
  const end = Math.min(start + R_PAGE_SIZE, filtered.length);
  const slice = filtered.slice(start, end);
  const catDisplay = state.category + (state.pwd ? ' (PwD)' : '');

  return (
    <div className="rr-results-wrap">
      <div className="rr-results-header">
        <div>
          <div className="rr-results-title">College Predictions</div>
          <div className="rr-results-sub">Based on 2024 JoSAA/CSAB cutoffs · 2025 estimates</div>
        </div>
        <div className="rr-profile-chip">
          <span>{state.examType}</span>
          <span>·</span>
          <strong>Rank {state.rank?.toLocaleString()}</strong>
          <span>·</span>
          <span>{catDisplay}</span>
          <span>·</span>
          <span>{state.gender}</span>
          {state.homeState && state.homeState !== 'All India' && (
            <>
              <span>·</span>
              <span>{state.homeState}</span>
            </>
          )}
        </div>
      </div>
      <button
        className="rr-btn rr-btn-secondary rr-btn-sm"
        onClick={onReset}
        style={{ marginBottom: 16 }}
      >
        ← New Prediction
      </button>

      <div className="rr-stats-row">
        <div className="rr-stat-box">
          <div className="rr-stat-label">Total Options</div>
          <div className="rr-stat-val">{stats.total}</div>
        </div>
        <div className="rr-stat-box">
          <div className="rr-stat-label">Safe Picks</div>
          <div className="rr-stat-val" style={{ color: 'var(--rr-green)' }}>
            {stats.safe}
          </div>
        </div>
        <div className="rr-stat-box">
          <div className="rr-stat-label">Institutes</div>
          <div className="rr-stat-val">{stats.institutes}</div>
        </div>
        <div className="rr-stat-box">
          <div className="rr-stat-label">Best Chance</div>
          <div className="rr-stat-val" style={{ fontSize: 14 }}>
            {stats.best}
          </div>
        </div>
      </div>

      <div className="rr-filters-bar">
        <div className="rr-search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search institute or branch..."
            value={rSearch}
            onChange={(e) => setRSearch(e.target.value)}
          />
        </div>
        <select
          className="rr-filter-select"
          value={rType}
          onChange={(e) => setRType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="IIT">IITs</option>
          <option value="NIT">NITs</option>
          <option value="IIIT">IIITs</option>
          <option value="GFTI">GFTIs</option>
        </select>
        <select
          className="rr-filter-select"
          value={rConf}
          onChange={(e) => setRConf(e.target.value)}
        >
          <option value="">All chances</option>
          <option value="safe">Safe</option>
          <option value="moderate">Moderate</option>
          <option value="borderline">Borderline</option>
          <option value="unlikely">Unlikely</option>
        </select>
        <select
          className="rr-filter-select"
          value={rCounsel}
          onChange={(e) => setRCounsel(e.target.value)}
        >
          <option value="">All rounds</option>
          <option value="JoSAA">JoSAA</option>
          <option value="CSAB">CSAB</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rr-empty-state">
          <Frown size={36} />
          <p>No results match your filters</p>
        </div>
      ) : (
        <div className="rr-cards-list">
          {slice.map((r, i) => (
            <ResultCard
              key={`${r.institute}-${r.branch}-${r.counselling}-${start + i}`}
              r={r}
              rank={state.rank}
            />
          ))}
        </div>
      )}

      <div className="rr-pagination">
        <span className="rr-page-info">
          {filtered.length ? `${start + 1}–${end} of ${filtered.length}` : ''}
        </span>
        <button
          className="rr-page-btn"
          disabled={rPage === 0}
          onClick={() => setRPage((p) => p - 1)}
        >
          ← Prev
        </button>
        <button
          className="rr-page-btn"
          disabled={end >= filtered.length}
          onClick={() => setRPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>

      <div className="rr-data-docs">
        <div className="rr-data-docs-header" onClick={() => setDocsOpen((o) => !o)}>
          <h3>📊 How predictions work</h3>
          {docsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {docsOpen && (
          <div className="rr-data-docs-body open">
            <strong>Category codes:</strong> OPEN, EWS, OBC-NCL, SC, ST (append -PwD for PwD pools)
            <br />
            <strong>Gender pools:</strong> GN (Gender Neutral), FO (Female Only)
            <br />
            <strong>Quota codes:</strong> AI (All India / IITs), OS (Other State), HS (Home State)
            <br />
            <strong>Counselling:</strong> JoSAA, CSAB
            <br />
            <br />
            <strong>Prediction confidence bands:</strong>
            <br />
            🟢 <strong>Safe:</strong> Your rank is ≥20% below closing rank (high confidence)
            <br />
            🔵 <strong>Moderate:</strong> Your rank is 10–20% below closing rank
            <br />
            🟠 <strong>Borderline:</strong> Your rank is within 10% of closing rank
            <br />
            🔴 <strong>Unlikely:</strong> Your rank exceeds the closing rank
            <br />
            <br />
            Cutoffs are based on 2024 JoSAA/CSAB closing ranks and used as estimates for 2025. Treat
            these as guidance, not a guarantee.
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ r, rank }) {
  const diff = r.closeRank - rank;
  const diffStr =
    diff >= 0
      ? `+${diff.toLocaleString()} buffer`
      : `${Math.abs(diff).toLocaleString()} above cutoff`;
  const diffCls = diff >= 0 ? 'good' : 'bad';
  const typeBadge =
    r.type === 'IIT'
      ? 'rr-badge-iit'
      : r.type === 'NIT'
        ? 'rr-badge-nit'
        : r.type === 'IIIT'
          ? 'rr-badge-iiit'
          : 'rr-badge-gfti';
  const couBadge = r.counselling === 'JoSAA' ? 'rr-badge-josaa' : 'rr-badge-csab';
  const barWidth = Math.min(100, Math.max(5, r.conf.pct));
  const poolLabel = r.genderPool === 'FO' ? 'Female Only' : 'Gender Neutral';
  const quotaLabel =
    r.quota === 'AI' ? 'All India' : r.quota === 'HS' ? 'Home State' : 'Other State';

  return (
    <div className="rr-result-card">
      <div className="rr-card-top">
        <div className="rr-card-left">
          <div className="rr-inst-row">
            <span className={`rr-inst-badge ${typeBadge}`}>{r.type}</span>
            <span className={`rr-inst-badge ${couBadge}`}>{r.counselling}</span>
            {r.genderPool === 'FO' && <span className="rr-fo-badge">FO</span>}
          </div>
          <div className="rr-inst-name">{r.institute}</div>
          <div className="rr-branch-name">{r.branch}</div>
        </div>
        <div className="rr-card-right">
          <span className={`rr-confidence-pill rr-conf-${r.conf.cls}`}>
            {r.conf.label} · {r.conf.pct}%
          </span>
          <div className="rr-progress-bar-wrap" style={{ width: 90 }}>
            <div
              className={`rr-progress-bar rr-bar-${r.conf.cls}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>
      <div className="rr-card-meta">
        <span className="rr-meta-chip">{r.category}</span>
        <span className="rr-meta-chip">{poolLabel}</span>
        <span className="rr-meta-chip">{quotaLabel} Quota</span>
        <span className="rr-meta-chip">{r.state}</span>
      </div>
      <div className="rr-card-ranks">
        <div className="rr-rank-item">
          <div className="rr-rank-item-label">Opening Rank</div>
          <div className="rr-rank-item-val">{r.openRank.toLocaleString()}</div>
        </div>
        <div className="rr-rank-item">
          <div className="rr-rank-item-label">Closing Rank</div>
          <div className="rr-rank-item-val">{r.closeRank.toLocaleString()}</div>
        </div>
        <div className="rr-rank-item">
          <div className="rr-rank-item-label">Your Rank / Diff</div>
          <div className={`rr-rank-item-val ${diffCls}`}>
            {rank.toLocaleString()} ({diffStr})
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scoped styles (ported from the original RankRadar design) ───
const RR_STYLES = `
.rr-scope{
  --rr-bg:#0B0F2E;
  --rr-bg2:rgba(255,255,255,0.04);
  --rr-bg3:rgba(255,255,255,0.08);
  --rr-border:rgba(255,255,255,0.1);
  --rr-border2:rgba(255,255,255,0.06);
  --rr-text:#ffffff;
  --rr-text2:#94a3b8;
  --rr-text3:#64748b;
  --rr-accent:#ffffff;
  --rr-gold-light:rgba(255,107,43,0.15);
  --rr-blue:#3b82f6;
  --rr-blue-light:rgba(59,130,246,0.1);
  --rr-green:#10b981;
  --rr-green-light:rgba(16,185,129,0.1);
  --rr-orange:#ff6b2b;
  --rr-orange-light:rgba(255,107,43,0.1);
  --rr-red:#ef4444;
  --rr-red-light:rgba(239,68,68,0.1);
  --rr-radius:12px;
  --rr-shadow:0 10px 30px rgba(0,0,0,0.3);
  --rr-shadow-lg:0 15px 40px rgba(0,0,0,0.5);
  font-family:'Inter',system-ui,sans-serif;color:var(--rr-text);background:var(--rr-bg);
}
.rr-scope *{box-sizing:border-box}
.rr-app{display:flex;flex-direction:column;min-height:70vh;background:var(--rr-bg)}
.rr-topbar{background:var(--rr-bg);border-bottom:1px solid var(--rr-border);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.rr-brand{display:flex;align-items:center;gap:10px}
.rr-logo{width:32px;height:32px;background:var(--rr-accent);border-radius:8px;display:flex;align-items:center;justify-content:center}
.rr-logo svg{width:18px;height:18px}
.rr-brand-name{font-family:'DM Serif Display',Georgia,serif;font-size:20px;color:var(--rr-text);letter-spacing:-0.3px}
.rr-brand-sub{font-size:11px;color:var(--rr-text3);font-weight:400;margin-left:2px}
.rr-pro-tag{background:#1a1814;color:#e8d5b7;font-size:10px;font-weight:700;letter-spacing:.5px;padding:2px 8px;border-radius:6px}
.rr-badge-year{background:var(--rr-gold-light);color:#92640a;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;border:1px solid #f0d98a;letter-spacing:.2px}
.rr-main{flex:1;max-width:1140px;margin:0 auto;width:100%;padding:32px 24px}

.rr-wizard{background:var(--rr-bg);border:1px solid var(--rr-border);border-radius:16px;overflow:hidden;box-shadow:var(--rr-shadow-lg)}
.rr-wizard-header{background:var(--rr-bg2);padding:20px 28px;border-bottom:1px solid var(--rr-border);display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.rr-step-indicators{display:flex;align-items:center;gap:6px}
.rr-step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;transition:all .2s;flex-shrink:0}
.rr-step-dot.done{background:var(--rr-accent);color:#fff}
.rr-step-dot.active{background:var(--rr-blue);color:#fff;box-shadow:0 0 0 3px var(--rr-blue-light)}
.rr-step-dot.pending{background:var(--rr-bg3);color:var(--rr-text3)}
.rr-step-line{width:20px;height:1px;background:var(--rr-border);flex-shrink:0}
.rr-wizard-title{font-size:14px;font-weight:500;color:var(--rr-text2);flex:1;min-width:200px}
.rr-wizard-body{padding:32px 28px}

.rr-option-grid{display:grid;gap:12px}
.rr-option-grid.rr-cols-2{grid-template-columns:repeat(2,1fr)}
.rr-option-grid.rr-cols-5{grid-template-columns:repeat(5,1fr)}
.rr-opt-card{border:1.5px solid var(--rr-border);border-radius:var(--rr-radius);padding:16px 18px;cursor:pointer;transition:all .15s;background:var(--rr-bg);display:flex;flex-direction:column;gap:4px}
.rr-opt-card:hover{border-color:var(--rr-blue);background:var(--rr-blue-light)}
.rr-opt-card.selected{border-color:var(--rr-blue);background:var(--rr-blue-light);box-shadow:0 0 0 2px rgba(37,99,235,.15)}
.rr-opt-icon{font-size:20px;margin-bottom:4px}
.rr-opt-label{font-size:14px;font-weight:600;color:var(--rr-text)}
.rr-opt-desc{font-size:12px;color:var(--rr-text3)}

.rr-rank-section{display:flex;flex-direction:column;gap:20px}
.rr-rank-field{display:flex;flex-direction:column;gap:8px}
.rr-rank-field label{font-size:13px;font-weight:600;color:var(--rr-text2);text-transform:uppercase;letter-spacing:.5px}
.rr-rank-input{font-size:28px;font-family:'DM Mono',ui-monospace,monospace;font-weight:500;border:2px solid var(--rr-border);border-radius:var(--rr-radius);padding:14px 18px;color:var(--rr-text);background:var(--rr-bg);width:100%;max-width:340px;transition:border-color .15s}
.rr-rank-input:focus{outline:none;border-color:var(--rr-blue)}
.rr-rank-hint{font-size:12px;color:var(--rr-text3)}

.rr-state-select{font-size:14px;border:1.5px solid var(--rr-border);border-radius:var(--rr-radius);padding:10px 14px;color:var(--rr-text);background:var(--rr-bg);width:100%;max-width:340px;cursor:pointer;transition:border-color .15s}
.rr-state-select:focus{outline:none;border-color:var(--rr-blue)}

.rr-chips{display:flex;gap:10px;flex-wrap:wrap}
.rr-chip{border:1.5px solid var(--rr-border);border-radius:20px;padding:8px 18px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;background:var(--rr-bg);color:var(--rr-text2)}
.rr-chip:hover{border-color:var(--rr-blue);color:var(--rr-blue)}
.rr-chip.selected{border-color:var(--rr-blue);background:var(--rr-blue);color:#fff}

.rr-note{font-size:12px;border-radius:7px;padding:10px 14px}
.rr-note-orange{color:var(--rr-orange);background:var(--rr-orange-light);border:1px solid #fed7aa}
.rr-note-green{color:var(--rr-green);background:var(--rr-green-light);border:1px solid #bbf7d0;font-size:13px}
.rr-info-block{font-size:12px;color:var(--rr-text3);background:var(--rr-bg2);border-radius:7px;padding:12px 14px;line-height:1.7}

.rr-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:inherit}
.rr-btn-primary{background:var(--rr-accent);color:#fff}
.rr-btn-primary:hover{background:#333}
.rr-btn-secondary{background:var(--rr-bg2);color:var(--rr-text);border:1px solid var(--rr-border)}
.rr-btn-secondary:hover{background:var(--rr-bg3)}
.rr-btn-sm{padding:6px 14px;font-size:12px}
.rr-wizard-footer{display:flex;gap:10px;padding:20px 28px;border-top:1px solid var(--rr-border);background:var(--rr-bg2);align-items:center;justify-content:space-between}
.rr-footer-info{font-size:13px;color:var(--rr-text3)}

.rr-results-wrap{margin-top:4px}
.rr-results-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px}
.rr-results-title{font-family:'DM Serif Display',Georgia,serif;font-size:24px;color:var(--rr-text)}
.rr-results-sub{font-size:13px;color:var(--rr-text3);margin-top:2px}
.rr-profile-chip{display:flex;align-items:center;gap:6px;background:var(--rr-bg2);border:1px solid var(--rr-border);border-radius:8px;padding:8px 14px;font-size:12px;color:var(--rr-text2);flex-wrap:wrap}
.rr-profile-chip strong{color:var(--rr-text)}

.rr-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.rr-stat-box{background:var(--rr-bg2);border:1px solid var(--rr-border2);border-radius:var(--rr-radius);padding:14px 16px}
.rr-stat-label{font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:var(--rr-text3);font-weight:600;margin-bottom:4px}
.rr-stat-val{font-size:22px;font-weight:600;font-family:'DM Mono',ui-monospace,monospace;color:var(--rr-text)}

.rr-filters-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center}
.rr-filter-select{padding:7px 12px;font-size:12px;border:1px solid var(--rr-border);border-radius:7px;background:var(--rr-bg);color:var(--rr-text);cursor:pointer}
.rr-search-box{flex:1;min-width:200px;position:relative;display:flex;align-items:center}
.rr-search-box svg{position:absolute;left:10px;color:var(--rr-text3);pointer-events:none}
.rr-search-box input{width:100%;padding:8px 10px 8px 32px;font-size:13px;border:1px solid var(--rr-border);border-radius:7px;background:var(--rr-bg);color:var(--rr-text)}
.rr-search-box input:focus{outline:none;border-color:var(--rr-blue)}

.rr-cards-list{display:flex;flex-direction:column;gap:10px}
.rr-result-card{background:var(--rr-bg);border:1px solid var(--rr-border2);border-radius:var(--rr-radius);padding:16px 20px;transition:box-shadow .15s;position:relative}
.rr-result-card:hover{box-shadow:var(--rr-shadow-lg);border-color:var(--rr-border)}
.rr-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.rr-card-left{flex:1;min-width:0}
.rr-inst-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.rr-inst-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:.3px;white-space:nowrap}
.rr-badge-iit{background:#1a1a2e;color:#e8d5b7}
.rr-badge-nit{background:var(--rr-green-light);color:#166534;border:1px solid #bbf7d0}
.rr-badge-iiit{background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe}
.rr-badge-gfti{background:var(--rr-bg3);color:var(--rr-text2);border:1px solid var(--rr-border)}
.rr-badge-josaa{background:var(--rr-blue-light);color:#1d4ed8;border:1px solid #bfdbfe;font-size:9px;padding:2px 6px}
.rr-badge-csab{background:var(--rr-orange-light);color:#c2410c;border:1px solid #fed7aa;font-size:9px;padding:2px 6px}
.rr-fo-badge{font-size:10px;background:#fdf4ff;color:#7c3aed;border:1px solid #e9d5ff;padding:2px 6px;border-radius:4px;font-weight:600}
.rr-inst-name{font-size:15px;font-weight:600;color:var(--rr-text);line-height:1.3}
.rr-branch-name{font-size:13px;color:var(--rr-text2);margin-top:2px}
.rr-card-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}
.rr-confidence-pill{font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;white-space:nowrap}
.rr-conf-safe{background:var(--rr-green-light);color:var(--rr-green);border:1px solid #bbf7d0}
.rr-conf-moderate{background:var(--rr-blue-light);color:var(--rr-blue);border:1px solid #bfdbfe}
.rr-conf-borderline{background:var(--rr-orange-light);color:var(--rr-orange);border:1px solid #fed7aa}
.rr-conf-unlikely{background:var(--rr-red-light);color:var(--rr-red);border:1px solid #fecaca}
.rr-card-meta{display:flex;gap:8px;flex-wrap:wrap}
.rr-meta-chip{font-size:11px;color:var(--rr-text3);background:var(--rr-bg2);padding:3px 9px;border-radius:5px;border:1px solid var(--rr-border2)}
.rr-card-ranks{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-top:12px;margin-top:12px;border-top:1px solid var(--rr-border2)}
.rr-rank-item{display:flex;flex-direction:column;gap:2px}
.rr-rank-item-label{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:var(--rr-text3);font-weight:600}
.rr-rank-item-val{font-size:14px;font-weight:600;font-family:'DM Mono',ui-monospace,monospace;color:var(--rr-text)}
.rr-rank-item-val.good{color:var(--rr-green)}
.rr-rank-item-val.bad{color:var(--rr-red)}
.rr-progress-bar-wrap{height:4px;background:var(--rr-bg3);border-radius:4px;margin-top:4px;overflow:hidden}
.rr-progress-bar{height:100%;border-radius:4px;transition:width .4s ease}
.rr-bar-safe{background:var(--rr-green)}
.rr-bar-moderate{background:var(--rr-blue)}
.rr-bar-borderline{background:var(--rr-orange)}
.rr-bar-unlikely{background:var(--rr-red)}

.rr-pagination{display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-top:16px}
.rr-page-info{font-size:12px;color:var(--rr-text3);flex:1}
.rr-page-btn{padding:6px 14px;font-size:12px;border-radius:6px;border:1px solid var(--rr-border);background:var(--rr-bg);cursor:pointer;font-family:inherit;font-weight:500;color:var(--rr-text)}
.rr-page-btn:hover{background:var(--rr-bg2)}
.rr-page-btn:disabled{opacity:.35;cursor:not-allowed}

.rr-empty-state{text-align:center;padding:48px 32px;color:var(--rr-text3)}
.rr-empty-state svg{display:block;margin:0 auto 12px;opacity:.4}
.rr-empty-state p{font-size:14px}

.rr-data-docs{background:var(--rr-bg2);border:1px solid var(--rr-border);border-radius:var(--rr-radius);margin-top:24px;overflow:hidden}
.rr-data-docs-header{padding:14px 20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none}
.rr-data-docs-header h3{font-size:13px;font-weight:600;color:var(--rr-text2)}
.rr-data-docs-body{padding:0 20px 16px;font-size:12px;color:var(--rr-text3);line-height:1.7}

@media(max-width:700px){
  .rr-topbar{padding:0 16px}
  .rr-main{padding:20px 12px}
  .rr-wizard-body,.rr-wizard-footer{padding:20px 16px}
  .rr-wizard-header{padding:14px 16px}
  .rr-option-grid.rr-cols-2,.rr-option-grid.rr-cols-5{grid-template-columns:1fr 1fr}
  .rr-stats-row{grid-template-columns:1fr 1fr}
  .rr-card-ranks{grid-template-columns:1fr 1fr}
  .rr-step-indicators{
    width:100%;
    overflow-x:auto;
    padding:4px 0;
    scrollbar-width:none;
    -ms-overflow-style:none;
  }
  .rr-step-indicators::-webkit-scrollbar{
    display:none;
  }
}
@media(max-width:480px){
  .rr-option-grid.rr-cols-2,.rr-option-grid.rr-cols-5{grid-template-columns:1fr}
  .rr-brand-sub{display:none}
  .rr-badge-year{font-size:10px;padding:3px 8px}
}
`;
