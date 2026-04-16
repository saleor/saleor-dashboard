import { type CXManualExchange } from "../types";

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

  if (!json.ok && !res.ok) throw new Error(json.message || `Request failed: ${res.status}`);

  return json;
}

export async function fetchManualExchanges(
  page = 1,
  limit = 20,
): Promise<{
  data: CXManualExchange[];
  pagination: { total: number; page: number; limit: number };
}> {
  const result = await apiRequest<any>("GET", `/cx/manual-exchanges?page=${page}&limit=${limit}`);

  return { data: result.data, pagination: result.pagination };
}

export async function fetchManualExchange(mxId: string): Promise<CXManualExchange> {
  const result = await apiRequest<any>("GET", `/cx/manual-exchanges/${mxId}`);

  return result.data;
}

export async function lookupOrderForMX(orderNumber: string, cx_agent_id: string): Promise<any> {
  const result = await apiRequest<any>("POST", "/cx/manual-exchanges/order-lookup", {
    order_number: orderNumber,
    cx_agent_id,
  });

  return result.data;
}

export async function fetchProductVariantsForMX(productId: string): Promise<any[]> {
  const result = await apiRequest<any>(
    "GET",
    `/cx/manual-exchanges/product-variants?productId=${encodeURIComponent(productId)}`,
  );

  return result.data || [];
}

export async function submitManualExchange(params: {
  orderId: string;
  orderNumber: string;
  fulfillmentId: string;
  fulfillmentLineId: string;
  itemVariantId: string;
  newVariantId: string;
  overrideReason?: string;
  itemName?: string;
  itemSku?: string;
  itemSize?: string;
  itemColour?: string;
  replacementSize?: string;
  replacementColour?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  agentId: string;
  agentName: string;
}): Promise<any> {
  const result = await apiRequest<any>("POST", "/cx/manual-exchanges", {
    original_order_id: params.orderId,
    original_order_number: params.orderNumber,
    fulfillment_id: params.fulfillmentId,
    fulfillment_line_id: params.fulfillmentLineId,
    item_variant_id: params.itemVariantId,
    replacement_variant_id: params.newVariantId,
    override_reason: params.overrideReason,
    item_name: params.itemName,
    item_sku: params.itemSku,
    item_size: params.itemSize,
    item_colour: params.itemColour,
    replacement_size: params.replacementSize,
    replacement_colour: params.replacementColour,
    customer_name: params.customerName,
    customer_email: params.customerEmail,
    customer_phone: params.customerPhone,
    cx_agent_id: params.agentId,
    cx_agent_name: params.agentName,
  });

  return result.data;
}
