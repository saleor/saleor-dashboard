import { useUser } from "@dashboard/auth/useUser";
import ActionDialog from "@dashboard/components/ActionDialog";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getUserName } from "@dashboard/misc";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ArrowLeft, CheckCircle, ChevronDown, Phone, RotateCcw, UserX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  fetchCallLogs,
  fetchProductVariants,
  fetchReturn,
  submitApproveReturn,
  submitMarkUnreachable,
} from "../api/returnsApi";
import { SLABadge } from "../components/SLABadge";
import { StatusChip } from "../components/StatusChip";
import { type CXCallLog, type CXReturnDetail, type ProductVariant } from "../types";
import { logCallPath, returnsQueuePath, sizeSelectionPath } from "../urls";

interface RequestDetailViewProps {
  requestId: string;
}

export const RequestDetailView = ({ requestId }: RequestDetailViewProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { user } = useUser();
  const [detail, setDetail] = useState<CXReturnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [callLogs, setCallLogs] = useState<CXCallLog[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [cxActionsOpen, setCxActionsOpen] = useState(false);
  const cxActionsRef = useRef<HTMLDivElement>(null);

  const agentId = user?.id ?? null;
  const agentName = getUserName(user, true) || "CX Agent";
  const isUserReady = agentId !== null;

  const refreshCallLogs = async () => {
    try {
      const logs = await fetchCallLogs(requestId);

      setCallLogs(logs);
    } catch {
      // silently ignore
    }
  };

  const reload = async () => {
    setError(null);

    try {
      const data = await fetchReturn(requestId, agentId ?? undefined, agentName);

      setDetail(data);
      setCallLogs(data.call_logs || []);

      if (data.product_variant_id && data.product_id) {
        fetchProductVariants(requestId)
          .then(setVariants)
          .catch(() => {});
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!isUserReady) return undefined;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchReturn(requestId, agentId ?? undefined, agentName);

        if (cancelled) return;

        setDetail(data);
        setCallLogs(data.call_logs || []);

        if (data.product_variant_id && data.product_id) {
          fetchProductVariants(requestId)
            .then(v => {
              if (!cancelled) setVariants(v);
            })
            .catch(() => {});
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [requestId, agentId, agentName, isUserReady]);

  // Close CX Actions dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cxActionsRef.current && !cxActionsRef.current.contains(e.target as Node)) {
        setCxActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleApprove = async () => {
    if (!agentId) {
      notify({
        status: "error",
        text: "Your user session is still loading. Please wait a moment.",
      });

      return;
    }

    setApproving(true);

    try {
      await submitApproveReturn(requestId, { cx_agent_id: agentId, cx_agent_name: agentName });
      setApproveDialogOpen(false);
      await reload();
      notify({ status: "success", text: "Return approved" });
    } catch (err: any) {
      notify({ status: "error", text: err.message ?? "Failed to approve return" });
    } finally {
      setApproving(false);
    }
  };

  const handleMarkUnreachable = async () => {
    setCxActionsOpen(false);

    if (!agentId) {
      notify({
        status: "error",
        text: "Your user session is still loading. Please wait a moment.",
      });

      return;
    }

    try {
      await submitMarkUnreachable(requestId, { cx_agent_id: agentId, cx_agent_name: agentName });
      await reload();
      notify({ status: "success", text: "Marked as unreachable" });
    } catch (err: any) {
      notify({ status: "error", text: err.message ?? "Failed to mark unreachable" });
    }
  };

  const isTerminal =
    detail && ["EXCHANGED", "APPROVED", "AUTO_APPROVED"].includes(detail.cx_status);
  const lastUserAction = detail?.last_user_action;
  // Approval gate: per LogCallView guidance, agents must log ≥2 call attempts before
  // approving — unless the customer has explicitly disagreed to exchange (terminal user
  // action that doesn't require further attempts).
  const hasDisagreed = callLogs.some(c => c.user_action === "Disagreed to exchange");
  const hasEnoughCalls = callLogs.length >= 2 || hasDisagreed;
  const canExchange =
    !isTerminal && lastUserAction === "Agreed to exchange" && detail?.eligibility != null;
  const canApprove = !isTerminal && hasEnoughCalls && isUserReady;

  if (loading) {
    return (
      <Box padding={6}>
        <Skeleton __height={200} />
      </Box>
    );
  }

  if (error || !detail) {
    return (
      <Box padding={6}>
        <Text color="critical1">{error || "Request not found"}</Text>
      </Box>
    );
  }

  const address = detail.delivery_address as Record<string, any> | null;

  return (
    <Box padding={6} __maxWidth={1280}>
      {/* Back + Header */}
      <Button
        variant="secondary"
        size="small"
        onClick={() => navigate(returnsQueuePath)}
        marginBottom={4}
      >
        <ArrowLeft size={14} />
        Returns Queue
      </Button>

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom={6}>
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Text size={8} fontWeight="bold">
            {detail.request_id}
          </Text>
          <StatusChip status={detail.cx_status} />
          {detail.customer_unreachable && (
            <Box
              borderRadius={2}
              paddingX={2}
              paddingY={1}
              style={{ background: "#fee2e2", color: "#dc2626", fontSize: "12px" }}
            >
              ⚠ Customer Unreachable
            </Box>
          )}
          <Text size={3} color="default2">
            {detail.created_at
              ? new Date(detail.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        </Box>
        <Box display="flex" alignItems="center" gap={4}>
          {detail.auto_approval_due_at && !isTerminal && (
            <SLABadge tier={detail.sla_tier} hoursRemaining={detail.sla_hours_remaining} />
          )}
          {isTerminal && (
            <Text size={3} color="default2" style={{ fontStyle: "italic" }}>
              🔒 Read Only — Return Closed
            </Text>
          )}
          <Text size={3} color="default2">
            Order #{detail.saleor_order_number}
          </Text>
        </Box>
      </Box>

      {/* 2-column layout */}
      <Box display="grid" gap={6} __gridTemplateColumns="1fr 320px">
        {/* ── LEFT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={5}>
          {/* Return Item card */}
          <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={4}>
              <Text size={5} fontWeight="bold">
                Return Item
              </Text>
              {!isTerminal && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => navigate(logCallPath(requestId))}
                >
                  <Phone size={13} />
                  Log Call
                </Button>
              )}
              {isTerminal && (
                <Box
                  borderRadius={2}
                  paddingX={2}
                  paddingY={1}
                  style={{
                    background: "#dcfce7",
                    color: "#16a34a",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Return {detail.cx_status.replace("_", " ")}
                </Box>
              )}
            </Box>
            <Box display="grid" gap={4} __gridTemplateColumns="1fr 1fr">
              <FieldSmall label="PRODUCT" value={detail.product_name} />
              <FieldSmall label="SKU" value={detail.product_sku} />
              <FieldSmall
                label="SIZE / COLOUR"
                value={
                  detail.product_size && detail.product_colour
                    ? `${detail.product_size} / ${detail.product_colour}`
                    : detail.product_size || detail.product_colour || null
                }
              />
              <FieldSmall label="QUANTITY" value="1" />
            </Box>
            {detail.return_reason && (
              <Box
                marginTop={4}
                paddingTop={4}
                borderTopWidth={1}
                borderColor="default1"
                borderStyle="solid"
              >
                <Text size={2} color="default2" fontWeight="bold" display="block" marginBottom={1}>
                  RETURN REASON (CUSTOMER SUBMITTED)
                </Text>
                <Text size={3}>{detail.return_reason}</Text>
              </Box>
            )}
          </Card>

          {/* Order Summary card */}
          <Card>
            <Text size={5} fontWeight="bold" display="block" marginBottom={4}>
              Order #{detail.saleor_order_number}
              {detail.order_placed_at && (
                <Text size={3} color="default2" fontWeight="regular">
                  {" "}
                  — Placed{" "}
                  {new Date(detail.order_placed_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              )}
            </Text>
            <Box as="table" width="100%" style={{ borderCollapse: "collapse" }}>
              <Box as="thead">
                <Box as="tr" borderBottomWidth={1} borderColor="default1" borderStyle="solid">
                  {["PRODUCT", "SKU", "SIZE / COLOUR", "QTY"].map(h => (
                    <Box key={h} as="th" paddingY={2} paddingX={2} textAlign="left">
                      <Text size={1} color="default2" fontWeight="bold">
                        {h}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box as="tbody">
                <Box as="tr">
                  <Box as="td" paddingY={3} paddingX={2}>
                    <Text size={3}>{detail.product_name || "—"}</Text>
                  </Box>
                  <Box as="td" paddingY={3} paddingX={2}>
                    <Text size={3} color="default2">
                      {detail.product_sku || "—"}
                    </Text>
                  </Box>
                  <Box as="td" paddingY={3} paddingX={2}>
                    <Text size={3} color="default2">
                      {detail.product_size && detail.product_colour
                        ? `${detail.product_size} / ${detail.product_colour}`
                        : detail.product_size || detail.product_colour || "—"}
                    </Text>
                  </Box>
                  <Box as="td" paddingY={3} paddingX={2}>
                    <Text size={3}>1</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Customer-Uploaded Images */}
          {detail.customer_images && detail.customer_images.length > 0 && (
            <Card>
              <Text size={5} fontWeight="bold" display="block" marginBottom={3}>
                Customer-Uploaded Images
              </Text>
              <Text size={2} color="default2" display="block" marginBottom={3}>
                {detail.customer_images.length} image
                {detail.customer_images.length > 1 ? "s" : ""} uploaded. Click to expand.
              </Text>
              <Box display="flex" gap={3} flexWrap="wrap">
                {detail.customer_images.map((url, i) => (
                  <Box
                    key={i}
                    as="a"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    borderWidth={1}
                    borderColor="default1"
                    borderStyle="solid"
                    borderRadius={2}
                    overflow="hidden"
                    display="block"
                    __width={100}
                    __height={100}
                  >
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          )}

          {/* Exchange Eligibility */}
          {detail.eligibility && (
            <Card>
              <Text size={5} fontWeight="bold" display="block" marginBottom={4}>
                Exchange Eligibility
              </Text>

              {/* Eligibility checks table */}
              <Box as="table" width="100%" style={{ borderCollapse: "collapse" }} marginBottom={4}>
                <Box as="thead">
                  <Box as="tr" borderBottomWidth={1} borderColor="default1" borderStyle="solid">
                    {["CHECK", "STATUS", "DETAILS"].map(h => (
                      <Box key={h} as="th" paddingY={2} paddingX={2} textAlign="left">
                        <Text size={1} color="default2" fontWeight="bold">
                          {h}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box as="tbody">
                  <EligibilityRow
                    check={`Exchange Window (${detail.eligibility.windowDays} days from delivery)`}
                    ok={detail.eligibility.withinWindow}
                    okLabel="Within window"
                    failLabel="Window exceeded"
                    details={
                      detail.delivery_date
                        ? `Delivered ${new Date(detail.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${Math.abs(detail.eligibility.daysInWindow)}d ${detail.eligibility.withinWindow ? "remaining" : "overdue"}`
                        : "—"
                    }
                  />
                  <EligibilityRow
                    check="Product exchangeable (is_exchangeable flag)"
                    ok={detail.eligibility.isExchangeable}
                    okLabel="true"
                    failLabel="false"
                    details="Set in Saleor product metadata"
                  />
                  <EligibilityRow
                    check='Call logged with "Agreed to exchange"'
                    ok={lastUserAction === "Agreed to exchange"}
                    okLabel="Confirmed"
                    failLabel="Pending"
                    details={
                      lastUserAction === "Agreed to exchange"
                        ? "Customer confirmed exchange"
                        : 'Log a call with outcome "Agreed to exchange" to unlock'
                    }
                    pending={lastUserAction !== "Agreed to exchange"}
                  />
                </Box>
              </Box>

              {/* Available sizes */}
              {variants.length > 0 && (
                <Box marginBottom={4}>
                  <Text
                    size={2}
                    color="default2"
                    fontWeight="bold"
                    display="block"
                    marginBottom={3}
                  >
                    AVAILABLE REPLACEMENT SIZES
                    {detail.product_name ? ` — ${detail.product_name.toUpperCase()}` : ""}
                  </Text>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {variants.map(v => {
                      const isCurrent = v.id === detail.product_variant_id;
                      const outOfStock = v.quantityAvailable === 0;
                      const size =
                        v.attributes.find(a => a.attribute.name.toLowerCase() === "size")?.values[0]
                          ?.name || "—";

                      return (
                        <Box
                          key={v.id}
                          borderWidth={1}
                          borderStyle="solid"
                          borderColor={isCurrent ? "accent1" : "default1"}
                          borderRadius={2}
                          paddingX={3}
                          paddingY={2}
                          textAlign="center"
                          style={{
                            opacity: outOfStock ? 0.45 : 1,
                            background: isCurrent ? "rgba(99,102,241,0.08)" : "transparent",
                            minWidth: "64px",
                          }}
                        >
                          <Text size={3} fontWeight={isCurrent ? "bold" : "regular"}>
                            {size}
                          </Text>
                          <Text
                            size={2}
                            color={outOfStock ? "critical1" : "success1"}
                            display="block"
                          >
                            {isCurrent
                              ? "Current"
                              : outOfStock
                                ? "Out of stock"
                                : `In stock (${v.quantityAvailable})`}
                          </Text>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Inline action buttons */}
              <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
                <Button
                  variant="primary"
                  size="medium"
                  disabled={!canExchange || !!isTerminal}
                  onClick={() => navigate(sizeSelectionPath(requestId))}
                  title={!canExchange ? "Log a call with 'Agreed to exchange' first" : undefined}
                >
                  <RotateCcw size={14} />
                  Convert to Exchange
                </Button>
                {!canExchange && !isTerminal && (
                  <Text size={2} color="default2" style={{ fontStyle: "italic" }}>
                    Unlocks after a call with User Action = &quot;Agreed to exchange&quot;
                  </Text>
                )}
              </Box>
            </Card>
          )}

          {/* Call Log */}
          <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={4}>
              <Text size={5} fontWeight="bold">
                Call Log ({callLogs.length})
              </Text>
              {!isTerminal && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => navigate(logCallPath(requestId))}
                >
                  <Phone size={13} />
                  Log Call
                </Button>
              )}
            </Box>

            {callLogs.length === 0 ? (
              <Box
                backgroundColor="default2"
                borderRadius={2}
                padding={4}
                style={{ background: "#f9fafb" }}
              >
                <Text size={3} color="default2">
                  No calls logged yet. Use the &quot;Log Call&quot; button to log the first call
                  attempt.
                </Text>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={4}>
                {callLogs.map(log => (
                  <Box
                    key={log.id}
                    borderWidth={1}
                    borderColor="default1"
                    borderStyle="solid"
                    borderRadius={2}
                    padding={4}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      marginBottom={3}
                    >
                      <Text size={3} fontWeight="bold">
                        CALL {log.call_number}
                      </Text>
                      <Text size={2} color="default2">
                        {new Date(log.created_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        UTC
                      </Text>
                    </Box>
                    <Box
                      display="grid"
                      __gridTemplateColumns="1fr 1fr 1fr"
                      gap={3}
                      marginBottom={3}
                    >
                      <Box>
                        <Text size={2} color="default2" fontWeight="bold" display="block">
                          CX AGENT
                        </Text>
                        <Text size={3}>{log.cx_agent_name}</Text>
                      </Box>
                      <Box>
                        <Text size={2} color="default2" fontWeight="bold" display="block">
                          OUTCOME
                        </Text>
                        <Text size={3}>{log.outcome}</Text>
                      </Box>
                      {log.user_action && (
                        <Box>
                          <Text size={2} color="default2" fontWeight="bold" display="block">
                            USER ACTION
                          </Text>
                          <Text
                            size={3}
                            color={
                              log.user_action === "Agreed to exchange" ? "success1" : "default1"
                            }
                          >
                            {log.user_action}
                          </Text>
                        </Box>
                      )}
                    </Box>
                    <Text size={3} color="default2">
                      {log.notes}
                    </Text>
                    {log.callback_date && (
                      <Text size={2} color="default2" display="block" marginTop={2}>
                        Callback: {log.callback_date} {log.callback_time || ""}
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Card>

          {/* Status Timeline */}
          {detail.audit_trail && detail.audit_trail.length > 0 && (
            <Card>
              <Text size={5} fontWeight="bold" display="block" marginBottom={1}>
                Status Timeline
              </Text>
              <Text size={2} color="default2" display="block" marginBottom={4}>
                All state transitions and CX actions on this request, in chronological order.
              </Text>
              <Box display="flex" flexDirection="column" gap={3}>
                {[...detail.audit_trail].reverse().map(entry => (
                  <Box
                    key={entry.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Text size={3} fontWeight="bold" display="block">
                        {entry.action_type.replace(/_/g, " ")}
                        {entry.context?.from && entry.context?.to
                          ? `: ${entry.context.from} → ${entry.context.to}`
                          : ""}
                      </Text>
                      <Text size={2} color="default2">
                        by {entry.actor_name || "System"}
                      </Text>
                    </Box>
                    <Text size={2} color="default2" style={{ whiteSpace: "nowrap" }}>
                      {new Date(entry.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Card>
          )}
        </Box>

        {/* ── RIGHT SIDEBAR ── */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Terminal status badge */}
          {isTerminal && (
            <Box
              borderWidth={1}
              borderColor="default1"
              borderStyle="solid"
              borderRadius={3}
              padding={4}
              style={{ background: "#dcfce7", borderColor: "#86efac" }}
            >
              <Text size={3} fontWeight="bold" color="success1" display="block" marginBottom={1}>
                ✓ {detail.cx_status.replace(/_/g, " ")}
              </Text>
              {detail.last_activity_by_name && detail.last_activity_at && (
                <Text size={2} color="default2">
                  {detail.cx_status === "AUTO_APPROVED"
                    ? "Auto-approved"
                    : `Approved by ${detail.last_activity_by_name}`}{" "}
                  on{" "}
                  {new Date(detail.last_activity_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              )}
              {detail.replacement_order_number && (
                <Box marginTop={2}>
                  <Text size={2} color="default2" display="block">
                    Replacement order
                  </Text>
                  <Text size={3} fontWeight="bold">
                    #{detail.replacement_order_number}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Customer */}
          <SidebarCard title="CUSTOMER">
            <Text size={4} fontWeight="bold" display="block">
              {detail.customer_name || "—"}
            </Text>
          </SidebarCard>

          {/* Contact */}
          <SidebarCard title="CONTACT INFORMATION">
            {detail.customer_email && (
              <Text size={3} display="block">
                {detail.customer_email}
              </Text>
            )}
            {detail.customer_phone && (
              <Text size={3} display="block">
                {detail.customer_phone}
              </Text>
            )}
            {!detail.customer_email && !detail.customer_phone && (
              <Text size={3} color="default2">
                —
              </Text>
            )}
          </SidebarCard>

          {/* Shipping Address */}
          {address && (
            <SidebarCard title="SHIPPING ADDRESS">
              <Text size={3} display="block">
                {[address.firstName, address.lastName].filter(Boolean).join(" ")}
              </Text>
              {address.phone && (
                <Text size={3} display="block">
                  {address.phone}
                </Text>
              )}
              {address.streetAddress1 && (
                <Text size={3} display="block">
                  {address.streetAddress1}
                </Text>
              )}
              {address.streetAddress2 && (
                <Text size={3} display="block">
                  {address.streetAddress2}
                </Text>
              )}
              <Text size={3} display="block">
                {[address.postalCode, address.city].filter(Boolean).join(" ")}
              </Text>
              {address.countryArea && (
                <Text size={3} display="block">
                  {address.countryArea}
                  {address.country?.code ? `, ${address.country.code}` : ""}
                </Text>
              )}
            </SidebarCard>
          )}

          {/* Order Info */}
          <SidebarCard title="ORDER INFO">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Text size={2} color="default2" fontWeight="bold" display="block">
                  ORDER PLACED
                </Text>
                <Text size={3}>
                  {detail.order_placed_at
                    ? new Date(detail.order_placed_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </Text>
              </Box>
              <Box>
                <Text size={2} color="default2" fontWeight="bold" display="block">
                  DELIVERY DATE
                </Text>
                <Text size={3}>
                  {detail.delivery_date
                    ? new Date(detail.delivery_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </Text>
                {detail.delivery_date && (
                  <Text size={2} color="default2" display="block">
                    ({daysAgo(detail.delivery_date)})
                  </Text>
                )}
              </Box>
              <Box>
                <Text size={2} color="default2" fontWeight="bold" display="block">
                  PAYMENT
                </Text>
                <Text size={3}>{detail.payment_method || "—"}</Text>
              </Box>
            </Box>
          </SidebarCard>
        </Box>
      </Box>

      {/* ── Sticky Bottom Action Bar ── */}
      {!isTerminal && (
        <Box
          position="sticky"
          bottom={0}
          borderTopWidth={1}
          borderColor="default1"
          borderStyle="solid"
          padding={4}
          marginTop={6}
          display="flex"
          gap={3}
          justifyContent="flex-end"
          alignItems="center"
          zIndex="2"
          __marginLeft={-24}
          __marginRight={-24}
          __paddingLeft={24}
          __paddingRight={24}
          style={{ background: "#fff" }}
        >
          {/* CX Actions dropdown */}
          <Box position="relative" ref={cxActionsRef as any}>
            <Button variant="secondary" size="medium" onClick={() => setCxActionsOpen(o => !o)}>
              CX Actions
              <ChevronDown size={14} />
            </Button>
            {cxActionsOpen && (
              <Box
                position="absolute"
                bottom={10}
                left={0}
                borderWidth={1}
                borderColor="default1"
                borderStyle="solid"
                borderRadius={2}
                overflow="hidden"
                zIndex="3"
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  minWidth: "180px",
                }}
              >
                {!detail.customer_unreachable && (
                  <Box
                    as="button"
                    width="100%"
                    padding={3}
                    textAlign="left"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    onClick={handleMarkUnreachable}
                    style={{
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      fontSize: "14px",
                    }}
                  >
                    <UserX size={14} />
                    Mark Unreachable
                  </Box>
                )}
                <Box
                  as="button"
                  width="100%"
                  padding={3}
                  textAlign="left"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  onClick={() => {
                    setCxActionsOpen(false);
                    refreshCallLogs();
                  }}
                  style={{
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    fontSize: "14px",
                  }}
                >
                  Refresh Call Logs
                </Box>
              </Box>
            )}
          </Box>

          <Button
            variant="secondary"
            size="medium"
            onClick={() => navigate(logCallPath(requestId))}
          >
            <Phone size={14} />
            Log Call
          </Button>

          <Button
            variant="secondary"
            size="medium"
            disabled={!canExchange}
            onClick={() => navigate(sizeSelectionPath(requestId))}
            title={!canExchange ? "Log a call with 'Agreed to exchange' first" : undefined}
          >
            <RotateCcw size={14} />
            Convert to Exchange
          </Button>

          <Button
            variant="primary"
            size="medium"
            onClick={() => setApproveDialogOpen(true)}
            disabled={approving || !canApprove}
            title={
              !canApprove
                ? hasDisagreed || callLogs.length >= 2
                  ? "Sign in is still loading"
                  : "Log at least 2 call attempts before approving"
                : undefined
            }
          >
            <CheckCircle size={14} />
            {approving ? "Approving..." : "Approve Return"}
          </Button>
        </Box>
      )}

      <ActionDialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleApprove}
        confirmButtonState={approving ? "loading" : "default"}
        title="Approve return request"
        confirmButtonLabel="Approve"
      >
        <Text>Approve this return request? This action cannot be undone.</Text>
      </ActionDialog>
    </Box>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Box borderWidth={1} borderColor="default1" borderStyle="solid" borderRadius={3} padding={5}>
      {children}
    </Box>
  );
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box borderWidth={1} borderColor="default1" borderStyle="solid" borderRadius={3} padding={4}>
      <Text size={2} color="default2" fontWeight="bold" display="block" marginBottom={2}>
        {title}
      </Text>
      {children}
    </Box>
  );
}

function FieldSmall({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <Box>
      <Text size={2} color="default2" fontWeight="bold" display="block">
        {label}
      </Text>
      <Text size={3}>{value || "—"}</Text>
    </Box>
  );
}

function EligibilityRow({
  check,
  ok,
  okLabel,
  failLabel,
  details,
  pending,
}: {
  check: string;
  ok: boolean;
  okLabel: string;
  failLabel: string;
  details: string;
  pending?: boolean;
}) {
  return (
    <Box as="tr" borderBottomWidth={1} borderColor="default1" borderStyle="solid">
      <Box as="td" paddingY={3} paddingX={2}>
        <Text size={3}>{check}</Text>
      </Box>
      <Box as="td" paddingY={3} paddingX={2}>
        {pending ? (
          <Text size={3} color="default2">
            ⚠ Pending
          </Text>
        ) : (
          <Text size={3} color={ok ? "success1" : "critical1"}>
            {ok ? `✓ ${okLabel}` : `✗ ${failLabel}`}
          </Text>
        )}
      </Box>
      <Box as="td" paddingY={3} paddingX={2}>
        <Text size={2} color="default2">
          {details}
        </Text>
      </Box>
    </Box>
  );
}

function daysAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "today";

  if (days === 1) return "1 day ago";

  return `${days} days ago`;
}
