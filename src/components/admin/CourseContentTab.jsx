import React, { useState, useEffect, useCallback } from 'react';
import {
  adminListCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminListModules,
  adminCreateModule,
  adminUpdateModule,
  adminDeleteModule,
  adminListCourseItems,
  adminCreateCourseItem,
  adminUpdateCourseItem,
  adminDeleteCourseItem,
} from '../../utils/api';
import { Trash2, Edit, Plus, GripVertical, AlertTriangle } from 'lucide-react';

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#FF6B2B] focus:outline-none focus:ring-1 focus:ring-[#FF6B2B]';

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}

// ─── Courses Tab ─────────────────────────────────────────────────────────────
function CoursesPanel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    price: 999,
    isActive: true,
    order: 0,
  });
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminListCourses()
      .then((r) => setCourses(r.courses || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (form.id) {
        await adminUpdateCourse(form.id, form);
      } else {
        await adminCreateCourse(form);
      }
      setForm({
        id: '',
        title: '',
        slug: '',
        description: '',
        price: 999,
        isActive: true,
        order: 0,
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (c) => setForm({ ...c, id: c.id });
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This deletes all modules and items inside it.'))
      return;
    try {
      await adminDeleteCourse(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
      >
        <h3 className="font-bold text-gray-800">{form.id ? 'Edit Course' : 'Create New Course'}</h3>
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={inputCls}
              placeholder="e.g. jee-crash-course"
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Price (INR)">
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Order">
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Is Active">
            <select
              value={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === 'true' }))}
              className={inputCls}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          {form.id && (
            <button
              type="button"
              onClick={() =>
                setForm({
                  id: '',
                  title: '',
                  slug: '',
                  description: '',
                  price: 999,
                  isActive: true,
                  order: 0,
                })
              }
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-[#0B0F2E] px-5 py-2 text-sm font-bold text-white hover:bg-[#0B0F2E]/90"
          >
            {form.id ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">{c.order}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {c.title} <span className="text-gray-400 font-normal">/{c.slug}</span>
                </td>
                <td className="px-4 py-3">₹{c.price}</td>
                <td className="px-4 py-3">{c.isActive ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleEdit(c)}
                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No courses yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Modules Panel ─────────────────────────────────────────────────────────────
function ModulesPanel({ courses }) {
  const [courseId, setCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ id: '', title: '', order: 0, isFreePreview: false });
  const [error, setError] = useState('');

  const load = useCallback((cid) => {
    if (!cid) {
      setModules([]);
      return;
    }
    setLoading(true);
    adminListModules(cid)
      .then((r) => setModules(r.modules || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !courseId) {
      setCourseId(courses[0].id);
      load(courses[0].id);
    }
  }, [courses, courseId, load]);

  const handleCourseChange = (e) => {
    setCourseId(e.target.value);
    load(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (form.id) {
        await adminUpdateModule(form.id, form);
      } else {
        await adminCreateModule({ ...form, courseId });
      }
      setForm({ id: '', title: '', order: modules.length + 1, isFreePreview: false });
      load(courseId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (m) => setForm({ ...m, id: m.id });
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this module? This deletes all items inside it.')) return;
    try {
      await adminDeleteModule(id);
      load(courseId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <label className="text-sm font-bold text-blue-900 mr-3">Select Course:</label>
        <select value={courseId} onChange={handleCourseChange} className={inputCls + ' max-w-sm'}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {courseId && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-gray-800">
            {form.id ? 'Edit Module' : 'Create New Module'}
          </h3>
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={inputCls}
                placeholder="e.g. Module 1: Introduction"
              />
            </Field>
            <Field label="Order">
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Is Free Preview (Unlocked)">
              <select
                value={form.isFreePreview}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isFreePreview: e.target.value === 'true' }))
                }
                className={inputCls}
              >
                <option value="false">No (Locked)</option>
                <option value="true">Yes (Unlocked)</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            {form.id && (
              <button
                type="button"
                onClick={() =>
                  setForm({ id: '', title: '', order: modules.length, isFreePreview: false })
                }
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="rounded-lg bg-[#0B0F2E] px-5 py-2 text-sm font-bold text-white hover:bg-[#0B0F2E]/90"
            >
              {form.id ? 'Update Module' : 'Create Module'}
            </button>
          </div>
        </form>
      )}

      {courseId && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Free Preview?</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {modules.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-500">{m.order}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{m.title}</td>
                  <td className="px-4 py-3">
                    {m.isFreePreview ? (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                        Yes
                      </span>
                    ) : (
                      'No'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(m)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {modules.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    No modules in this course yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Items Panel ─────────────────────────────────────────────────────────────
function ItemsPanel({ courses }) {
  const [courseId, setCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: '',
    title: '',
    type: 'video',
    url: '',
    durationLabel: '',
    order: 0,
  });
  const [error, setError] = useState('');

  // Load modules when course changes
  useEffect(() => {
    if (courses.length > 0 && !courseId) {
      setCourseId(courses[0].id);
    }
  }, [courses, courseId]);

  useEffect(() => {
    if (courseId) {
      adminListModules(courseId).then((r) => {
        setModules(r.modules || []);
        if (r.modules?.length > 0) {
          setModuleId(r.modules[0].id);
        } else {
          setModuleId('');
          setItems([]);
        }
      });
    }
  }, [courseId]);

  const loadItems = useCallback((mid) => {
    if (!mid) {
      setItems([]);
      return;
    }
    setLoading(true);
    adminListCourseItems(mid)
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (moduleId) loadItems(moduleId);
  }, [moduleId, loadItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (form.id) {
        await adminUpdateCourseItem(form.id, form);
      } else {
        await adminCreateCourseItem({ ...form, moduleId });
      }
      setForm({
        id: '',
        title: '',
        type: 'video',
        url: '',
        durationLabel: '',
        order: items.length + 1,
      });
      loadItems(moduleId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (i) => setForm({ ...i, id: i.id });
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await adminDeleteCourseItem(id);
      loadItems(moduleId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-blue-900">Select Course:</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={inputCls}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-blue-900">Select Module:</label>
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className={inputCls}
          >
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
            {modules.length === 0 && <option value="">No modules found</option>}
          </select>
        </div>
      </div>

      {moduleId && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-gray-800">{form.id ? 'Edit Item' : 'Create New Item'}</h3>
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={inputCls}
                placeholder="e.g. Introduction to Physics"
              />
            </Field>
            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className={inputCls}
              >
                <option value="video">Video</option>
                <option value="document">Document (PDF/Link)</option>
                <option value="article">Article</option>
              </select>
            </Field>
          </div>
          <Field label="URL (YouTube/Drive/Article Link)">
            <input
              required
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Duration Label (optional)">
              <input
                value={form.durationLabel}
                onChange={(e) => setForm((f) => ({ ...f, durationLabel: e.target.value }))}
                className={inputCls}
                placeholder="e.g. 15 mins"
              />
            </Field>
            <Field label="Order">
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2">
            {form.id && (
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id: '',
                    title: '',
                    type: 'video',
                    url: '',
                    durationLabel: '',
                    order: items.length,
                  })
                }
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="rounded-lg bg-[#0B0F2E] px-5 py-2 text-sm font-bold text-white hover:bg-[#0B0F2E]/90"
            >
              {form.id ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      )}

      {moduleId && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-500">{i.order}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{i.title}</td>
                  <td className="px-4 py-3 capitalize">{i.type}</td>
                  <td className="px-4 py-3">
                    <a
                      href={i.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline truncate inline-block max-w-[200px]"
                    >
                      {i.url}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(i)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No items in this module yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Tab Component ──────────────────────────────────────────────────────
export default function CourseContentTab() {
  const [activeSubTab, setActiveSubTab] = useState('courses');
  const [courses, setCourses] = useState([]);

  // Fetch courses once at the top level so Modules & Items tabs can use them
  useEffect(() => {
    adminListCourses()
      .then((r) => setCourses(r.courses || []))
      .catch(() => {});
  }, [activeSubTab]); // Re-fetch occasionally

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Courses Management</h2>
      </div>

      <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
        Manage the courses offered on the landing page. Create a course first, then add modules
        (which can be locked or unlocked for free preview), and finally add the actual
        video/document items into the modules.
      </p>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {[
          { id: 'courses', label: '1. Courses' },
          { id: 'modules', label: '2. Modules' },
          { id: 'items', label: '3. Items (Videos/Docs)' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeSubTab === t.id
                ? 'bg-[#0B0F2E] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {activeSubTab === 'courses' && <CoursesPanel />}
        {activeSubTab === 'modules' && <ModulesPanel courses={courses} />}
        {activeSubTab === 'items' && <ItemsPanel courses={courses} />}
      </div>
    </div>
  );
}
