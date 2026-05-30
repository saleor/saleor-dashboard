/**
 * Thin client for the TenXyou backend's bulk order import endpoint.
 * Mirrors src/returns-exchange/api/manualExchangeApi.ts (auth + base url).
 */

const BASE_URL = import.meta.env.VITE_TENEXU_API_URL;

if (!BASE_URL) {
  throw new Error(
    "VITE_TENEXU_API_URL is not set. The bulk order import module cannot reach the backend without it.",
  );
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("_saleor_auth_token") || "";
  const refreshToken = localStorage.getItem("_saleorRefreshToken") || "";

  return {
    Authorization: `Bearer ${token}`,
    "X-Refresh-Token": refreshToken,
  };
}

export interface BulkOrderImportAck {
  accepted: boolean;
  batchRef: string;
  requestId: string;
  totalRows: number;
  totalOrders: number;
  message: string;
}

export async function importBulkOrders(params: {
  file: File;
  defaultChannel: string;
  notifyEmail?: string;
}): Promise<BulkOrderImportAck> {
  const body = new FormData();

  body.append("file", params.file);
  body.append("defaultChannel", params.defaultChannel);

  if (params.notifyEmail) body.append("notifyEmail", params.notifyEmail);

  const res = await fetch(`${BASE_URL}/bulk-order/import`, {
    method: "POST",
    headers: getAuthHeaders(),
    body,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || `Request failed: ${res.status}`);
  }

  return json as BulkOrderImportAck;
}
