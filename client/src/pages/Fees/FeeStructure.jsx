import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Loader from "../../components/common/Loader.jsx";
import Modal from "../../components/common/Modal.jsx";
import { feeService } from "../../services/feeService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiPlus, FiEdit, FiTrash2, FiFileText, FiX, FiDollarSign, FiCalendar, FiBook, FiUsers } from "react-icons/fi";

// ─── Options ────────────────────────────────────────────────────────────
const FEE_CATEGORIES = [
  { value: "Admission Fee",    label: "Admission Fee" },
  { value: "Tuition Fee",      label: "Tuition Fee" },
  { value: "Exam Fee",         label: "Exam Fee" },
  { value: "Library Fee",      label: "Library Fee" },
  { value: "Hostel Fee",       label: "Hostel Fee" },
  { value: "Transport Fee",    label: "Transport Fee" },
  { value: "Uniform Fee",      label: "Uniform Fee" },
  { value: "Fine",             label: "Fine" },
  { value: "Miscellaneous Fee",label: "Miscellaneous Fee" },
];

const CLASSES = [
  { value: "Class 10",   label: "Class 10" },
  { value: "Class 11",   label: "Class 11" },
  { value: "Class 12",   label: "Class 12" },
  { value: "FY B.Sc",    label: "FY B.Sc" },
  { value: "SY B.Sc",    label: "SY B.Sc" },
  { value: "TY B.Sc",    label: "TY B.Sc" },
  { value: "FY B.E",     label: "FY B.E" },
  { value: "SY B.E",     label: "SY B.E" },
  { value: "TY B.E",     label: "TY B.E" },
  { value: "Final Year", label: "Final Year" },
];

const SEMESTERS = [
  { value: "Semester 1", label: "Semester 1" },
  { value: "Semester 2", label: "Semester 2" },
  { value: "Semester 3", label: "Semester 3" },
  { value: "Semester 4", label: "Semester 4" },
  { value: "Semester 5", label: "Semester 5" },
  { value: "Semester 6", label: "Semester 6" },
  { value: "Semester 7", label: "Semester 7" },
  { value: "Semester 8", label: "Semester 8" },
];

const CATEGORY_COLORS = {
  "Admission Fee":    { bg: "#eef2ff", color: "#6366f1", icon: "🎓" },
  "Tuition Fee":      { bg: "#eff6ff", color: "#3b82f6", icon: "📚" },
  "Exam Fee":         { bg: "#fff7ed", color: "#f97316", icon: "📝" },
  "Library Fee":      { bg: "#f0fdf4", color: "#22c55e", icon: "📖" },
  "Hostel Fee":       { bg: "#fdf4ff", color: "#a855f7", icon: "🏠" },
  "Transport Fee":    { bg: "#fff1f2", color: "#f43f5e", icon: "🚌" },
  "Uniform Fee":      { bg: "#f0fdfa", color: "#14b8a6", icon: "👕" },
  "Fine":             { bg: "#fef9c3", color: "#eab308", icon: "⚠️" },
  "Miscellaneous Fee":{ bg: "#f9fafb", color: "#6b7280", icon: "📋" },
};

const EMPTY_FORM = {
  class: "Class 10",
  semester: "Semester 1",
  academicYear: "2026-2027",
  feeCategory: "Tuition Fee",
  amount: "",
  dueDate: "",
  lateFine: "0",
  description: "",
};

// ─── Fee Template Preview Card ───────────────────────────────────────────
const FeeTemplatePreview = ({ data }) => {
  const catStyle = CATEGORY_COLORS[data.feeCategory] || CATEGORY_COLORS["Miscellaneous Fee"];
  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1d30 0%, #131526 100%)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      overflow: "hidden",
      marginBottom: "24px",
    }}>
      {/* Header bar */}
      <div style={{
        background: `linear-gradient(135deg, #6c63ff, #00d4aa)`,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <span style={{ fontSize: "28px" }}>{catStyle.icon}</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>Fee Template Preview</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>This is how the template will be saved</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {[
          { icon: <FiUsers size={14}/>, label: "Class", value: data.class || "—" },
          { icon: <FiBook size={14}/>, label: "Semester", value: data.semester || "—" },
          { icon: <FiCalendar size={14}/>, label: "Academic Year", value: data.academicYear || "—" },
          { icon: <FiFileText size={14}/>, label: "Category", value: data.feeCategory || "—" },
          { icon: <FiDollarSign size={14}/>, label: "Amount", value: data.amount ? `₹${Number(data.amount).toLocaleString("en-IN")}` : "—" },
          { icon: <FiCalendar size={14}/>, label: "Due Date", value: data.dueDate ? new Date(data.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
          { icon: <FiDollarSign size={14}/>, label: "Late Fine", value: data.lateFine && data.lateFine !== "0" ? `₹${Number(data.lateFine).toLocaleString("en-IN")}` : "None" },
        ].map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
              {item.icon} {item.label}
            </div>
            <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px" }}>{item.value}</div>
          </div>
        ))}
        {data.description && (
          <div style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 14px" }}>
            <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>📝 Description</div>
            <div style={{ color: "#e2e8f0", fontSize: "13px" }}>{data.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────
export const FeeStructure = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingId, setEditingId]         = useState(null);
  const [submitting, setSubmitting]       = useState(false);
  const [showPreview, setShowPreview]     = useState(false);
  const [formData, setFormData]           = useState(EMPTY_FORM);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchStructures = async () => {
    try {
      setLoading(true);
      const res = await feeService.getAllFees();
      setFeeStructures(res.fees || []);
    } catch (err) {
      toast.error(err.message || "Failed to load fee structures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStructures(); }, []);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowPreview(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (structure) => {
    setEditingId(structure._id);
    setFormData({
      class:        structure.class,
      semester:     structure.semester,
      academicYear: structure.academicYear,
      feeCategory:  structure.feeCategory,
      amount:       structure.amount?.toString() || "",
      dueDate:      structure.dueDate ? structure.dueDate.split("T")[0] : "",
      lateFine:     structure.lateFine != null ? structure.lateFine.toString() : "0",
      description:  structure.description || "",
    });
    setShowPreview(false);
    setModalOpen(true);
  };

  // ✅ Fixed: uses updateFeeStructure (PUT /api/fees/:id) for edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount:   Number(formData.amount),
        lateFine: Number(formData.lateFine || 0),
      };

      if (editingId) {
        await feeService.updateFeeStructure(editingId, payload);
        toast.success("Fee template updated successfully!");
      } else {
        const res = await feeService.createFee(payload);
        const count = res.assignedStudentsCount ?? 0;
        toast.success(`Fee template created & assigned to ${count} student(s)!`);
      }
      setModalOpen(false);
      fetchStructures();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fee template? All PENDING student ledgers linked to it will also be removed.")) return;
    try {
      await feeService.deleteFee(id);
      toast.success("Fee template deleted successfully");
      fetchStructures();
    } catch (err) {
      toast.error(err.message || "Failed to delete fee template");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  const catStyle = CATEGORY_COLORS[formData.feeCategory] || CATEGORY_COLORS["Miscellaneous Fee"];

  return (
    <div>
      <Header
        title="Fee Templates & Structures"
        subtitle="Configure master billing templates. New templates automatically create pending invoices for matching students."
        actions={
          <Button variant="primary" onClick={handleOpenCreate}>
            <FiPlus /> Create Fee Template
          </Button>
        }
      />

      {/* Summary stat cards */}
      {!loading && feeStructures.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "24px 0 8px" }}>
          {[
            { label: "Total Templates", value: feeStructures.length, color: "#6c63ff", icon: "📋" },
            { label: "Total Billed",    value: formatCurrency(feeStructures.reduce((s, f) => s + (f.amount || 0), 0)), color: "#00d4aa", icon: "💰" },
            { label: "Categories",      value: new Set(feeStructures.map((f) => f.feeCategory)).size, color: "#f59e0b", icon: "🏷️" },
            { label: "Classes Covered", value: new Set(feeStructures.map((f) => f.class)).size, color: "#38bdf8", icon: "🎓" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: "1", minWidth: "160px",
              background: "var(--card-bg, #1a1d30)",
              border: `1px solid ${s.color}33`,
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex", alignItems: "center", gap: "14px",
            }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${s.color}22`, display: "grid", placeItems: "center", fontSize: "20px", flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)", fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="card mt-4">
          <Table
            headers={["Category", "Class", "Semester", "Academic Year", "Amount", "Late Fine", "Due Date", "Actions"]}
            data={feeStructures}
            renderRow={(structure) => {
              const cs = CATEGORY_COLORS[structure.feeCategory] || CATEGORY_COLORS["Miscellaneous Fee"];
              return (
                <tr key={structure._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{cs.icon}</span>
                      <span style={{
                        background: cs.bg,
                        color: cs.color,
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}>
                        {structure.feeCategory}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{structure.class}</td>
                  <td style={{ color: "var(--text-muted, #94a3b8)" }}>{structure.semester}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "13px" }}>{structure.academicYear}</td>
                  <td style={{ fontWeight: 700, color: "#6c63ff", fontSize: "15px" }}>
                    {formatCurrency(structure.amount)}
                  </td>
                  <td style={{ color: structure.lateFine > 0 ? "#ef4444" : "var(--text-muted, #94a3b8)", fontWeight: structure.lateFine > 0 ? 600 : 400 }}>
                    {structure.lateFine > 0 ? formatCurrency(structure.lateFine) : "—"}
                  </td>
                  <td style={{ color: "var(--text-muted, #94a3b8)", fontSize: "13px" }}>
                    {formatDate(structure.dueDate)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "5px" }}
                        onClick={() => handleOpenEdit(structure)}
                      >
                        <FiEdit size={13} /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "5px" }}
                        onClick={() => handleDelete(structure._id)}
                      >
                        <FiTrash2 size={13} /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            }}
            emptyMessage="No fee templates configured yet. Click 'Create Fee Template' to get started."
          />
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ─────────────────────────────────────────── */}
      {modalOpen && (
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "22px" }}>{catStyle.icon}</span>
              <span>{editingId ? "Edit Fee Template" : "Create New Fee Template"}</span>
            </div>
          }
          onClose={() => setModalOpen(false)}
        >
          {/* Live Preview Toggle */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "20px",
                border: "1px solid rgba(108,99,255,0.4)",
                background: showPreview ? "rgba(108,99,255,0.15)" : "transparent",
                color: "#6c63ff", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}
            >
              <FiFileText size={12} />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {/* Live preview section */}
          {showPreview && <FeeTemplatePreview data={formData} />}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1 — Class & Semester */}
            <div className="grid grid-cols-2 gap-4">
              <Dropdown
                label="Target Class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                options={CLASSES}
                required
              />
              <Dropdown
                label="Semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                options={SEMESTERS}
                required
              />
            </div>

            {/* Row 2 — Academic Year & Category */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Academic Year"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                placeholder="e.g. 2026-2027"
              />
              <Dropdown
                label="Fee Category"
                name="feeCategory"
                value={formData.feeCategory}
                onChange={handleChange}
                options={FEE_CATEGORIES}
                required
              />
            </div>

            {/* Row 3 — Amount & Late Fine */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (₹)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter amount in ₹"
              />
              <Input
                label="Late Fine (₹)"
                name="lateFine"
                type="number"
                value={formData.lateFine}
                onChange={handleChange}
                min="0"
                placeholder="0 = No late fine"
              />
            </div>

            {/* Row 4 — Due Date */}
            <Input
              label="Payment Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />

            {/* Row 5 — Description */}
            <div>
              <label className="label" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Description / Remarks
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                style={{
                  width: "100%",
                  height: "80px",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm, 6px)",
                  border: "1px solid var(--border, rgba(255,255,255,0.1))",
                  background: "var(--input-bg, rgba(255,255,255,0.05))",
                  color: "var(--text, #e2e8f0)",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                placeholder="Optional: discount notes, eligibility criteria, or payment instructions..."
              />
            </div>

            {/* Info note for create */}
            {!editingId && (
              <div style={{
                background: "rgba(108,99,255,0.1)",
                border: "1px solid rgba(108,99,255,0.25)",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "13px",
                color: "#a5b4fc",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>ℹ️</span>
                <span>
                  Saving this template will automatically create <strong>pending payment invoices</strong> for all
                  Active students currently enrolled in <strong>{formData.class} / {formData.semester}</strong>.
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 justify-end mt-6">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting
                  ? "Saving…"
                  : editingId
                  ? "Save Changes"
                  : "✓ Create & Assign to Students"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeeStructure;
