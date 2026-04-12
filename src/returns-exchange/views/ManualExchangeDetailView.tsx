import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchManualExchange } from "../api/manualExchangeApi";
import { type CXManualExchange } from "../types";
import { manualExchangeListPath } from "../urls";

interface ManualExchangeDetailViewProps {
  mxId: string;
}

export const ManualExchangeDetailView = ({ mxId }: ManualExchangeDetailViewProps) => {
  const navigate = useNavigator();
  const [mx, setMx] = useState<CXManualExchange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await fetchManualExchange(mxId);

        setMx(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [mxId]);

  if (loading) {
    return (
      <Box padding={6}>
        <Skeleton __height={300} />
      </Box>
    );
  }

  if (error || !mx) {
    return (
      <Box padding={6}>
        <Text color="critical1">{error || "Not found"}</Text>
      </Box>
    );
  }

  return (
    <Box padding={6} __maxWidth={800}>
      <Button
        variant="secondary"
        size="small"
        onClick={() => navigate(manualExchangeListPath)}
        marginBottom={4}
      >
        <ArrowLeft size={14} />
        Back to Manual Exchanges
      </Button>

      <Box display="flex" alignItems="center" gap={3} marginBottom={6}>
        <Text size={8} fontWeight="bold">
          {mx.mx_id}
        </Text>
        <Text
          size={3}
          color={
            mx.erp_sync_status === "SUCCESS"
              ? "success1"
              : mx.erp_sync_status === "FAILED"
                ? "critical1"
                : "default2"
          }
        >
          ERP: {mx.erp_sync_status}
        </Text>
      </Box>

      <Box display="grid" gap={5} __gridTemplateColumns="1fr 1fr">
        {/* Original Order */}
        <Box
          borderWidth={1}
          borderColor="default1"
          borderStyle="solid"
          borderRadius={3}
          padding={4}
        >
          <Text size={4} fontWeight="bold" display="block" marginBottom={3}>
            Original Order
          </Text>
          <Field label="Order #" value={`#${mx.original_order_number}`} />
          <Field label="Customer" value={mx.customer_name} />
          <Field label="Email" value={mx.customer_email} />
          <Field label="Phone" value={mx.customer_phone} />
        </Box>

        {/* Item */}
        <Box
          borderWidth={1}
          borderColor="default1"
          borderStyle="solid"
          borderRadius={3}
          padding={4}
        >
          <Text size={4} fontWeight="bold" display="block" marginBottom={3}>
            Item Being Exchanged
          </Text>
          <Field label="Product" value={mx.item_name} />
          <Field label="SKU" value={mx.item_sku} />
          <Field label="Size" value={mx.item_size} />
        </Box>

        {/* Replacement */}
        <Box
          borderWidth={1}
          borderColor="default1"
          borderStyle="solid"
          borderRadius={3}
          padding={4}
        >
          <Text size={4} fontWeight="bold" display="block" marginBottom={3}>
            Replacement
          </Text>
          <Field label="Replacement Size" value={mx.replacement_size} />
          {mx.replacement_order_number && (
            <Field label="Replacement Order #" value={`#${mx.replacement_order_number}`} />
          )}
        </Box>

        {/* Meta */}
        <Box
          borderWidth={1}
          borderColor="default1"
          borderStyle="solid"
          borderRadius={3}
          padding={4}
        >
          <Text size={4} fontWeight="bold" display="block" marginBottom={3}>
            Agent Info
          </Text>
          <Field label="Created By" value={mx.cx_agent_name} />
          {mx.override_reason && <Field label="Override Reason" value={mx.override_reason} />}
          <Field label="Created" value={new Date(mx.created_at).toLocaleString()} />
        </Box>
      </Box>
    </Box>
  );
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <Box marginBottom={2}>
      <Text size={2} color="default2" display="block">
        {label}
      </Text>
      <Text size={3}>{value || "—"}</Text>
    </Box>
  );
}
