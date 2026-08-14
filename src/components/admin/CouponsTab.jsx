import React, { useState, useEffect, useCallback } from 'react';
import {
  adminListCoupons,
  adminCreateCoupon,
  adminUpdateCoupon,
  adminDeleteCoupon,
  adminListCommissions,
  adminUpdateCommission,
} from '../../utils/api';
import { Tag, Plus, Trash2, CheckCircle, XCircle, Clock, DollarSign, Percent, AlertCircle, X } from 'lucide-react';

export default function CouponsTab() {
  const [activeSubTab, setActiveSubTab] = useState('coupons'); // 'coupons' | 'commissions'

  // ─── Coupons State ──────────────────────────────────────────────────────────
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [couponError, setCouponError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // Form fields for new coupon
  const [formCode, setFormCode] = useState('');
  const [formReferrerId, setFormReferrerId] = useState('');
  const [formDiscountType, setFormDiscountType] = useState('FIXED_AMOUNT');
  const [formDiscountValue, setFormDiscountValue] = useState('1000');
  const [formCommissionRate, setFormCommissionRate] = useState('10');
  const [formApplicableCourses, setFormApplicableCourses] = useState('');
  const [formUsageLimit, setFormUsageLimit] = useState('');
  const [formExpiresAt, setFormExpiresAt] = useState('');
  const [formError, setFormError] = useState('');

  // ─── Commissions State ──────────────────────────────────────────────────────
  const [commissions, setCommissions] = useState([]);
  const [commissionTotal, setCommissionTotal] = useState(0);
  const [loadingCommissions, setLoadingCommissions] = useState(true);
  const [commissionError, setCommissionError] = useState('');
  const [commissionStatusFilter, setCommissionStatusFilter] = useState('');
  const [commissionPage, setCommissionPage] = useState(1);
  const commissionLimit = 25;

  const fetchCoupons = useCallback(async () => {
    setLoadingCoupons(true);
    setCouponError('');
    try {
      const res = await adminListCoupons();
      setCoupons(res.coupons || []);
    } catch (e) {
      setCouponError(e.message || 'Failed to load coupons');
    } finally {
      setLoadingCoupons(false);
    }
  }, []);

  const fetchCommissions = useCallback(async () => {
    setLoadingCommissions(true);
    setCommissionError('');
    try {
      const params = { page: commissionPage, limit: commissionLimit };
      if (commissionStatusFilter) params.status = commissionStatusFilter;
      const res = await adminListCommissions(params);
      setCommissions(res.items || []);
      setCommissionTotal(res.total || 0);
    } catch (e) {
      setCommissionError(e.message || 'Failed to load commissions');
    } finally {
      setLoadingCommissions(false);
    }
  }, [commissionPage, commissionStatusFilter]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  useEffect(() => {
    if (activeSubTab === 'commissions') {
      fetchCommissions();
    }
  }, [activeSubTab, fetchCommissions]);

  async function handleCreateCoupon(e) {
    e.preventDefault();
    setFormError('');
    setCreatingCoupon(true);

    try {
      const payload = {
        code: formCode.trim().toUpperCase(),
        discountType: formDiscountType,
        discountValue: Number(formDiscountValue),
        commissionRate: Number(formCommissionRate),
        referrerId: formReferrerId.trim() || undefined,
        applicableCourses: formApplicableCourses
          ? formApplicableCourses.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        usageLimit: formUsageLimit ? Number(formUsageLimit) : undefined,
        expiresAt: formExpiresAt ? new Date(formExpiresAt).toISOString() : undefined,
      };

      await adminCreateCoupon(payload);
      setShowCreateModal(false);
      // Reset form
      setFormCode('');
      setFormReferrerId('');
      setFormDiscountType('FIXED_AMOUNT');
      setFormDiscountValue('1000');
      setFormCommissionRate('10');
      setFormApplicableCourses('');
      setFormUsageLimit('');
      setFormExpiresAt('');
      fetchCoupons();
    } catch (err) {
      setFormError(err.message || 'Failed to create coupon');
    } finally {
      setCreatingCoupon(false);
    }
  }

  async function handleToggleActive(coupon) {
    try {
      await adminUpdateCoupon(coupon.id || coupon._id, { isActive: !coupon.isActive });
      fetchCoupons();
    } catch (e) {
      alert(e.message || 'Failed to update coupon');
    }
  }

  async function handleDeleteCoupon(id, code) {
    if (!window.confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;
    try {
      await adminDeleteCoupon(id);
      fetchCoupons();
    } catch (e) {
      alert(e.message || 'Failed to delete coupon');
    }
  }

  async function handleCommissionStatus(id, newStatus) {
    try {
      await adminUpdateCommission(id, { status: newStatus });
      fetchCommissions();
    } catch (e) {
      alert(e.message || 'Failed to update commission status');
    }
  }

  const commissionTotalPages = Math.max(Math.ceil(commissionTotal / commissionLimit), 1);

  return (
    <div className="mt-4 space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('coupons')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeSubTab === 'coupons'
                ? 'bg-[#0B0F2E] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Coupon Codes ({coupons.length})
          </button>
          <button
            onClick={() => setActiveSubTab('commissions')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeSubTab === 'commissions'
                ? 'bg-[#0B0F2E] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Referral Commissions ({commissionTotal})
          </button>
        </div>

        {activeSubTab === 'coupons' && (
          <button
            onClick={() => {
              setFormError('');
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#FF6B2B] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#e05a1f] transition"
          >
            <Plus className="h-4 w-4" /> Create Coupon
          </button>
        )}
      </div>

      {/* ─── TAB 1: COUPONS ─────────────────────────────────────────────────── */}
      {activeSubTab === 'coupons' && (
        <div>
          {couponError && <p className="text-sm text-red-600 mb-3">{couponError}</p>}
          {loadingCoupons ? (
            <p className="text-sm text-gray-400 py-6">Loading coupons…</p>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Tag className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">No coupon codes created yet.</p>
              <p className="text-xs text-gray-400 mt-1">Create your first coupon code to offer discounts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Referrer</th>
                    <th className="px-4 py-3">Commission</th>
                    <th className="px-4 py-3">Usage / Limit</th>
                    <th className="px-4 py-3">Applicable To</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {coupons.map((c) => (
                    <tr key={c.id || c._id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                            {c.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.discountType === 'PERCENTAGE' ? (
                          <span className="text-indigo-600 font-bold">{c.discountValue}% OFF</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">₹{c.discountValue} OFF</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {c.referrer ? (
                          <div>
                            <p className="font-bold text-slate-800">{c.referrer.name || 'User'}</p>
                            <p className="text-slate-400">{c.referrer.email || c.referrer.phone}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None (Global)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-amber-600">
                        {c.commissionRate || 10}%
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-bold text-slate-800">{c.usedCount || 0}</span>
                        <span className="text-slate-400"> / {c.usageLimit ? c.usageLimit : '∞'}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {c.applicableCourses && c.applicableCourses.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {c.applicableCourses.map((slug) => (
                              <span key={slug} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                {slug}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">All Courses & Plans</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteCoupon(c.id || c._id, c.code)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-md hover:bg-red-50"
                          title="Delete Coupon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: REFERRAL COMMISSIONS ────────────────────────────────────── */}
      {activeSubTab === 'commissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
              {['', 'pending', 'approved', 'paid', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setCommissionStatusFilter(st);
                    setCommissionPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition ${
                    commissionStatusFilter === st
                      ? 'bg-[#0B0F2E] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st || 'All'}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500">{commissionTotal} records found</span>
          </div>

          {commissionError && <p className="text-sm text-red-600 mb-3">{commissionError}</p>}

          {loadingCommissions ? (
            <p className="text-sm text-gray-400 py-6">Loading commissions…</p>
          ) : commissions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <DollarSign className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">No referral commissions recorded yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Commissions will automatically be recorded here after successful coupon-referred payments.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Coupon</th>
                    <th className="px-4 py-3">Referrer</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Course / Plan</th>
                    <th className="px-4 py-3">Amount Paid</th>
                    <th className="px-4 py-3">Commission</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {commissions.map((comm) => (
                    <tr key={comm.id || comm._id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded">
                          {comm.couponCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-bold text-slate-900">{comm.referrerId?.name || 'Referrer'}</p>
                        <p className="text-slate-400">{comm.referrerId?.email || comm.referrerId?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-semibold text-slate-800">{comm.customerName || '—'}</p>
                        <p className="text-slate-400">{comm.customerEmail || comm.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-medium text-slate-700">{comm.courseSlug || comm.courseId}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-bold text-slate-900">₹{comm.finalAmount?.toLocaleString('en-IN')}</span>
                        {comm.discountAmount > 0 && (
                          <p className="text-[10px] text-emerald-600">-₹{comm.discountAmount} off</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-black text-amber-600">₹{comm.commissionAmount}</span>
                        <span className="text-[10px] text-slate-400 block">({comm.commissionRate}%)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            comm.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : comm.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : comm.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {comm.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={comm.status}
                          onChange={(e) => handleCommissionStatus(comm.id || comm._id, e.target.value)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF6B2B]"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Page {commissionPage} of {commissionTotalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={commissionPage <= 1}
                onClick={() => setCommissionPage((p) => Math.max(1, p - 1))}
                className="rounded border px-3 py-1 text-xs font-semibold disabled:opacity-40 hover:bg-slate-50"
              >
                ← Prev
              </button>
              <button
                disabled={commissionPage >= commissionTotalPages}
                onClick={() => setCommissionPage((p) => p + 1)}
                className="rounded border px-3 py-1 text-xs font-semibold disabled:opacity-40 hover:bg-slate-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CREATE COUPON MODAL ────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[300000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-[#0B0F2E]">Create New Coupon</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-100 text-xs text-red-600 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                  <input
                    required
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="e.g. OLeXVNIT"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Referrer User ID (optional)</label>
                  <input
                    type="text"
                    value={formReferrerId}
                    onChange={(e) => setFormReferrerId(e.target.value)}
                    placeholder="User Mongo ObjectId"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                  >
                    <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Discount Value * ({formDiscountType === 'PERCENTAGE' ? '%' : '₹'})
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formDiscountValue}
                    onChange={(e) => setFormDiscountValue(e.target.value)}
                    placeholder={formDiscountType === 'PERCENTAGE' ? '10' : '1000'}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Commission Rate (%)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={formCommissionRate}
                    onChange={(e) => setFormCommissionRate(e.target.value)}
                    placeholder="10"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Applicable Course Slugs (comma separated, leave empty for all)
                </label>
                <input
                  type="text"
                  value={formApplicableCourses}
                  onChange={(e) => setFormApplicableCourses(e.target.value)}
                  placeholder="e.g. complete-round, college-clarity"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Usage Limit (leave blank for unlimited)</label>
                  <input
                    type="number"
                    min="1"
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date (optional)</label>
                  <input
                    type="date"
                    value={formExpiresAt}
                    onChange={(e) => setFormExpiresAt(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCoupon}
                  className="rounded-xl bg-[#FF6B2B] px-5 py-2.5 font-bold text-white hover:bg-[#e05a1f] transition disabled:opacity-50 shadow-md shadow-[#FF6B2B]/20"
                >
                  {creatingCoupon ? 'Creating…' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
