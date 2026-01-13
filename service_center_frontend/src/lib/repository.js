import { supabase, isSupabaseConfigured } from "./supabaseClient";

const LS_TECHS = "mrsp_service_technicians_v1";
const LS_PARTS = "mrsp_service_spare_parts_v1";
const LS_JOBS = "mrsp_service_jobs_v1"; // derived from repair_requests for preview

function readLocal(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId() {
  return `local_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

// -------------------- Technicians --------------------

// PUBLIC_INTERFACE
export async function listTechnicians() {
  /** List technicians. */
  if (!isSupabaseConfigured) {
    const items = readLocal(LS_TECHS, []);
    if (items.length === 0) {
      const seed = [
        { id: makeId(), created_at: new Date().toISOString(), name: "Ava Chen", skill_level: "Senior", active: true },
        { id: makeId(), created_at: new Date().toISOString(), name: "Noah Patel", skill_level: "Mid", active: true },
      ];
      writeLocal(LS_TECHS, seed);
      return seed;
    }
    return items;
  }

  const { data, error } = await supabase.from("technicians").select("*").order("created_at", { ascending: false });
  if (error) return readLocal(LS_TECHS, []);
  return data ?? [];
}

// PUBLIC_INTERFACE
export async function createTechnician(payload) {
  /** Create a technician. */
  const created = { id: makeId(), created_at: new Date().toISOString(), active: true, ...payload };

  if (!isSupabaseConfigured) {
    const items = readLocal(LS_TECHS, []);
    items.unshift(created);
    writeLocal(LS_TECHS, items);
    return created;
  }

  const { data, error } = await supabase
    .from("technicians")
    .insert([{ name: payload.name, skill_level: payload.skill_level, active: payload.active ?? true }])
    .select("*")
    .single();

  if (error) {
    const items = readLocal(LS_TECHS, []);
    items.unshift(created);
    writeLocal(LS_TECHS, items);
    return created;
  }
  return data;
}

// -------------------- Spare Parts --------------------

// PUBLIC_INTERFACE
export async function listSpareParts() {
  /** List spare parts inventory. */
  if (!isSupabaseConfigured) {
    const items = readLocal(LS_PARTS, []);
    if (items.length === 0) {
      const seed = [
        { id: makeId(), created_at: new Date().toISOString(), part_name: "iPhone Screen", sku: "IP-SCR-01", stock_qty: 6, unit_price: 79 },
        { id: makeId(), created_at: new Date().toISOString(), part_name: "USB-C Port", sku: "USBC-PRT-02", stock_qty: 14, unit_price: 19 },
      ];
      writeLocal(LS_PARTS, seed);
      return seed;
    }
    return items;
  }

  const { data, error } = await supabase.from("spare_parts").select("*").order("created_at", { ascending: false });
  if (error) return readLocal(LS_PARTS, []);
  return data ?? [];
}

// PUBLIC_INTERFACE
export async function upsertSparePart(payload) {
  /** Create or update a spare part item. */
  const item = {
    id: payload.id ?? makeId(),
    created_at: payload.created_at ?? new Date().toISOString(),
    part_name: payload.part_name,
    sku: payload.sku,
    stock_qty: Number(payload.stock_qty || 0),
    unit_price: Number(payload.unit_price || 0),
  };

  if (!isSupabaseConfigured) {
    const items = readLocal(LS_PARTS, []);
    const idx = items.findIndex((p) => p.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.unshift(item);
    writeLocal(LS_PARTS, items);
    return item;
  }

  const { data, error } = await supabase
    .from("spare_parts")
    .upsert([item])
    .select("*")
    .single();

  if (error) return item;
  return data;
}

// -------------------- Jobs (Repair Requests) --------------------

// PUBLIC_INTERFACE
export async function listJobs() {
  /** List jobs derived from repair requests. */
  if (!isSupabaseConfigured) {
    // For preview, reuse the customer portal localStorage key if present.
    const customerRequests = readLocal("mrsp_customer_repair_requests_v1", []);
    const jobs = customerRequests.map((r) => ({
      id: r.id,
      created_at: r.created_at,
      customer_name: r.customer_name,
      phone: r.phone,
      device_type: r.device_type,
      issue: r.issue,
      address: r.address,
      preferred_time: r.preferred_time,
      status: r.status || "Requested",
      assigned_technician: r.assigned_technician || null,
      bill_total: r.bill_total || null,
    }));
    writeLocal(LS_JOBS, jobs);
    return jobs;
  }

  const { data, error } = await supabase.from("repair_requests").select("*").order("created_at", { ascending: false });
  if (error) return readLocal(LS_JOBS, []);
  return data ?? [];
}

// PUBLIC_INTERFACE
export async function updateJobStatus(jobId, status) {
  /** Update job status. */
  if (!isSupabaseConfigured) {
    const customerRequests = readLocal("mrsp_customer_repair_requests_v1", []);
    const idx = customerRequests.findIndex((r) => r.id === jobId);
    if (idx >= 0) {
      customerRequests[idx] = { ...customerRequests[idx], status };
      writeLocal("mrsp_customer_repair_requests_v1", customerRequests);
    }
    return true;
  }

  const { error } = await supabase.from("repair_requests").update({ status }).eq("id", jobId);
  return !error;
}

// PUBLIC_INTERFACE
export async function createInvoice(jobId, amount) {
  /** Create/update an invoice total for a job (minimal billing). */
  const numeric = Number(amount || 0);

  if (!isSupabaseConfigured) {
    const customerRequests = readLocal("mrsp_customer_repair_requests_v1", []);
    const idx = customerRequests.findIndex((r) => r.id === jobId);
    if (idx >= 0) {
      customerRequests[idx] = { ...customerRequests[idx], bill_total: numeric };
      writeLocal("mrsp_customer_repair_requests_v1", customerRequests);
    }
    return true;
  }

  const { error } = await supabase.from("repair_requests").update({ bill_total: numeric }).eq("id", jobId);
  return !error;
}
