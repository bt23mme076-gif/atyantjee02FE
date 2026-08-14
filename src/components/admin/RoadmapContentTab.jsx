import React, { useState, useEffect, useCallback } from 'react';
import {
  adminListPillars,
  adminCreatePillar,
  adminUpdatePillar,
  adminDeletePillar,
  adminListItems,
  adminCreateItem,
  adminUpdateItem,
  adminDeleteItem,
  adminListCareerPaths,
  adminCreateCareerPath,
  adminUpdateCareerPath,
  adminDeleteCareerPath,
  adminListCareerPathItems,
  adminCreateCareerPathItem,
  adminUpdateCareerPathItem,
  adminDeleteCareerPathItem,
  adminListFaqVideos,
  adminCreateFaqVideo,
  adminUpdateFaqVideo,
  adminDeleteFaqVideo,
  uploadRoadmapContent,
  adminUpdateCareerDetail,
  getCareerDetail,
} from '../../utils/api';

const SUB_TABS = [
  'Pillars',
  'Pillar Content Items',
  'Career Paths',
  'Career Path Items',
  'Career Path Content',
  'FAQ Videos',
];

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40';

// ─── Pillars sub-tab ──────────────────────────────────────────────────
function PillarsPanel() {
  const [pillars, setPillars] = useState([]);
  const [form, setForm] = useState({
    key: '',
    title: '',
    tagline: '',
    icon: 'Compass',
    order: 0,
    isFlagship: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    () =>
      adminListPillars()
        .then((r) => setPillars(r.pillars || []))
        .catch((e) => setError(e.message)),
    []
  );
  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({ key: '', title: '', tagline: '', icon: 'Compass', order: 0, isFlagship: false });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) await adminUpdatePillar(editingId, form);
      else await adminCreatePillar(form);
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setForm({
      key: p.key,
      title: p.title,
      tagline: p.tagline,
      icon: p.icon,
      order: p.order,
      isFlagship: p.isFlagship,
    });
    setEditingId(p.id);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this pillar and all its content items?')) return;
    await adminDeletePillar(id);
    load();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {error && (
          <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
        <Field label="Key (unique, e.g. college-arrival)">
          <input
            required
            disabled={!!editingId}
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Tagline">
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Icon (lucide name)">
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className={inputCls}
            placeholder="Compass, ShieldCheck, Flame..."
          />
        </Field>
        <Field label="Order">
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isFlagship}
            onChange={(e) => setForm({ ...form, isFlagship: e.target.checked })}
          />{' '}
          Flagship
        </label>
        <div className="col-span-full flex gap-2">
          <button
            disabled={saving}
            type="submit"
            className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42] disabled:opacity-60"
          >
            {editingId ? 'Save changes' : 'Add pillar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Key</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pillars.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.order}</td>
                <td className="px-4 py-2 font-semibold">
                  {p.title}{' '}
                  {p.isFlagship && (
                    <span className="ml-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      Flagship
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-gray-500">{p.key}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => startEdit(p)}
                    className="mr-3 text-xs font-semibold text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Type-specific field sets ──────────────────────────────────────────
function VideoFields({ form, setForm, uploading, handleFile }) {
  return (
    <>
      <Field label="YouTube / Drive / Vimeo URL">
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className={inputCls}
          placeholder="https://youtu.be/... or https://drive.google.com/..."
        />
      </Field>
      <Field label="— OR — Upload an MP4 / MOV / WEBM file">
        <input type="file" accept="video/*" onChange={handleFile} className="w-full text-xs" />
        {uploading && <p className="mt-1 text-xs text-blue-500">Uploading video…</p>}
        {form.url && form.url.startsWith('/api/') && (
          <p className="mt-1 truncate text-xs text-green-600">Uploaded: {form.url}</p>
        )}
      </Field>
      <Field label="Duration label (e.g. 12 min watch)">
        <input
          value={form.durationLabel}
          onChange={(e) => setForm({ ...form, durationLabel: e.target.value })}
          className={inputCls}
          placeholder="12 min watch"
        />
      </Field>
    </>
  );
}

function DocumentFields({ form, setForm, uploading, handleFile }) {
  return (
    <>
      <Field label="Upload a PDF / PPT / DOC / DOCX">
        <input
          type="file"
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          onChange={handleFile}
          className="w-full text-xs"
        />
        {uploading && <p className="mt-1 text-xs text-blue-500">Uploading document…</p>}
        {form.url && (
          <p className="mt-1 truncate text-xs text-green-600">
            {form.url.startsWith('/api/') ? `Uploaded: ${form.url}` : `Linked: ${form.url}`}
          </p>
        )}
      </Field>
      <Field label="— OR — External document / Notion / Drive link">
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className={inputCls}
          placeholder="https://..."
        />
      </Field>
      <Field label="Pages / duration label (e.g. 8 pages or 15 min read)">
        <input
          value={form.durationLabel}
          onChange={(e) => setForm({ ...form, durationLabel: e.target.value })}
          className={inputCls}
          placeholder="8 pages"
        />
      </Field>
    </>
  );
}

function ArticleFields({ form, setForm }) {
  return (
    <>
      <Field label="Article / Blog URL" required>
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className={inputCls}
          placeholder="https://medium.com/... or https://..."
        />
      </Field>
      <Field label="Read time label (e.g. 7 min read)">
        <input
          value={form.durationLabel}
          onChange={(e) => setForm({ ...form, durationLabel: e.target.value })}
          className={inputCls}
          placeholder="7 min read"
        />
      </Field>
    </>
  );
}

function TaskFields({ form, setForm }) {
  return (
    <>
      <Field label="Task description / what to do" required>
        <textarea
          rows={3}
          value={form.taskDetails}
          onChange={(e) => setForm({ ...form, taskDetails: e.target.value })}
          className={inputCls}
          placeholder="Detailed task instructions..."
        />
      </Field>
      <Field label="Optional reference link (GitHub, repo, sheet, etc.)">
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className={inputCls}
          placeholder="https://github.com/..."
        />
      </Field>
      <Field label="Est. time to complete (e.g. 30 mins)">
        <input
          value={form.durationLabel}
          onChange={(e) => setForm({ ...form, durationLabel: e.target.value })}
          className={inputCls}
          placeholder="30 mins"
        />
      </Field>
    </>
  );
}

function QuizFields({ form, setForm }) {
  return (
    <>
      <Field label="Quiz URL or internal quiz path">
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className={inputCls}
          placeholder="/quiz or https://external-quiz-link..."
        />
      </Field>
      <Field label="Estimated time (e.g. 10 min quiz)">
        <input
          value={form.durationLabel}
          onChange={(e) => setForm({ ...form, durationLabel: e.target.value })}
          className={inputCls}
          placeholder="10 min quiz"
        />
      </Field>
    </>
  );
}

// ─── Content Items sub-tab (documents/videos/tasks) ──────────────────
function ItemsPanel() {
  const [pillars, setPillars] = useState([]);
  const [pillarId, setPillarId] = useState('');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    type: 'video',
    url: '',
    durationLabel: '',
    order: 0,
    requiresReferralUnlock: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminListPillars().then((r) => {
      setPillars(r.pillars || []);
      if (r.pillars?.length) setPillarId(r.pillars[0].id);
    });
  }, []);

  const load = useCallback(() => {
    if (!pillarId) return;
    adminListItems(pillarId)
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e.message));
  }, [pillarId]);
  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({
      title: '',
      type: 'video',
      url: '',
      durationLabel: '',
      order: 0,
      requiresReferralUnlock: false,
    });
    setEditingId(null);
  };

  // When type changes, clear url/durationLabel to avoid leftover data
  const handleTypeChange = (newType) => {
    setForm({ ...form, type: newType, url: '', durationLabel: '' });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadRoadmapContent(file);
      setForm((f) => ({ ...f, url: res.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await adminUpdateItem(editingId, form);
      else await adminCreateItem({ ...form, pillar: pillarId });
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (i) => {
    setForm({
      title: i.title,
      type: i.type,
      url: i.url,
      durationLabel: i.durationLabel,
      order: i.order,
      requiresReferralUnlock: i.requiresReferralUnlock,
    });
    setEditingId(i.id);
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await adminDeleteItem(id);
    load();
  };

  const typeDescriptions = {
    video: 'Upload or link a video for students to watch.',
    document: 'Upload a PDF/doc or link a shareable file for students to read.',
    article: 'Link to a blog post, guide, or external webpage.',
    task: 'Define an action students must complete (no file needed).',
    quiz: 'Link to an internal quiz or external quiz tool.',
  };

  const typeBadgeColors = {
    video: 'bg-purple-100 text-purple-700',
    document: 'bg-blue-100 text-blue-700',
    article: 'bg-green-100 text-green-700',
    task: 'bg-yellow-100 text-yellow-700',
    quiz: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="space-y-6">
      <Field label="Pillar">
        <select value={pillarId} onChange={(e) => setPillarId(e.target.value)} className={inputCls}>
          {pillars.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 p-4">
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

        {/* ── Row 1: Title + Type + Order ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
              placeholder="e.g. How to get your offer letter"
            />
          </Field>
          <Field label="Content Type">
            <select
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className={inputCls}
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="article">Article</option>
              <option value="task">Task</option>
              <option value="quiz">Quiz</option>
            </select>
          </Field>
          <Field label="Order (lower = first)">
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
        </div>

        {/* ── Type description hint ── */}
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
          <span
            className={`mr-2 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${typeBadgeColors[form.type]}`}
          >
            {form.type}
          </span>
          {typeDescriptions[form.type]}
        </p>

        {/* ── Type-specific fields ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {form.type === 'video' && (
            <VideoFields
              form={form}
              setForm={setForm}
              uploading={uploading}
              handleFile={handleFile}
            />
          )}
          {form.type === 'document' && (
            <DocumentFields
              form={form}
              setForm={setForm}
              uploading={uploading}
              handleFile={handleFile}
            />
          )}
          {form.type === 'article' && <ArticleFields form={form} setForm={setForm} />}
          {form.type === 'task' && <TaskFields form={form} setForm={setForm} />}
          {form.type === 'quiz' && <QuizFields form={form} setForm={setForm} />}
        </div>

        {/* ── Referral gate + submit ── */}
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.requiresReferralUnlock}
              onChange={(e) => setForm({ ...form, requiresReferralUnlock: e.target.checked })}
            />
            Requires referral unlock
          </label>
          <div className="ml-auto flex gap-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42] disabled:opacity-60"
            >
              {editingId ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">URL / File</th>
              <th className="px-4 py-2">Gated?</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-2 font-semibold">{i.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${typeBadgeColors[i.type] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {i.type}
                  </span>
                </td>
                <td className="max-w-[200px] truncate px-4 py-2 text-xs text-gray-400">
                  {i.url || '—'}
                </td>
                <td className="px-4 py-2">{i.requiresReferralUnlock ? 'Yes' : '—'}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => startEdit(i)}
                    className="mr-3 text-xs font-semibold text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(i.id)}
                    className="text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Career Path Items sub-tab (same type-specific fields as Pillar Items) ────
function CareerPathItemsPanel() {
  const [paths, setPaths] = useState([]);
  const [careerPathId, setCareerPathId] = useState('');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    type: 'video',
    url: '',
    durationLabel: '',
    order: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminListCareerPaths().then((r) => {
      const list = r.careerPaths || [];
      setPaths(list);
      if (list.length) setCareerPathId(list[0].id);
    });
  }, []);

  const load = useCallback(() => {
    if (!careerPathId) return;
    adminListCareerPathItems(careerPathId)
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e.message));
  }, [careerPathId]);
  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({ title: '', type: 'video', url: '', durationLabel: '', order: 0 });
    setEditingId(null);
  };

  const handleTypeChange = (newType) => {
    setForm({ ...form, type: newType, url: '', durationLabel: '' });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadRoadmapContent(file);
      setForm((f) => ({ ...f, url: res.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await adminUpdateCareerPathItem(editingId, form);
      else await adminCreateCareerPathItem({ ...form, careerPath: careerPathId });
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (i) => {
    setForm({
      title: i.title,
      type: i.type,
      url: i.url,
      durationLabel: i.durationLabel,
      order: i.order,
    });
    setEditingId(i.id);
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await adminDeleteCareerPathItem(id);
    load();
  };

  const typeDescriptions = {
    video: 'Upload or link a video for students to watch.',
    document: 'Upload a PDF/doc or link a shareable file for students to read.',
    article: 'Link to a blog post, guide, or external webpage.',
    task: 'Define an action students must complete (no file needed).',
    quiz: 'Link to an internal quiz or external quiz tool.',
  };
  const typeBadgeColors = {
    video: 'bg-purple-100 text-purple-700',
    document: 'bg-blue-100 text-blue-700',
    article: 'bg-green-100 text-green-700',
    task: 'bg-yellow-100 text-yellow-700',
    quiz: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="space-y-6">
      <Field label="Career Path">
        <select
          value={careerPathId}
          onChange={(e) => setCareerPathId(e.target.value)}
          className={inputCls}
        >
          {paths.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 p-4">
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

        {/* Row 1: Title + Type + Order */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
              placeholder="e.g. Introduction to Software Engineering"
            />
          </Field>
          <Field label="Content Type">
            <select
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className={inputCls}
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="article">Article</option>
              <option value="task">Task</option>
              <option value="quiz">Quiz</option>
            </select>
          </Field>
          <Field label="Order (lower = first)">
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
        </div>

        {/* Type hint */}
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
          <span
            className={`mr-2 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${typeBadgeColors[form.type]}`}
          >
            {form.type}
          </span>
          {typeDescriptions[form.type]}
        </p>

        {/* Type-specific fields — reuse the same components from Pillar Items */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {form.type === 'video' && (
            <VideoFields
              form={form}
              setForm={setForm}
              uploading={uploading}
              handleFile={handleFile}
            />
          )}
          {form.type === 'document' && (
            <DocumentFields
              form={form}
              setForm={setForm}
              uploading={uploading}
              handleFile={handleFile}
            />
          )}
          {form.type === 'article' && <ArticleFields form={form} setForm={setForm} />}
          {form.type === 'task' && <TaskFields form={form} setForm={setForm} />}
          {form.type === 'quiz' && <QuizFields form={form} setForm={setForm} />}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42] disabled:opacity-60"
          >
            {editingId ? 'Save changes' : 'Add item'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">URL / File</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-2 font-semibold">{i.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${typeBadgeColors[i.type] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {i.type}
                  </span>
                </td>
                <td className="max-w-[200px] truncate px-4 py-2 text-xs text-gray-400">
                  {i.url || '—'}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => startEdit(i)}
                    className="mr-3 text-xs font-semibold text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(i.id)}
                    className="text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
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

  const load = useCallback(
    () =>
      adminListCareerPaths()
        .then((r) => setPaths(r.careerPaths || []))
        .catch((e) => setError(e.message)),
    []
  );
  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({ title: '', colorKey: 'rose', order: 0, isFeatured: false });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await adminUpdateCareerPath(editingId, form);
      else await adminCreateCareerPath(form);
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (p) => {
    setForm({ title: p.title, colorKey: p.colorKey, order: p.order, isFeatured: p.isFeatured });
    setEditingId(p.id);
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this career path?')) return;
    await adminDeleteCareerPath(id);
    load();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {error && (
          <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Color">
          <select
            value={form.colorKey}
            onChange={(e) => setForm({ ...form, colorKey: e.target.value })}
            className={inputCls}
          >
            {['rose', 'violet', 'emerald', 'amber', 'sky'].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Order">
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />{' '}
          Featured (shown by default)
        </label>
        <div className="col-span-full flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42]"
          >
            {editingId ? 'Save changes' : 'Add career path'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Color</th>
              <th className="px-4 py-2">Featured?</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paths.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 font-semibold">{p.title}</td>
                <td className="px-4 py-2 capitalize text-gray-500">{p.colorKey}</td>
                <td className="px-4 py-2">{p.isFeatured ? 'Yes' : '—'}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => startEdit(p)}
                    className="mr-3 text-xs font-semibold text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
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

  const load = useCallback(
    () =>
      adminListFaqVideos()
        .then((r) => setVideos(r.faqVideos || []))
        .catch((e) => setError(e.message)),
    []
  );
  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({ question: '', shortAnswer: '', videoUrl: '', order: 0 });
    setEditingId(null);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadRoadmapContent(file);
      setForm((f) => ({ ...f, videoUrl: res.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await adminUpdateFaqVideo(editingId, form);
      else await adminCreateFaqVideo(form);
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (v) => {
    setForm({
      question: v.question,
      shortAnswer: v.shortAnswer,
      videoUrl: v.videoUrl,
      order: v.order,
    });
    setEditingId(v.id);
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this FAQ video?')) return;
    await adminDeleteFaqVideo(id);
    load();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2"
      >
        {error && (
          <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
        <Field label="Question">
          <input
            required
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Short answer (shown on the card)">
          <input
            value={form.shortAnswer}
            onChange={(e) => setForm({ ...form, shortAnswer: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Upload a video">
          <input type="file" accept="video/*" onChange={handleFile} className="w-full text-xs" />
          {uploading && <p className="mt-1 text-xs text-gray-500">Uploading…</p>}
        </Field>
        <Field label="Or paste a YouTube/Vimeo link">
          <input
            required
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className={inputCls}
            placeholder="https://youtube.com/watch?v=..."
          />
        </Field>
        <Field label="Order">
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <div className="col-span-full flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-[#FF6B2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff7a42]"
          >
            {editingId ? 'Save changes' : 'Add FAQ video'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Question</th>
              <th className="px-4 py-2">Video</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {videos.map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-2 font-semibold">{v.question}</td>
                <td className="max-w-xs truncate px-4 py-2 text-gray-500">{v.videoUrl}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => startEdit(v)}
                    className="mr-3 text-xs font-semibold text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(v.id)}
                    className="text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Career Path Content sub-tab ─────────────────────────────────────────
function CareerPathContentPanel() {
  const [paths, setPaths] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [roadmap, setRoadmap] = useState(
    [1, 2, 3, 4].map((y) => ({ year: y, focus: '', milestone: '', learn: '', build: '' }))
  );
  const [form, setForm] = useState({
    tagline: '',
    idealFor: '',
    difficultyToBreakIn: 'Medium',
    bestFitTraits: '',
    salaryMin: '',
    salaryMax: '',
    salaryNote: '',
    courseTitle: '',
    courseUrl: '',
    bookTitle: '',
    bookUrl: '',
    projectIdea: '',
    communityName: '',
    communityUrl: '',
    hiringCompanies: '',
    onCampusVsOffCampus: '',
    referralTips: '',
    commonMistakes: '',
    pivotOptions: '',
    relatedPaths: '',
    foundational: '',
    intermediate: '',
    advanced: '',
    mustHaveForInterviews: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPaths = useCallback(
    () =>
      adminListCareerPaths()
        .then((r) => setPaths(r.careerPaths || []))
        .catch((e) => setError(e.message)),
    []
  );

  useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  // When a path is selected, fetch its existing detail and pre-populate the form
  const handlePathChange = async (e) => {
    const id = e.target.value;
    const path = paths.find((p) => p.id === id);
    setSelectedId(id);
    setSelectedSlug(path?.slug || '');
    setError('');
    setSuccess('');
    if (!id || !path?.slug) {
      return;
    }
    setLoadingDetail(true);
    try {
      const data = await getCareerDetail(path.slug);
      const c = data.career || {};
      const sk = c.skillTree || {};
      const res = c.resources || {};
      const ep = c.entryPoints || {};
      const rmap = c.roadmap || [];
      setRoadmap(
        [1, 2, 3, 4].map((y) => {
          const yr = rmap.find((r) => r.year === y) || {};
          return {
            year: y,
            focus: yr.focus || '',
            milestone: yr.milestone || '',
            learn: (yr.learn || []).join('\n'),
            build: (yr.build || []).join('\n'),
          };
        })
      );
      setForm({
        tagline: c.tagline || '',
        idealFor: c.snapshot?.idealFor || '',
        difficultyToBreakIn: c.snapshot?.difficultyToBreakIn || 'Medium',
        bestFitTraits: (c.snapshot?.bestFitTraits || []).join(', '),
        salaryMin: c.snapshot?.salaryRangeINR?.min || '',
        salaryMax: c.snapshot?.salaryRangeINR?.max || '',
        salaryNote: c.snapshot?.salaryRangeINR?.note || '',
        courseTitle: res.course?.title || '',
        courseUrl: res.course?.url || '',
        bookTitle: res.book?.title || '',
        bookUrl: res.book?.url || '',
        projectIdea: res.projectIdea || '',
        communityName: res.community?.name || '',
        communityUrl: res.community?.url || '',
        hiringCompanies: (ep.hiringCompanies || []).join('\n'),
        onCampusVsOffCampus: ep.onCampusVsOffCampus || '',
        referralTips: ep.referralTips || '',
        commonMistakes: (c.commonMistakes || []).join('\n'),
        pivotOptions: (c.pivotOptions || []).join(', '),
        relatedPaths: (c.relatedPaths || []).join(', '),
        foundational: (sk.foundational || []).join('\n'),
        intermediate: (sk.intermediate || []).join('\n'),
        advanced: (sk.advanced || []).join('\n'),
        mustHaveForInterviews: (sk.mustHaveForInterviews || []).join('\n'),
      });
    } catch (err) {
      setError('Could not load existing data: ' + err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const splitLines = (str) =>
    str
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  const splitComma = (str) =>
    str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setError('Select a career path first');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        tagline: form.tagline,
        snapshot: {
          salaryRangeINR: {
            min: Number(form.salaryMin) || 0,
            max: Number(form.salaryMax) || 0,
            note: form.salaryNote,
          },
          difficultyToBreakIn: form.difficultyToBreakIn,
          bestFitTraits: splitComma(form.bestFitTraits),
          idealFor: form.idealFor,
        },
        roadmap: roadmap.map((r) => ({
          year: r.year,
          focus: r.focus,
          milestone: r.milestone,
          learn: splitLines(r.learn),
          build: splitLines(r.build),
        })),
        skillTree: {
          foundational: splitLines(form.foundational),
          intermediate: splitLines(form.intermediate),
          advanced: splitLines(form.advanced),
          mustHaveForInterviews: splitLines(form.mustHaveForInterviews),
        },
        resources: {
          course: { title: form.courseTitle, url: form.courseUrl },
          book: { title: form.bookTitle, url: form.bookUrl },
          projectIdea: form.projectIdea,
          community: { name: form.communityName, url: form.communityUrl },
        },
        entryPoints: {
          hiringCompanies: splitLines(form.hiringCompanies),
          onCampusVsOffCampus: form.onCampusVsOffCampus,
          referralTips: form.referralTips,
        },
        commonMistakes: splitLines(form.commonMistakes),
        pivotOptions: splitComma(form.pivotOptions),
        relatedPaths: splitComma(form.relatedPaths),
      };
      await adminUpdateCareerDetail(selectedId, payload);
      setSuccess('Saved successfully! Changes are live on the career detail page.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-xs font-semibold text-blue-700">
          Select a career path below to edit its public detail page (tagline, salary, roadmap
          skills, resources, etc.)
        </p>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-700 font-semibold">
          {success}
        </p>
      )}

      <div className="flex items-center gap-3">
        <select value={selectedId} onChange={handlePathChange} className={inputCls + ' max-w-xs'}>
          <option value="">-- Select a career path --</option>
          {paths.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        {loadingDetail && (
          <span className="text-xs text-gray-400 animate-pulse">Loading existing data…</span>
        )}
      </div>

      {!selectedId && (
        <div className="rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-gray-400">
            Select a career path above to start editing its detail page content.
          </p>
          <p className="mt-1 text-xs text-gray-300">{paths.length} career paths available</p>
        </div>
      )}

      {selectedId && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Hero</p>
            <Field label="Tagline">
              <input
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                className={inputCls}
                placeholder="Build the systems the internet runs on"
              />
            </Field>
            <Field label="Ideal For">
              <input
                value={form.idealFor}
                onChange={(e) => setForm((f) => ({ ...f, idealFor: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Min Salary (INR)">
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Max Salary (INR)">
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Salary Note">
                <input
                  value={form.salaryNote}
                  onChange={(e) => setForm((f) => ({ ...f, salaryNote: e.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Difficulty to Break In">
                <select
                  value={form.difficultyToBreakIn}
                  onChange={(e) => setForm((f) => ({ ...f, difficultyToBreakIn: e.target.value }))}
                  className={inputCls}
                >
                  {['Low', 'Medium', 'High'].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="Best Fit Traits (comma-separated)">
                <input
                  value={form.bestFitTraits}
                  onChange={(e) => setForm((f) => ({ ...f, bestFitTraits: e.target.value }))}
                  className={inputCls}
                  placeholder="Logical thinker, Patient debugger"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              4-Year Roadmap
            </p>
            {roadmap.map((yr, idx) => (
              <div key={yr.year} className="mb-4 rounded-lg bg-gray-50 p-4 border border-gray-100">
                <p className="font-bold text-gray-700 mb-2">Year {yr.year}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <Field label="Focus">
                    <input
                      value={yr.focus}
                      onChange={(e) => {
                        const newR = [...roadmap];
                        newR[idx].focus = e.target.value;
                        setRoadmap(newR);
                      }}
                      className={inputCls}
                      placeholder="e.g. Master the basics"
                    />
                  </Field>
                  <Field label="Milestone">
                    <input
                      value={yr.milestone}
                      onChange={(e) => {
                        const newR = [...roadmap];
                        newR[idx].milestone = e.target.value;
                        setRoadmap(newR);
                      }}
                      className={inputCls}
                      placeholder="e.g. Land your first internship"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Learn (one per line)">
                    <textarea
                      rows={3}
                      value={yr.learn}
                      onChange={(e) => {
                        const newR = [...roadmap];
                        newR[idx].learn = e.target.value;
                        setRoadmap(newR);
                      }}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Build (one per line)">
                    <textarea
                      rows={3}
                      value={yr.build}
                      onChange={(e) => {
                        const newR = [...roadmap];
                        newR[idx].build = e.target.value;
                        setRoadmap(newR);
                      }}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Skill Tree (one skill per line)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Foundational">
                <textarea
                  rows={4}
                  value={form.foundational}
                  onChange={(e) => setForm((f) => ({ ...f, foundational: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Intermediate">
                <textarea
                  rows={4}
                  value={form.intermediate}
                  onChange={(e) => setForm((f) => ({ ...f, intermediate: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Advanced">
                <textarea
                  rows={4}
                  value={form.advanced}
                  onChange={(e) => setForm((f) => ({ ...f, advanced: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Must-Have for Interviews">
                <textarea
                  rows={4}
                  value={form.mustHaveForInterviews}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mustHaveForInterviews: e.target.value }))
                  }
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Resources</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Course Title">
                <input
                  value={form.courseTitle}
                  onChange={(e) => setForm((f) => ({ ...f, courseTitle: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Course URL">
                <input
                  value={form.courseUrl}
                  onChange={(e) => setForm((f) => ({ ...f, courseUrl: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Book Title">
                <input
                  value={form.bookTitle}
                  onChange={(e) => setForm((f) => ({ ...f, bookTitle: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Book URL">
                <input
                  value={form.bookUrl}
                  onChange={(e) => setForm((f) => ({ ...f, bookUrl: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Community Name">
                <input
                  value={form.communityName}
                  onChange={(e) => setForm((f) => ({ ...f, communityName: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Community URL">
                <input
                  value={form.communityUrl}
                  onChange={(e) => setForm((f) => ({ ...f, communityUrl: e.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Project Idea">
              <textarea
                rows={2}
                value={form.projectIdea}
                onChange={(e) => setForm((f) => ({ ...f, projectIdea: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Entry Points</p>
            <Field label="Hiring Companies (one per line)">
              <textarea
                rows={4}
                value={form.hiringCompanies}
                onChange={(e) => setForm((f) => ({ ...f, hiringCompanies: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="On-Campus vs Off-Campus guidance">
              <textarea
                rows={3}
                value={form.onCampusVsOffCampus}
                onChange={(e) => setForm((f) => ({ ...f, onCampusVsOffCampus: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Referral Tips">
              <textarea
                rows={3}
                value={form.referralTips}
                onChange={(e) => setForm((f) => ({ ...f, referralTips: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Common Mistakes (one per line)
            </p>
            <Field label="Mistakes">
              <textarea
                rows={5}
                value={form.commonMistakes}
                onChange={(e) => setForm((f) => ({ ...f, commonMistakes: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Navigation & Related
            </p>
            <Field label="Pivot Options (comma-separated slugs)">
              <input
                value={form.pivotOptions}
                onChange={(e) => setForm((f) => ({ ...f, pivotOptions: e.target.value }))}
                className={inputCls}
                placeholder="data-science, cloud-and-devops"
              />
            </Field>
            <Field label="Related Paths (comma-separated slugs)">
              <input
                value={form.relatedPaths}
                onChange={(e) => setForm((f) => ({ ...f, relatedPaths: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#FF6B2B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7a42] disabled:opacity-60 transition"
            >
              {saving ? 'Saving…' : 'Save Career Content'}
            </button>
            {success && (
              <a
                href={`/careers/${selectedSlug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Preview page →
              </a>
            )}
          </div>
        </form>
      )}
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
              subTab === t
                ? 'bg-[#0B0F2E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {subTab === 'Pillars' && <PillarsPanel />}
      {subTab === 'Pillar Content Items' && <ItemsPanel />}
      {subTab === 'Career Paths' && <CareerPathsPanel />}
      {subTab === 'Career Path Items' && <CareerPathItemsPanel />}
      {subTab === 'Career Path Content' && <CareerPathContentPanel />}
      {subTab === 'FAQ Videos' && <FaqVideosPanel />}
    </div>
  );
}
