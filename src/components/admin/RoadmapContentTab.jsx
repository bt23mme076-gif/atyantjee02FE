import React, { useState, useEffect, useCallback } from 'react';
import {
  adminListPillars, adminCreatePillar, adminUpdatePillar, adminDeletePillar,
  adminListItems, adminCreateItem, adminUpdateItem, adminDeleteItem,
  adminListCareerPaths, adminCreateCareerPath, adminUpdateCareerPath, adminDeleteCareerPath,
  adminListFaqVideos, adminCreateFaqVideo, adminUpdateFaqVideo, adminDeleteFaqVideo,
  uploadRoadmapContent,
} from '../../utils/api';

const SUB_TABS = ['Pillars', 'Content Items', 'Career Paths', 'FAQ Videos'];

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40';

// ─── Pillars sub-tab ──────────────────────────────────────────────────
function PillarsPanel() {
  const [pillars, setPillars] = useState([]);
  const [form, setForm] = useState({ key: '', title: '', tagline: '', icon: 'Compass', order: 0, isFlagship: false });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => adminListPillars().then((r) => setPillars(r.pillars || [])).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ key: '', title: '', tagline: '', icon: 'Compass', order: 0, isFlagship: false }); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) await adminUpdatePillar(editingId, form);
      else await adminCreatePillar(form);
      resetForm();
      load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const startEdit = (p) => { setForm({ key: p.key, title: p.title, tagline: p.tagline, icon: p.icon, order: p.order, isFlagship: p.isFlagship }); setEditingId(p.id); };

  const remove = async (id) => {
    if (!window.confirm('Delete this pillar and all its content items?')) return;
    await adminDeletePillar(id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {error && <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
        <Field label="Key (unique, e.g. college-arrival)">
          <input required disabled={!!editingId} value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></Field>
        <Field label="Tagline"><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} /></Field>
        <Field label="Icon (lucide name)"><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls} placeholder="Compass, ShieldCheck, Flame..." /></Field>
        <Field label="Order"><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} /></Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isFlagship} onChange={(e) => setForm({ ...form, isFlagship: e.target.checked })} /> Flagship
        </label>
        <div className="col-span-full flex gap-2">
          <button disabled={saving} type="submit" className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42] disabled:opacity-60">
            {editingId ? 'Save changes' : 'Add pillar'}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600">Cancel</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-2">Order</th><th className="px-4 py-2">Title</th><th className="px-4 py-2">Key</th><th className="px-4 py-2"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pillars.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.order}</td>
                <td className="px-4 py-2 font-semibold">{p.title} {p.isFlagship && <span className="ml-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">Flagship</span>}</td>
                <td className="px-4 py-2 text-gray-500">{p.key}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => startEdit(p)} className="mr-3 text-xs font-semibold text-blue-600">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-xs font-semibold text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Content Items sub-tab (documents/videos/tasks) ──────────────────
function ItemsPanel() {
  const [pillars, setPillars] = useState([]);
  const [pillarId, setPillarId] = useState('');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'video', url: '', durationLabel: '', order: 0, requiresReferralUnlock: false });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { adminListPillars().then((r) => { setPillars(r.pillars || []); if (r.pillars?.length) setPillarId(r.pillars[0].id); }); }, []);

  const load = useCallback(() => {
    if (!pillarId) return;
    adminListItems(pillarId).then((r) => setItems(r.items || [])).catch((e) => setError(e.message));
  }, [pillarId]);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ title: '', type: 'video', url: '', durationLabel: '', order: 0, requiresReferralUnlock: false }); setEditingId(null); };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadRoadmapContent(file);
      setForm((f) => ({ ...f, url: res.url }));
    } catch (err) { setError(err.message); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await adminUpdateItem(editingId, form);
      else await adminCreateItem({ ...form, pillar: pillarId });
      resetForm();
      load();
    } catch (err) { setError(err.message); }
  };

  const startEdit = (i) => { setForm({ title: i.title, type: i.type, url: i.url, durationLabel: i.durationLabel, order: i.order, requiresReferralUnlock: i.requiresReferralUnlock }); setEditingId(i.id); };
  const remove = async (id) => { if (!window.confirm('Delete this item?')) return; await adminDeleteItem(id); load(); };

  return (
    <div className="space-y-6">
      <Field label="Pillar">
        <select value={pillarId} onChange={(e) => setPillarId(e.target.value)} className={inputCls}>
          {pillars.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </Field>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {error && <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
        <Field label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></Field>
        <Field label="Type">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
            <option value="video">Video</option><option value="document">Document</option>
            <option value="article">Article</option><option value="task">Task</option><option value="quiz">Quiz</option>
          </select>
        </Field>
        <Field label="Duration label (e.g. 8 min watch)"><input value={form.durationLabel} onChange={(e) => setForm({ ...form, durationLabel: e.target.value })} className={inputCls} /></Field>
        <Field label="Upload a file (PDF/video/image)">
          <input type="file" onChange={handleFile} className="w-full text-xs" />
          {uploading && <p className="mt-1 text-xs text-gray-500">Uploading…</p>}
        </Field>
        <Field label="Or paste a URL (YouTube, Drive link, etc.)">
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://..." />
        </Field>
        <Field label="Order"><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} /></Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.requiresReferralUnlock} onChange={(e) => setForm({ ...form, requiresReferralUnlock: e.target.checked })} />
          Requires referral unlock
        </label>
        <div className="col-span-full flex gap-2">
          <button type="submit" className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42]">
            {editingId ? 'Save changes' : 'Add item'}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600">Cancel</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-2">Title</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Gated?</th><th className="px-4 py-2"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-2 font-semibold">{i.title}</td>
                <td className="px-4 py-2 capitalize text-gray-500">{i.type}</td>
                <td className="px-4 py-2">{i.requiresReferralUnlock ? 'Yes' : '—'}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => startEdit(i)} className="mr-3 text-xs font-semibold text-blue-600">Edit</button>
                  <button onClick={() => remove(i.id)} className="text-xs font-semibold text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Career Paths sub-tab ──────────────────────────────────────────────
function CareerPathsPanel() {
  const [paths, setPaths] = useState([]);
  const [form, setForm] = useState({ title: '', colorKey: 'rose', order: 0, isFeatured: false });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => adminListCareerPaths().then((r) => setPaths(r.careerPaths || [])).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ title: '', colorKey: 'rose', order: 0, isFeatured: false }); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await adminUpdateCareerPath(editingId, form);
      else await adminCreateCareerPath(form);
      resetForm();
      load();
    } catch (err) { setError(err.message); }
  };

  const startEdit = (p) => { setForm({ title: p.title, colorKey: p.colorKey, order: p.order, isFeatured: p.isFeatured }); setEditingId(p.id); };
  const remove = async (id) => { if (!window.confirm('Delete this career path?')) return; await adminDeleteCareerPath(id); load(); };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {error && <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
        <Field label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></Field>
        <Field label="Color">
          <select value={form.colorKey} onChange={(e) => setForm({ ...form, colorKey: e.target.value })} className={inputCls}>
            {['rose', 'violet', 'emerald', 'amber', 'sky'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Order"><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} /></Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured (shown by default)
        </label>
        <div className="col-span-full flex gap-2">
          <button type="submit" className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42]">
            {editingId ? 'Save changes' : 'Add career path'}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600">Cancel</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-2">Title</th><th className="px-4 py-2">Color</th><th className="px-4 py-2">Featured?</th><th className="px-4 py-2"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paths.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 font-semibold">{p.title}</td>
                <td className="px-4 py-2 capitalize text-gray-500">{p.colorKey}</td>
                <td className="px-4 py-2">{p.isFeatured ? 'Yes' : '—'}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => startEdit(p)} className="mr-3 text-xs font-semibold text-blue-600">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-xs font-semibold text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── FAQ Videos sub-tab ─────────────────────────────────────────────────
function FaqVideosPanel() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ question: '', shortAnswer: '', videoUrl: '', order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => adminListFaqVideos().then((r) => setVideos(r.faqVideos || [])).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ question: '', shortAnswer: '', videoUrl: '', order: 0 }); setEditingId(null); };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadRoadmapContent(file);
      setForm((f) => ({ ...f, videoUrl: res.url }));
    } catch (err) { setError(err.message); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await adminUpdateFaqVideo(editingId, form);
      else await adminCreateFaqVideo(form);
      resetForm();
      load();
    } catch (err) { setError(err.message); }
  };

  const startEdit = (v) => { setForm({ question: v.question, shortAnswer: v.shortAnswer, videoUrl: v.videoUrl, order: v.order }); setEditingId(v.id); };
  const remove = async (id) => { if (!window.confirm('Delete this FAQ video?')) return; await adminDeleteFaqVideo(id); load(); };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
        {error && <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
        <Field label="Question"><input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} /></Field>
        <Field label="Short answer (shown on the card)"><input value={form.shortAnswer} onChange={(e) => setForm({ ...form, shortAnswer: e.target.value })} className={inputCls} /></Field>
        <Field label="Upload a video">
          <input type="file" accept="video/*" onChange={handleFile} className="w-full text-xs" />
          {uploading && <p className="mt-1 text-xs text-gray-500">Uploading…</p>}
        </Field>
        <Field label="Or paste a YouTube/Vimeo link">
          <input required value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputCls} placeholder="https://youtube.com/watch?v=..." />
        </Field>
        <Field label="Order"><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} /></Field>
        <div className="col-span-full flex gap-2">
          <button type="submit" className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42]">
            {editingId ? 'Save changes' : 'Add FAQ video'}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600">Cancel</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-2">Question</th><th className="px-4 py-2">Video</th><th className="px-4 py-2"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {videos.map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-2 font-semibold">{v.question}</td>
                <td className="max-w-xs truncate px-4 py-2 text-gray-500">{v.videoUrl}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => startEdit(v)} className="mr-3 text-xs font-semibold text-blue-600">Edit</button>
                  <button onClick={() => remove(v.id)} className="text-xs font-semibold text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Roadmap content management tab ───────────────────────────────────
// Rendered inside the existing Atyant Admin Dashboard (AtyantLoginPage.jsx)
// as a new "roadmap" tab, giving the team a place to upload documents and
// videos into the /roadmap page's pillars, career paths, and FAQ videos.
export default function RoadmapContentTab() {
  const [subTab, setSubTab] = useState('Pillars');

  return (
    <div>
      <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-none pb-1 whitespace-nowrap">
        {SUB_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition shrink-0 ${
              subTab === t ? 'bg-[#0B0F2E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {subTab === 'Pillars' && <PillarsPanel />}
      {subTab === 'Content Items' && <ItemsPanel />}
      {subTab === 'Career Paths' && <CareerPathsPanel />}
      {subTab === 'FAQ Videos' && <FaqVideosPanel />}
    </div>
  );
}
