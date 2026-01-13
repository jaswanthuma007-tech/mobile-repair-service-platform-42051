import React, { useEffect, useMemo, useState } from "react";
import { listSpareParts, upsertSparePart } from "../lib/repository";

export default function SpareParts() {
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    part_name: "",
    sku: "",
    stock_qty: 0,
    unit_price: 0,
  });

  const refresh = async () => {
    setLoading(true);
    const data = await listSpareParts();
    setParts(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSave = useMemo(() => form.part_name.trim().length >= 2 && form.sku.trim().length >= 2, [form.part_name, form.sku]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await upsertSparePart(form);
      setForm({ part_name: "", sku: "", stock_qty: 0, unit_price: 0 });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="pageHead">
        <h1 className="h2">Spare parts</h1>
        <p className="muted">Track inventory and pricing (minimal implementation for previews).</p>
      </div>

      <div className="grid grid--2">
        <form className="card card--border form" onSubmit={onSubmit}>
          <div className="card__title">Add / update part</div>
          <label className="field">
            <span className="field__label">Part name</span>
            <input className="input" value={form.part_name} onChange={(e) => setForm((s) => ({ ...s, part_name: e.target.value }))} placeholder="Part name" />
          </label>
          <label className="field">
            <span className="field__label">SKU</span>
            <input className="input" value={form.sku} onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))} placeholder="SKU" />
          </label>
          <div className="grid grid--2">
            <label className="field">
              <span className="field__label">Stock qty</span>
              <input
                className="input"
                type="number"
                value={form.stock_qty}
                onChange={(e) => setForm((s) => ({ ...s, stock_qty: e.target.value }))}
              />
            </label>
            <label className="field">
              <span className="field__label">Unit price</span>
              <input
                className="input"
                type="number"
                value={form.unit_price}
                onChange={(e) => setForm((s) => ({ ...s, unit_price: e.target.value }))}
              />
            </label>
          </div>
          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={!canSave || saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <div className="muted small">Low-stock warnings appear in the list.</div>
          </div>
        </form>

        <div className="card card--border">
          <div className="card__title">Inventory</div>
          {loading ? (
            <div className="skeleton" style={{ height: 220 }} />
          ) : parts.length === 0 ? (
            <div className="muted">No parts found.</div>
          ) : (
            <div className="listRows">
              {parts.map((p) => {
                const low = Number(p.stock_qty || 0) <= 3;
                return (
                  <div key={p.id} className="listRow">
                    <div>
                      <div className="row__title">{p.part_name}</div>
                      <div className="muted small">
                        {p.sku} • ${Number(p.unit_price || 0).toFixed(2)} • Stock: {Number(p.stock_qty || 0)}
                      </div>
                    </div>
                    <span className={low ? "pill pill--warn" : "pill pill--success"}>{low ? "Low" : "OK"}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
