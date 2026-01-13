import React, { useEffect, useMemo, useState } from "react";
import { listJobs } from "../lib/repository";

export default function Billing() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await listJobs();
      if (mounted) {
        setJobs(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const billed = useMemo(() => jobs.filter((j) => j.bill_total != null), [jobs]);
  const total = useMemo(() => billed.reduce((acc, j) => acc + Number(j.bill_total || 0), 0), [billed]);

  return (
    <div className="page">
      <div className="pageHead">
        <h1 className="h2">Billing</h1>
        <p className="muted">Preview billing view based on invoice totals attached to jobs.</p>
      </div>

      <div className="grid grid--2">
        <div className="card card--soft">
          <div className="card__title">Billed jobs</div>
          {loading ? <div className="skeleton" style={{ height: 70 }} /> : <div className="metric">{billed.length}</div>}
          <div className="muted small">Total billed amount</div>
          {loading ? <div className="skeleton" style={{ height: 44 }} /> : <div className="metric">${total.toFixed(2)}</div>}
        </div>

        <div className="card card--border">
          <div className="card__title">Notes</div>
          <div className="muted">
            This is intentionally minimal. In production, invoices would be separate entities with line items and payment
            tracking.
          </div>
        </div>
      </div>

      <div className="card card--border" style={{ marginTop: 14 }}>
        <div className="card__title">Invoices</div>
        {loading ? (
          <div className="skeleton" style={{ height: 220 }} />
        ) : billed.length === 0 ? (
          <div className="muted">No invoices yet. Use “Create Invoice” in Jobs.</div>
        ) : (
          <div className="listRows">
            {billed.map((j) => (
              <div key={j.id} className="listRow">
                <div>
                  <div className="row__title">{j.device_type || "Device"} • {j.customer_name || "Customer"}</div>
                  <div className="muted small">Job ID: {j.id}</div>
                </div>
                <span className="pill pill--info">${Number(j.bill_total || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
