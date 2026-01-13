import React, { useEffect, useState } from "react";
import { createInvoice, listJobs, updateJobStatus } from "../lib/repository";

const STATUSES = ["Requested", "Assigned", "In Progress", "Completed"];

function StatusPill({ status }) {
  const normalized = (status || "Unknown").toLowerCase();
  const cls =
    normalized.includes("complete")
      ? "pill pill--success"
      : normalized.includes("progress") || normalized.includes("assigned")
        ? "pill pill--info"
        : "pill pill--warn";
  return <span className={cls}>{status || "Unknown"}</span>;
}

export default function Jobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const refresh = async () => {
    setLoading(true);
    const data = await listJobs();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStatusChange = async (jobId, status) => {
    await updateJobStatus(jobId, status);
    await refresh();
  };

  const onInvoice = async (jobId) => {
    const amount = window.prompt("Enter invoice total (number):", "99");
    if (amount === null) return;
    await createInvoice(jobId, amount);
    await refresh();
  };

  return (
    <div className="page">
      <div className="pageHead">
        <h1 className="h2">Jobs</h1>
        <p className="muted">Manage repair requests, update status, and create a basic invoice total.</p>
      </div>

      <div className="card card--border">
        {loading ? (
          <div className="skeleton" style={{ height: 260 }} />
        ) : jobs.length === 0 ? (
          <div className="empty">
            <div className="empty__title">No jobs available</div>
            <div className="muted">Jobs appear once customers submit repair requests.</div>
          </div>
        ) : (
          <div className="table table--jobs">
            <div className="table__head">
              <div>Job</div>
              <div>Status</div>
              <div className="hideSm">Preferred</div>
              <div style={{ textAlign: "right" }}>Actions</div>
            </div>
            {jobs.map((j) => (
              <div className="table__row" key={j.id}>
                <div>
                  <div className="row__title">{j.device_type || "Device"} • {j.customer_name || "Customer"}</div>
                  <div className="muted small">{j.issue || "—"}</div>
                  {j.bill_total != null ? <div className="muted small">Invoice: ${Number(j.bill_total).toFixed(2)}</div> : null}
                </div>

                <div>
                  <StatusPill status={j.status} />
                  <div style={{ marginTop: 8 }}>
                    <select
                      className="input input--compact"
                      value={j.status || "Requested"}
                      onChange={(e) => onStatusChange(j.id, e.target.value)}
                      aria-label="Change job status"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hideSm">{j.preferred_time || "—"}</div>

                <div style={{ textAlign: "right", display: "grid", gap: 8, justifyItems: "end" }}>
                  <button className="btn btn--small btn--ghost" onClick={() => onInvoice(j.id)} type="button">
                    Create Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
