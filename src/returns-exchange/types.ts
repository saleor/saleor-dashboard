export type CXReturnStatus =
  | "RETURN_PENDING"
  | "CX_REVIEW"
  | "CX_ACTION"
  | "EXCHANGED"
  | "APPROVED"
  | "AUTO_APPROVED";

export type SLATier = "SAFE" | "AT_RISK" | "CRITICAL";
export type CXCallOutcome = "Answered" | "No Answer" | "Busy" | "Callback Requested";
export type CXUserAction = "Agreed to exchange" | "Disagreed to exchange" | "User Unreachable";

export interface CXReturnRequest {
  id: number;
  request_id: string;
  saleor_order_id: string;
  saleor_order_number: string;
  saleor_fulfillment_id: string;
  saleor_return_fulfillment_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  delivery_address: Record<string, any> | null;
  payment_method: "COD" | "PREPAID" | null;
  order_placed_at: string | null;
  delivery_date: string | null;
  product_name: string | null;
  product_sku: string | null;
  product_size: string | null;
  product_colour: string | null;
  product_variant_id: string | null;
  product_id: string | null;
  return_reason: string | null;
  customer_images: string[] | null;
  cod_refund_email: string | null;
  cx_status: CXReturnStatus;
  last_activity_at: string;
  auto_approval_due_at: string | null;
  customer_unreachable: boolean;
  replacement_order_id: string | null;
  replacement_order_number: string | null;
  erp_sync_status: string | null;
  created_at: string;
  updated_at: string;
  last_activity_by_id: string | null;
  last_activity_by_name: string | null;
  // Computed
  sla_tier: SLATier;
  sla_hours_remaining: number | null;
  call_count: number;
  last_call_outcome: string | null;
  last_call_user_action: string | null;
}

export interface CXCallLog {
  id: number;
  request_id: string;
  call_number: number;
  cx_agent_id: string;
  cx_agent_name: string;
  outcome: CXCallOutcome;
  user_action: CXUserAction | null;
  notes: string;
  callback_date: string | null;
  callback_time: string | null;
  created_at: string;
}

export interface CXAuditEntry {
  id: number;
  entity_type: string;
  entity_id: string;
  actor_type: string;
  actor_id: string | null;
  actor_name: string | null;
  action_type: string;
  context: Record<string, any> | null;
  created_at: string;
}

export interface CXEligibility {
  isExchangeable: boolean;
  withinWindow: boolean;
  daysInWindow: number;
  windowDays: number;
  requiresOverride: boolean;
  overrideReasons: string[];
}

export interface CXReturnDetail extends CXReturnRequest {
  call_logs: CXCallLog[];
  audit_trail: CXAuditEntry[];
  last_user_action: CXUserAction | null;
  eligibility: CXEligibility | null;
}

export interface CXManualExchange {
  id: number;
  mx_id: string;
  original_order_id: string;
  original_order_number: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  item_sku: string | null;
  item_name: string | null;
  item_size: string | null;
  item_colour: string | null;
  item_variant_id: string | null;
  replacement_variant_id: string | null;
  replacement_size: string | null;
  replacement_colour: string | null;
  replacement_order_id: string | null;
  replacement_order_number: string | null;
  cx_agent_id: string;
  cx_agent_name: string;
  override_reason: string | null;
  erp_sync_status: string;
  created_at: string;
}

export interface NotificationSettings {
  AT_RISK_EMAILS: string[];
  AT_RISK_THRESHOLD: number;
  CRITICAL_EMAILS: string[];
  CRITICAL_THRESHOLD: number;
  ERP_SYNC_EMAILS: string[];
  AUTO_APPROVAL_EMAILS: string[];
  EXCHANGE_ORDER_EMAILS: string[];
  WEBHOOK_FAIL_EMAILS: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  quantityAvailable: number;
  attributes: Array<{
    attribute: {
      name: string;
    };
    values: Array<{
      name: string;
    }>;
  }>;
}
