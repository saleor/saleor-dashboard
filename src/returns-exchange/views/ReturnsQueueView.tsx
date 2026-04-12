import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Input, Select, Skeleton, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { fetchReturns } from "../api/returnsApi";
import { SLABadge } from "../components/SLABadge";
import { StatusChip } from "../components/StatusChip";
import { type CXReturnRequest, type CXReturnStatus, type SLATier } from "../types";
import { requestDetailPath } from "../urls";

const STATUSES: { value: CXReturnStatus; label: string }[] = [
  { value: "RETURN_PENDING", label: "Pending" },
  { value: "CX_REVIEW", label: "CX Review" },
  { value: "CX_ACTION", label: "CX Action" },
  { value: "EXCHANGED", label: "Exchanged" },
  { value: "APPROVED", label: "Approved" },
  { value: "AUTO_APPROVED", label: "Auto Approved" },
];

const SLA_OPTIONS = [
  { value: "", label: "All SLA tiers" },
  { value: "CRITICAL", label: "Critical (< 3h)" },
  { value: "AT_RISK", label: "At Risk (3–6h)" },
  { value: "SAFE", label: "Safe" },
];

const LIMIT = 20;

interface Filters {
  search: string;
  status: CXReturnStatus | "";
  sla_tier: SLATier | "";
  product: string;
  return_reason: string;
  date_from: string;
  date_to: string;
  last_activity_by: string;
}

const EMPTY_FILTERS: Filters = {
  search: "",
  status: "",
  sla_tier: "",
  product: "",
  return_reason: "",
  date_from: "",
  date_to: "",
  last_activity_by: "",
};

function hasActiveFilters(f: Filters) {
  return Object.values(f).some(v => v !== "");
}

export const ReturnsQueueView = () => {
  const navigate = useNavigator();
  const [requests, setRequests] = useState<CXReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const criticalCount = requests.filter(r => r.sla_tier === "CRITICAL").length;

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchReturns({
        search: filters.search || undefined,
        status: filters.status || undefined,
        sla_tier: filters.sla_tier || undefined,
        product: filters.product || undefined,
        return_reason: filters.return_reason || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        last_activity_by: filters.last_activity_by || undefined,
        page,
        limit: LIMIT,
      });

      setRequests(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / LIMIT) || 1;

  return (
    <Box padding={6}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={6}>
        <Box>
          <Text size={8} fontWeight="bold">
            Returns Queue
          </Text>
          <Text size={3} color="default2" display="block">
            {total} total requests
          </Text>
        </Box>
        <Button variant="secondary" onClick={load} size="small">
          <RefreshCw size={14} />
          Refresh
        </Button>
      </Box>

      {/* Critical Banner */}
      {criticalCount > 0 && (
        <Box
          backgroundColor="critical1"
          borderRadius={3}
          padding={4}
          marginBottom={4}
          display="flex"
          alignItems="center"
          gap={3}
        >
          <AlertTriangle size={16} color="#ef4444" />
          <Text size={3} color="critical1" fontWeight="bold">
            {criticalCount} request{criticalCount > 1 ? "s" : ""} expiring in under 3 hours — action
            required
          </Text>
        </Box>
      )}

      {/* ── Filters ── */}
      <Box marginBottom={5}>
        {/* Row 1: Search */}
        <Box marginBottom={3}>
          <Input
            placeholder="Search by customer, email, order #, REQ-ID..."
            value={filters.search}
            onChange={e => setFilter("search", e.target.value)}
            size="small"
          />
        </Box>

        {/* Row 2: Status chip toggles */}
        <Box display="flex" gap={2} flexWrap="wrap" marginBottom={3}>
          {STATUSES.map(s => {
            const active = filters.status === s.value;

            return (
              <Box
                key={s.value}
                as="button"
                onClick={() => setFilter("status", active ? "" : s.value)}
                borderWidth={1}
                borderStyle="solid"
                borderColor={active ? "accent1" : "default1"}
                borderRadius={3}
                paddingX={3}
                paddingY={1}
                style={{
                  cursor: "pointer",
                  background: active ? "var(--color-accent1, #6366f1)" : "transparent",
                  color: active ? "#fff" : "inherit",
                  fontSize: "12px",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {s.label}
              </Box>
            );
          })}
        </Box>

        {/* Row 3: Additional filters */}
        <Box display="flex" gap={3} flexWrap="wrap" alignItems="flex-end">
          {/* Product */}
          <Box __minWidth="160px" __flexGrow="1">
            <Text size={2} color="default2" display="block" marginBottom={1}>
              Product
            </Text>
            <Input
              placeholder="Product name or SKU..."
              value={filters.product}
              onChange={e => setFilter("product", e.target.value)}
              size="small"
            />
          </Box>

          {/* Return Reason */}
          <Box __minWidth="160px" __flexGrow="1">
            <Text size={2} color="default2" display="block" marginBottom={1}>
              Return Reason
            </Text>
            <Input
              placeholder="Filter by reason..."
              value={filters.return_reason}
              onChange={e => setFilter("return_reason", e.target.value)}
              size="small"
            />
          </Box>

          {/* SLA Tier */}
          <Box __minWidth="140px">
            <Text size={2} color="default2" display="block" marginBottom={1}>
              SLA Tier
            </Text>
            <Select
              value={filters.sla_tier}
              onChange={v => setFilter("sla_tier", v as SLATier | "")}
              size="small"
              options={SLA_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            />
          </Box>

          {/* Date Range */}
          <Box __minWidth="130px">
            <Text size={2} color="default2" display="block" marginBottom={1}>
              From
            </Text>
            <Input
              type="date"
              value={filters.date_from}
              onChange={e => setFilter("date_from", e.target.value)}
              size="small"
            />
          </Box>
          <Box __minWidth="130px">
            <Text size={2} color="default2" display="block" marginBottom={1}>
              To
            </Text>
            <Input
              type="date"
              value={filters.date_to}
              onChange={e => setFilter("date_to", e.target.value)}
              size="small"
            />
          </Box>

          {/* Last Activity By */}
          <Box __minWidth="160px" __flexGrow="1">
            <Text size={2} color="default2" display="block" marginBottom={1}>
              Last Activity By
            </Text>
            <Input
              placeholder="Agent name..."
              value={filters.last_activity_by}
              onChange={e => setFilter("last_activity_by", e.target.value)}
              size="small"
            />
          </Box>

          {/* Clear All */}
          {hasActiveFilters(filters) && (
            <Box style={{ paddingTop: "20px" }}>
              <Button variant="secondary" size="small" onClick={clearFilters}>
                <X size={13} />
                Clear all
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Table ── */}
      {loading ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} __height={48} />
          ))}
        </Box>
      ) : error ? (
        <Box padding={8} textAlign="center">
          <Text color="critical1">{error}</Text>
        </Box>
      ) : requests.length === 0 ? (
        <Box padding={8} textAlign="center">
          <Text color="default2">No return requests found</Text>
        </Box>
      ) : (
        <>
          <Box as="table" width="100%" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
            <Box as="thead">
              <Box as="tr" borderBottomWidth={1} borderColor="default1" borderStyle="solid">
                {[
                  { label: "Request ID", width: "10%" },
                  { label: "Customer Name", width: "13%" },
                  { label: "Order #", width: "8%" },
                  { label: "Product", width: "14%" },
                  { label: "Return Reason", width: "12%" },
                  { label: "Submitted At", width: "10%" },
                  { label: "SLA Remaining", width: "11%" },
                  { label: "Status", width: "10%" },
                  { label: "Last Activity By", width: "12%" },
                ].map(col => (
                  <Box
                    key={col.label}
                    as="th"
                    paddingX={3}
                    paddingY={3}
                    textAlign="left"
                    style={{ width: col.width }}
                  >
                    <Text size={2} color="default2" fontWeight="bold">
                      {col.label}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {requests.map(req => (
                <Box
                  key={req.request_id}
                  as="tr"
                  borderBottomWidth={1}
                  borderColor="default1"
                  borderStyle="solid"
                  onClick={() => navigate(requestDetailPath(req.request_id))}
                  style={{ cursor: "pointer" }}
                >
                  {/* Request ID */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3} fontWeight="bold" style={{ whiteSpace: "nowrap" }}>
                      {req.request_id}
                    </Text>
                  </Box>

                  {/* Customer Name */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3}>{req.customer_name || "—"}</Text>
                    <Text size={2} color="default2" display="block">
                      {req.customer_email || ""}
                    </Text>
                  </Box>

                  {/* Order # */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3}>#{req.saleor_order_number}</Text>
                  </Box>

                  {/* Product */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text
                      size={3}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {req.product_name || "—"}
                    </Text>
                    <Text size={2} color="default2" display="block">
                      {req.product_sku || ""}
                    </Text>
                  </Box>

                  {/* Return Reason */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text
                      size={3}
                      color="default2"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {req.return_reason || "—"}
                    </Text>
                  </Box>

                  {/* Submitted At */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={2} color="default2">
                      {new Date(req.created_at).toLocaleDateString()}
                    </Text>
                    <Text size={2} color="default2" display="block">
                      {new Date(req.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>

                  {/* SLA Remaining */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <SLABadge tier={req.sla_tier} hoursRemaining={req.sla_hours_remaining} />
                  </Box>

                  {/* Status */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <StatusChip status={req.cx_status} />
                  </Box>

                  {/* Last Activity By */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    {req.last_activity_by_name ? (
                      <>
                        <Text size={3}>{req.last_activity_by_name}</Text>
                        {req.last_call_user_action && (
                          <Text size={2} color="default2" display="block">
                            {req.last_call_user_action}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text size={3} color="default2">
                        —
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Pagination */}
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={3} marginTop={4}>
            <Text size={3} color="default2">
              Page {page} of {totalPages}
            </Text>
            <Button
              variant="secondary"
              size="small"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="small"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
