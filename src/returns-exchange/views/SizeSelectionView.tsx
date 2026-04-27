import { useUser } from "@dashboard/auth/useUser";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getUserName } from "@dashboard/misc";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchProductVariants, fetchReturn, submitConvertToExchange } from "../api/returnsApi";
import { type CXReturnDetail, type ProductVariant } from "../types";
import { requestDetailPath } from "../urls";

interface SizeSelectionViewProps {
  requestId: string;
}

export const SizeSelectionView = ({ requestId }: SizeSelectionViewProps) => {
  const navigate = useNavigator();
  const { user } = useUser();
  const [detail, setDetail] = useState<CXReturnDetail | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agentId = user?.id || "unknown";
  const agentName = getUserName(user, true) || "CX Agent";

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [det, vars] = await Promise.all([
          fetchReturn(requestId, agentId, agentName),
          fetchProductVariants(requestId),
        ]);

        setDetail(det);
        setVariants(vars);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [requestId]);

  const handleConfirm = async () => {
    if (!selectedVariantId) {
      setError("Please select a size");

      return;
    }

    if (detail?.eligibility?.requiresOverride && !overrideReason) {
      setError("This exchange requires an override reason");

      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitConvertToExchange(requestId, {
        replacement_variant_id: selectedVariantId,
        cx_agent_id: agentId,
        cx_agent_name: agentName,
        override_reason: overrideReason || undefined,
      });
      navigate(requestDetailPath(requestId));
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box padding={6}>
        <Skeleton __height={200} />
      </Box>
    );
  }

  if (error && !detail) {
    return (
      <Box padding={6}>
        <Text color="critical1">{error}</Text>
      </Box>
    );
  }

  return (
    <Box padding={6} __maxWidth={640}>
      <Button
        variant="secondary"
        size="small"
        onClick={() => navigate(requestDetailPath(requestId))}
        marginBottom={4}
      >
        <ArrowLeft size={14} />
        Back
      </Button>

      <Text size={8} fontWeight="bold" display="block" marginBottom={2}>
        Select Replacement Size
      </Text>
      <Text size={3} color="default2" display="block" marginBottom={6}>
        {detail?.product_name} · {requestId}
      </Text>

      {detail?.eligibility?.requiresOverride && (
        <Box backgroundColor="warning1" borderRadius={2} padding={4} marginBottom={5}>
          <Text size={3} fontWeight="bold" display="block">
            ⚠ Override Required
          </Text>
          <Text size={3} color="default2">
            Reasons: {detail.eligibility.overrideReasons.join(", ")}
          </Text>
        </Box>
      )}

      {/* Variant grid */}
      <Box display="flex" flexWrap="wrap" gap={3} marginBottom={6}>
        {variants.length === 0 ? (
          <Text color="default2">No variants found</Text>
        ) : (
          variants.map(v => {
            const isCurrentSize = v.id === detail?.product_variant_id;
            const isSelected = v.id === selectedVariantId;
            const outOfStock = v.quantityAvailable === 0;
            const sizeAttr = (v.attributes || []).find(
              (a: any) => a.attribute?.name?.toLowerCase() === "size",
            );
            const sizeLabel: string = sizeAttr?.values?.[0]?.name || v.name;

            return (
              <Box
                key={v.id}
                borderWidth={1}
                borderStyle="solid"
                borderColor={isSelected ? "accent1" : "default1"}
                borderRadius={2}
                padding={3}
                __minWidth={80}
                textAlign="center"
                onClick={() => !outOfStock && setSelectedVariantId(v.id)}
                style={{
                  cursor: outOfStock ? "not-allowed" : "pointer",
                  opacity: outOfStock ? 0.4 : 1,
                }}
              >
                <Text size={3} fontWeight={isSelected ? "bold" : "regular"}>
                  {sizeLabel}
                </Text>
                {isCurrentSize && !outOfStock && (
                  <Text size={2} color="default2" display="block">
                    Current ({v.quantityAvailable} avail)
                  </Text>
                )}
                {isCurrentSize && outOfStock && (
                  <Text size={2} color="critical1" display="block">
                    Current · Out of stock
                  </Text>
                )}
                {!isCurrentSize && outOfStock && (
                  <Text size={2} color="critical1" display="block">
                    Out of stock
                  </Text>
                )}
                {!isCurrentSize && !outOfStock && (
                  <Text size={2} color="success1" display="block">
                    {v.quantityAvailable} avail
                  </Text>
                )}
              </Box>
            );
          })
        )}
      </Box>

      {detail?.eligibility?.requiresOverride && (
        <Box marginBottom={5}>
          <Text size={3} display="block" marginBottom={2}>
            Override Reason *
          </Text>
          <Box
            as="textarea"
            rows={2}
            value={overrideReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setOverrideReason(e.target.value)
            }
            placeholder="Enter reason for override..."
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              fontFamily: "inherit",
              fontSize: "14px",
            }}
          />
        </Box>
      )}

      {error && (
        <Text color="critical1" size={3} display="block" marginBottom={4}>
          {error}
        </Text>
      )}

      <Box display="flex" gap={3} justifyContent="flex-end">
        <Button variant="secondary" onClick={() => navigate(requestDetailPath(requestId))}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={submitting || !selectedVariantId}
        >
          <CheckCircle size={14} />
          {submitting ? "Creating Order..." : "Confirm Exchange"}
        </Button>
      </Box>
    </Box>
  );
};
