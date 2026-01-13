import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { listJobs, listTechnicians, listSpareParts } from "../lib/repository";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [techs, setTechs] = useState([]);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const [j, t, p] = await Promise.all([listJobs(), listTechnicians(), listSpareParts()]);
      if (mounted) {
        setJobs(j);
        setTechs(t);
        setParts(p);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const activeJobs = jobs.filter((j) => (j.status || "").toLowerCase() !== "completed").length;
    const activeTechs = techs.filter((t) => t.active).length;
    const lowStock = parts.filter((p) => Number(p.stock_qty || 0) <= 3).length;
    return { activeJobs, activeTechs, lowStock };
  }, [jobs, techs, parts]);

  return (
    <div className="page">
      <div className="pageHead">
        <h1 className="h2">Overview</h1>
        <p className="muted">
          Operations snapshot and quick links. Data mode: <strong>{isSupabaseConfigured ? "Supabase" : "Local preview"}</strong>
        </p>
      </div>

      <div className="grid grid--3">
        <div className="card card--soft">
          <div className="card__title">Active jobs</div>
          {loading ? <div className="skeleton" style={{ height: 70 }} /> : <div className="metric">{metrics.activeJobs}</div>}
          <Link className="btn btn--small btn--ghost" to="/jobs">
            Manage jobs
          </Link>
        </div>

        <div className="card card--border">
          <div className="card__title">Active technicians</div>
          {loading ? <div className="skeleton" style={{ height: 70 }} /> : <div className="metric">{metrics.activeTechs}</div>}
          <Link className="btn btn--small btn--ghost" to="/technicians">
            View technicians
          </Link>
        </div>

        <div className="card card--border">
          <div className="card__title">Low stock parts</div>
          {loading ? <div className="skeleton" style={{ height: 70 }} /> : <div className="metric">{metrics.lowStock}</div>}
          <Link className="btn btn--small btn--ghost" to="/spare-parts">
            Inventory
          </Link>
        </div>
      </div>

      <div className="card card--border" style={{ marginTop: 14 }}>
        <div className="card__title">Most recent job</div>
        {loading ? (
          <div className="skeleton" style={{ height: 90 }} />
        ) : jobs[0] ? (
          <div className="row">
            <div>
              <div className="row__title">{jobs[0].device_type || "Device"} • {jobs[0].customer_name || "Customer"}</div>
              <div className="muted">{jobs[0].issue || "—"}</div>
            </div>
            <Link className="btn btn--small btn--primary" to="/jobs">
              Open Jobs
            </Link>
          </div>
        ) : (
          <div className="muted">No jobs yet. Create a request from the customer portal to see it here.</div>
        )}
      </div>
    </div>
  );
}
