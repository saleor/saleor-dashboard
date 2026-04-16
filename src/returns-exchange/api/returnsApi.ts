import {
  type CXCallLog,
  type CXReturnDetail,
  type CXReturnRequest,
  type NotificationSettings,
} from "../types";

const BASE_URL = import.meta.env.VITE_TENEXU_API_URL || "https://api.tenxyou.infinitelocus.com";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("_saleor_auth_token") || "";

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function apiRequest<T>(method: string, path: string, body?: any): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();

  if (!json.ok && !res.ok) {
    throw new Error(json.message || `Request failed: ${res.status}`);
  }

  return json;
}

// ─── Returns ─────────────────────────────────────────────────────────────────

export async function fetchReturns(params: {
  status?: string;
  search?: string;
  sla_tier?: string;
  product?: string;
  return_reason?: string;
  date_from?: string;
  date_to?: string;
  last_activity_by?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: CXReturnRequest[];
  pagination: { total: number; page: number; limit: number };
}> {
  const qs = new URLSearchParams();

  if (params.status) qs.set("status", params.status);

  if (params.search) qs.set("search", params.search);

  if (params.sla_tier) qs.set("sla_tier", params.sla_tier);

  if (params.product) qs.set("product", params.product);

  if (params.return_reason) qs.set("return_reason", params.return_reason);

  if (params.date_from) qs.set("date_from", params.date_from);

  if (params.date_to) qs.set("date_to", params.date_to);

  if (params.last_activity_by) qs.set("last_activity_by", params.last_activity_by);

  if (params.page) qs.set("page", String(params.page));

  if (params.limit) qs.set("limit", String(params.limit));

  const result = await apiRequest<any>("GET", `/cx/returns?${qs.toString()}`);

  return { data: result.data, pagination: result.pagination };
}

export async function fetchReturn(requestId: string): Promise<CXReturnDetail> {
  const result = await apiRequest<any>("GET", `/cx/returns/${requestId}`);

  return result.data;
}

export async function fetchActiveCount(): Promise<number> {
  const result = await apiRequest<any>("GET", "/cx/returns/active-count");

  return result.data?.count ?? 0;
}

export async function fetchProductVariants(requestId: string): Promise<any[]> {
  const result = await apiRequest<any>("GET", `/cx/returns/${requestId}/variants`);

  return result.data || [];
}

export async function submitLogCall(
  requestId: string,
  data: {
    outcome: string;
    user_action?: string;
    notes: string;
    callback_date?: string;
    callback_time?: string;
    cx_agent_id: string;
    cx_agent_name: string;
  },
): Promise<void> {
  await apiRequest("POST", `/cx/returns/${requestId}/log-call`, data);
}

export async function submitConvertToExchange(
  requestId: string,
  data: {
    replacement_variant_id: string;
    cx_agent_id: string;
    cx_agent_name: string;
    override_reason?: string;
  },
): Promise<{ replacement_order_id: string; replacement_order_number: string }> {
  const result = await apiRequest<any>("POST", `/cx/returns/${requestId}/convert-exchange`, data);

  return result.data;
}

export async function submitApproveReturn(
  requestId: string,
  data: { cx_agent_id: string; cx_agent_name: string },
): Promise<void> {
  await apiRequest("POST", `/cx/returns/${requestId}/approve`, data);
}

export async function submitMarkUnreachable(
  requestId: string,
  data: { cx_agent_id: string; cx_agent_name: string },
): Promise<void> {
  await apiRequest("POST", `/cx/returns/${requestId}/mark-unreachable`, data);
}

export async function fetchCallLogs(requestId: string): Promise<CXCallLog[]> {
  const result = await apiRequest<any>("GET", `/cx/returns/${requestId}/call-logs`);

  return result.data || [];
}

// ─── Notification Settings ────────────────────────────────────────────────────

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  const result = await apiRequest<any>("GET", "/cx/notification-settings");

  return result.data;
}

export async function saveNotificationSettings(
  settings: Partial<NotificationSettings>,
  cx_agent_id: string,
): Promise<void> {
  await apiRequest("PUT", "/cx/notification-settings", { settings, cx_agent_id });
}
