import React, { useEffect, useMemo, useState } from "react";
import { createTechnician, listTechnicians } from "../lib/repository";

const SKILLS = ["Junior", "Mid", "Senior"];

export default function Technicians() {
  const [loading, setLoading] = useState(true);
  const [techs, setTechs] = useState([]);
  const [form, setForm] = useState({ name: "", skill_level: "Mid", active: true });
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const data = await listTechnicians();
    setTechs(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSave = useMemo(() => form.name.trim().length >= 2, [form.name]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await createTechnician(form);
      setForm({ name: "", skill_level: "Mid", active: true });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="pageHead">
        <h1 className="h2">Technicians</h1>
        <p className="muted">Maintain your technician roster (minimal fields for preview).</p>
      </div>

      <div className="grid grid--2">
        <form className="card card--border form" onSubmit={onSubmit}>
          <div className="card__title">Add technician</div>
          <label className="field">
            <span className="field__label">Name</span>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Technician name"
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Skill level</span>
            <select
              className="input"
              value={form.skill_level}
              onChange={(e) => setForm((s) => ({ ...s, skill_level: e.target.value }))}
            >
              {SKILLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="field" style={{ gridAutoFlow: "column", alignItems: "center", justifyContent: "start" }}>
            <span className="field__label" style={{ marginRight: 10 }}>
              Active
            </span>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))}
            />
          </label>

          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={!canSave || saving}>
              {saving ? "Saving…" : "Add"}
            </button>
            <div className="muted small">Supabase if configured, otherwise local preview.</div>
          </div>
        </form>

        <div className="card card--border">
          <div className="card__title">Roster</div>
          {loading ? (
            <div className="skeleton" style={{ height: 200 }} />
          ) : techs.length === 0 ? (
            <div className="muted">No technicians found.</div>
          ) : (
            <div className="listRows">
              {techs.map((t) => (
                <div key={t.id} className="listRow">
                  <div>
                    <div className="row__title">{t.name}</div>
                    <div className="muted small">{t.skill_level} • {t.active ? "Active" : "Inactive"}</div>
                  </div>
                  <span className={t.active ? "pill pill--success" : "pill pill--warn"}>
                    {t.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
