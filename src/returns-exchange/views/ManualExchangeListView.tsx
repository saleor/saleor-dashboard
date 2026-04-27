import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Input, Select, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { fetchManualExchanges } from "../api/manualExchangeApi";
import { type CXManualExchange } from "../types";
import { manualExchangeDetailPath, manualExchangeNewPath } from "../urls";

const STATUS_OPTS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Sync Pending" },
  { value: "SUCCESS", label: "Completed" },
  { value: "FAILED", label: "ERP Failed" },
];

function MxStatusBadge({ mx }: { mx: CXManualExchange }) {
  const { erp_sync_status, override_reason } = mx;

  let label = "";
  let style: React.CSSProperties = {};

  if (erp_sync_status === "FAILED") {
    label = "⚠ ERP Failed";
    style = { background: "#fee2e2", color: "#dc2626" };
  } else if (erp_sync_status === "PENDING") {
    label = "⏳ Sync Pending";
    style = { background: "#fef9c3", color: "#92400e" };
  } else {
    label = "✓ Completed";
    style = { background: "#dcfce7", color: "#16a34a" };
  }

  let overrideLabel = "";

  if (override_reason === "window_exceeded") overrideLabel = "Window override";
  else if (override_reason === "not_exchangeable") overrideLabel = "Eligibility override";
  else if (override_reason === "both") overrideLabel = "Window + Eligibility override";

  return (
    <Box>
      <Box
        display="inline-block"
        borderRadius={2}
        paddingX={2}
        paddingY={1}
        style={{ ...style, fontSize: "12px", fontWeight: 600 }}
      >
        {label}
      </Box>
      {overrideLabel && (
        <Text size={2} color="default2" display="block" marginTop={1}>
          ⬡ {overrideLabel}
        </Text>
      )}
    </Box>
  );
}

export const ManualExchangeListView = () => {
  const navigate = useNavigator();
  const [records, setRecords] = useState<CXManualExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchManualExchanges(page, LIMIT);

      setRecords(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  // Client-side filter by search and status (simple, since list is usually small)
  const filtered = records.filter(mx => {
    const matchStatus = !statusFilter || mx.erp_sync_status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      mx.mx_id.toLowerCase().includes(q) ||
      (mx.customer_name || "").toLowerCase().includes(q) ||
      (mx.customer_email || "").toLowerCase().includes(q) ||
      mx.original_order_number.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(total / LIMIT) || 1;

  return (
    <Box padding={6}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Box>
          <Text size={8} fontWeight="bold">
            Manual Exchange
          </Text>
          <Text size={3} color="default2" display="block">
            Manual exchanges created by CX agents
          </Text>
        </Box>
        <Box display="flex" gap={3}>
          <Button variant="secondary" onClick={load} size="small">
            <RefreshCw size={14} />
            Refresh
          </Button>
          <Button variant="primary" onClick={() => navigate(manualExchangeNewPath)} size="small">
            <Plus size={14} />
            New Manual Exchange
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={3} marginBottom={5} flexWrap="wrap">
        <Box __flexGrow="1" __minWidth="220px">
          <Input
            label="Search by MX ID, order, customer..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="small"
          />
        </Box>
        <Select
          value={statusFilter}
          onChange={v => {
            setStatusFilter(v as string);
            setPage(1);
          }}
          size="small"
          options={STATUS_OPTS.map(o => ({ value: o.value, label: o.label }))}
        />
      </Box>

      {/* Table */}
      {loading ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} __height={56} />
          ))}
        </Box>
      ) : error ? (
        <Box padding={8} textAlign="center">
          <Text color="critical1">{error}</Text>
        </Box>
      ) : filtered.length === 0 ? (
        <Box padding={8} textAlign="center">
          <Text color="default2">No manual exchanges found</Text>
        </Box>
      ) : (
        <>
          <Box as="table" width="100%" style={{ borderCollapse: "collapse" }}>
            <Box as="thead">
              <Box as="tr" borderBottomWidth={1} borderColor="default1" borderStyle="solid">
                {[
                  "MX ID",
                  "Customer",
                  "Original Order",
                  "Original Item",
                  "Replacement",
                  "Agent",
                  "Created",
                  "Status",
                ].map(col => (
                  <Box key={col} as="th" paddingX={3} paddingY={3} textAlign="left">
                    <Text size={2} color="default2" fontWeight="bold">
                      {col}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {filtered.map(mx => (
                <Box
                  key={mx.mx_id}
                  as="tr"
                  borderBottomWidth={1}
                  borderColor="default1"
                  borderStyle="solid"
                  onClick={() => navigate(manualExchangeDetailPath(mx.mx_id))}
                  style={{ cursor: "pointer" }}
                >
                  {/* MX ID */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3} fontWeight="bold">
                      {mx.mx_id}
                    </Text>
                  </Box>

                  {/* Customer */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3}>{mx.customer_name || "—"}</Text>
                    <Text size={2} color="default2" display="block">
                      {mx.customer_email || ""}
                    </Text>
                    {mx.customer_phone && (
                      <Text size={2} color="default2" display="block">
                        {mx.customer_phone}
                      </Text>
                    )}
                  </Box>

                  {/* Original Order */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3} fontWeight="bold">
                      #{mx.original_order_number}
                    </Text>
                  </Box>

                  {/* Original Item */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3}>{mx.item_name || "—"}</Text>
                    <Text size={2} color="default2" display="block">
                      {[mx.item_sku, mx.item_size, mx.item_colour].filter(Boolean).join(" · ")}
                    </Text>
                  </Box>

                  {/* Replacement */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={3}>
                      {[mx.replacement_size, mx.replacement_colour].filter(Boolean).join(" / ") ||
                        "—"}
                    </Text>
                    {mx.replacement_order_number && (
                      <Text size={2} color="default2" display="block">
                        Repl. order #{mx.replacement_order_number}
                      </Text>
                    )}
                  </Box>

                  {/* Agent */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        __width={28}
                        __height={28}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        style={{
                          borderRadius: "9999px",
                          background: "#ede9fe",
                          color: "#7c3aed",
                          fontSize: "11px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {mx.cx_agent_name
                          .split(" ")
                          .map(n => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </Box>
                      <Text size={3}>{mx.cx_agent_name}</Text>
                    </Box>
                  </Box>

                  {/* Created */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <Text size={2} color="default2">
                      {new Date(mx.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                    <Text size={2} color="default2" display="block">
                      {new Date(mx.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>

                  {/* Status */}
                  <Box as="td" paddingX={3} paddingY={3}>
                    <MxStatusBadge mx={mx} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={4}>
            <Text size={3} color="default2">
              {filtered.length} manual exchange{filtered.length !== 1 ? "s" : ""} · Showing all
            </Text>
            <Box display="flex" alignItems="center" gap={3}>
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
          </Box>
        </>
      )}
    </Box>
  );
};
