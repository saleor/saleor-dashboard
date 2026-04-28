import { useUser } from "@dashboard/auth/useUser";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getUserName } from "@dashboard/misc";
import { Box, Button, Input, Select, Skeleton, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";

import {
  fetchProductVariantsForMX,
  lookupOrderForMX,
  submitManualExchange,
} from "../api/manualExchangeApi";
import {
  manualExchangeListPath,
  manualExchangeNewOrderPath,
  manualExchangeNewSizePath,
} from "../urls";

interface ManualExchangeNewViewProps {
  orderId?: string;
  variantSku?: string;
}

const OVERRIDE_REASONS = [
  { value: "Customer received defective item", label: "Customer received defective item" },
  { value: "Wrong item delivered", label: "Wrong item delivered" },
  { value: "Customer goodwill gesture", label: "Customer goodwill gesture" },
  { value: "Policy exception approved", label: "Policy exception approved" },
];

function daysAgoLabel(deliveredAt: string | null, daysSinceDelivery: number | null): string {
  if (!deliveredAt) return "";

  const date = new Date(deliveredAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (daysSinceDelivery === null) return date;

  if (daysSinceDelivery === 0) return `${date} (today)`;

  return `${date} (${daysSinceDelivery} day${daysSinceDelivery === 1 ? "" : "s"} ago)`;
}

function WindowBadge({ item }: { item: any }) {
  if (!item.isFulfilled) return null;

  if (item.withinWindow) {
    return (
      <Box
        as="span"
        borderRadius={2}
        paddingX={2}
        paddingY={1}
        style={{
          background: "#dcfce7",
          color: "#16a34a",
          fontSize: "11px",
          fontWeight: 600,
          display: "inline-block",
        }}
      >
        Within window ({item.daysRemaining}d left)
      </Box>
    );
  }

  const over = item.daysSinceDelivery !== null ? item.daysSinceDelivery - item.windowDays : 0;

  return (
    <Box
      as="span"
      borderRadius={2}
      paddingX={2}
      paddingY={1}
      style={{
        background: "#fee2e2",
        color: "#dc2626",
        fontSize: "11px",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      Window expired ({over}d over)
    </Box>
  );
}

function ExchangeabilityBadge({ item }: { item: any }) {
  if (!item.isFulfilled) return null;

  if (!item.isExchangeable) {
    return (
      <Box
        as="span"
        borderRadius={2}
        paddingX={2}
        paddingY={1}
        style={{
          background: "#fef3c7",
          color: "#92400e",
          fontSize: "11px",
          fontWeight: 600,
          display: "inline-block",
        }}
      >
        is_exchangeable = false
      </Box>
    );
  }

  return (
    <Box
      as="span"
      borderRadius={2}
      paddingX={2}
      paddingY={1}
      style={{
        background: "#dcfce7",
        color: "#16a34a",
        fontSize: "11px",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      is_exchangeable = true
    </Box>
  );
}

// ─── Override modal ───────────────────────────────────────────────────────────

interface OverrideModalProps {
  item: any;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

function OverrideModal({ item, onCancel, onConfirm }: OverrideModalProps) {
  const [reason, setReason] = useState(OVERRIDE_REASONS[0].value);
  const [confirmed, setConfirmed] = useState(false);

  const overrideLabel = item.overrideReasons?.includes("not_exchangeable")
    ? "Product Not Exchange-Eligible"
    : "Exchange Window Exceeded";

  const overrideDetail = item.overrideReasons?.includes("not_exchangeable")
    ? `is_exchangeable = false in Saleor product metadata. This product variant is not marked as eligible for exchange.`
    : `${item.windowDays}-day window exceeded by ${item.daysSinceDelivery - item.windowDays} days.`;

  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        backgroundColor="default1"
        borderRadius={3}
        padding={6}
        style={{ width: 480, maxWidth: "90vw" }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" gap={3} marginBottom={4}>
          <AlertTriangle size={20} style={{ color: "#b45309" }} />
          <Text size={5} fontWeight="bold">
            {overrideLabel}
          </Text>
        </Box>

        {/* Detail box */}
        <Box
          borderRadius={2}
          padding={4}
          marginBottom={4}
          style={{ background: "#fef3c7", border: "1px solid #fcd34d" }}
        >
          <Text size={3} fontWeight="bold" display="block" marginBottom={1}>
            {item.productName}
            {item.size ? ` · ${item.size}` : ""}
            {item.colour ? ` · ${item.colour}` : ""}
          </Text>
          <Text size={3}>{overrideDetail}</Text>
        </Box>

        <Text size={3} color="default2" display="block" marginBottom={4}>
          As a CX agent, you can override this restriction for manual exchanges where a customer has
          a valid reason. This action will be{" "}
          <Text size={3} fontWeight="bold">
            permanently logged
          </Text>{" "}
          to the audit trail with your agent ID and timestamp.
        </Text>

        {/* Override reason */}
        <Text size={3} fontWeight="bold" display="block" marginBottom={2}>
          Override reason{" "}
          <Text size={3} color="critical1">
            *
          </Text>
        </Text>
        <Box marginBottom={4}>
          <Select
            value={reason}
            onChange={v => setReason(v as string)}
            options={OVERRIDE_REASONS}
          />
        </Box>

        {/* Confirmation checkbox */}
        <Box
          borderRadius={2}
          padding={3}
          marginBottom={5}
          display="flex"
          alignItems="flex-start"
          gap={3}
          style={{ border: "1px solid #e5e7eb", cursor: "pointer" }}
          onClick={() => setConfirmed(c => !c)}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            style={{ marginTop: 2, cursor: "pointer" }}
          />
          <Text size={3}>
            I confirm I am overriding the restriction. This will be logged with my agent ID.
          </Text>
        </Box>

        <Box display="flex" gap={3} justifyContent="flex-end">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onConfirm(reason)}
            disabled={!confirmed}
            style={{ background: confirmed ? "#b45309" : undefined }}
          >
            Confirm Override & Exchange →
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export const ManualExchangeNewView = ({ orderId, variantSku }: ManualExchangeNewViewProps) => {
  const navigate = useNavigator();
  const { user } = useUser();

  const agentId = user?.id || "unknown";
  const agentName = getUserName(user, true) || "CX Agent";

  // Step 1
  const [orderInput, setOrderInput] = useState(orderId || "");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Step 2
  const [orderData, setOrderData] = useState<any>(null);
  const [overrideModalItem, setOverrideModalItem] = useState<any>(null);

  // Step 3
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedOverrideReason, setSelectedOverrideReason] = useState<string | undefined>();
  const [allVariants, setAllVariants] = useState<any[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [selectedColour, setSelectedColour] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load order when orderId in URL
  useEffect(() => {
    if (!orderId) return;

    const load = async () => {
      setLookupLoading(true);
      setLookupError(null);

      try {
        const data = await lookupOrderForMX(orderId, agentId);

        setOrderData(data);

        if (variantSku && data?.items) {
          // Match by variantId first (unique), fall back to productSku
          const item = data.items.find(
            (i: any) => i.variantId === variantSku || i.productSku === variantSku,
          );

          if (item) setSelectedItem(item);
        }
      } catch (err: any) {
        setLookupError(err.message);
      } finally {
        setLookupLoading(false);
      }
    };

    load();
  }, [orderId, variantSku, agentId]);

  // Load variants when item selected (step 3)
  useEffect(() => {
    if (!selectedItem?.productId) return;

    setVariantsLoading(true);
    setAllVariants([]);
    setSelectedVariantId(null);
    fetchProductVariantsForMX(selectedItem.productId)
      .then(variants => {
        setAllVariants(variants);

        // Default colour to item's colour
        const itemColour = selectedItem.colour || "";

        setSelectedColour(itemColour);
      })
      .catch(() => {})
      .finally(() => setVariantsLoading(false));
  }, [selectedItem]);

  // Variants are locked to the original item's colour — only same-colour
  // variants surface as exchangeable sizes. Case-insensitive match defends
  // against attribute-value casing mismatches between the order line and the
  // product variant attribute.
  const sizeVariants = allVariants.filter(v => {
    const colourAttr = (v.attributes || []).find(
      (a: any) =>
        a.attribute?.name?.toLowerCase() === "color" ||
        a.attribute?.name?.toLowerCase() === "colour",
    );
    const col: string = colourAttr?.values?.[0]?.name || "";

    return col.toLowerCase() === (selectedColour || "").toLowerCase();
  });

  const selectedVariant = sizeVariants.find(v => v.id === selectedVariantId);
  const selectedVariantName = sizeVariants.find(v => v.id === selectedVariantId)?.name || "";

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleOrderLookup = async () => {
    if (!orderInput.trim()) {
      setLookupError("Enter an order number (e.g. 62598)");

      return;
    }

    setLookupLoading(true);
    setLookupError(null);

    try {
      const data = await lookupOrderForMX(orderInput.trim(), agentId);

      setOrderData(data);
      navigate(manualExchangeNewOrderPath(orderInput.trim()));
    } catch (err: any) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSelectItem = (item: any, overrideReason?: string) => {
    setSelectedItem(item);
    setSelectedOverrideReason(overrideReason);
    // Use variantId (unique per item) so the effect re-fetch finds the exact same item
    navigate(manualExchangeNewSizePath(orderId!, item.variantId || item.productSku));
  };

  const handleItemClick = (item: any) => {
    if (!item.isFulfilled) return; // Cannot exchange unfulfilled

    if (item.requiresOverride) {
      setOverrideModalItem(item);
    } else {
      handleSelectItem(item);
    }
  };

  const handleConfirm = async () => {
    if (!selectedVariantId || !selectedItem || !orderData) {
      setSubmitError("Please select a replacement size");

      return;
    }

    if (!selectedItem.fulfillmentId || !selectedItem.fulfillmentLineId) {
      setSubmitError("This item does not have fulfillment data required to create an exchange");

      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const replacementVariant = sizeVariants.find(v => v.id === selectedVariantId);
    const replacementSizeAttr = (replacementVariant?.attributes || []).find(
      (a: any) => a.attribute?.name?.toLowerCase() === "size",
    );
    const replacementSize: string = replacementSizeAttr?.values?.[0]?.name || "";

    try {
      await submitManualExchange({
        orderId: orderData.orderId,
        orderNumber: String(orderData.orderNumber),
        fulfillmentId: selectedItem.fulfillmentId,
        fulfillmentLineId: selectedItem.fulfillmentLineId,
        itemVariantId: selectedItem.variantId,
        newVariantId: selectedVariantId,
        overrideReason: selectedOverrideReason,
        itemName: selectedItem.productName,
        itemSku: selectedItem.productSku,
        itemSize: selectedItem.size,
        itemColour: selectedItem.colour,
        replacementSize,
        replacementColour: selectedColour,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        agentId,
        agentName,
      });
      navigate(manualExchangeListPath);
    } catch (err: any) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  // ─── Step 1: Order lookup ─────────────────────────────────────────────────

  if (!orderId) {
    return (
      <Box padding={6} __maxWidth={600}>
        <Button
          variant="secondary"
          size="small"
          onClick={() => navigate(manualExchangeListPath)}
          marginBottom={4}
        >
          <ArrowLeft size={14} /> Back
        </Button>
        <Text size={8} fontWeight="bold" display="block" marginBottom={2}>
          Manual Exchange
        </Text>
        <Text size={3} color="default2" display="block" marginBottom={6}>
          Step 1 of 3 — Look up the customer&apos;s order
        </Text>
        <Box display="flex" gap={3} marginBottom={4}>
          <Box __flexGrow="1">
            <Input
              label="Enter order number (e.g. 62598)"
              value={orderInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleOrderLookup()}
            />
          </Box>
          <Button variant="primary" onClick={handleOrderLookup} disabled={lookupLoading}>
            <Search size={14} /> {lookupLoading ? "Looking up..." : "Look up"}
          </Button>
        </Box>
        {lookupError && (
          <Text color="critical1" size={3}>
            {lookupError}
          </Text>
        )}
      </Box>
    );
  }

  if (lookupLoading)
    return (
      <Box padding={6}>
        <Skeleton __height={300} />
      </Box>
    );

  if (lookupError || !orderData) {
    return (
      <Box padding={6}>
        <Text color="critical1">{lookupError || "Order not found"}</Text>
        <Box marginTop={3}>
          <Button variant="secondary" onClick={() => navigate(manualExchangeListPath + "/new")}>
            Try again
          </Button>
        </Box>
      </Box>
    );
  }

  // ─── Step 2: Item selection ───────────────────────────────────────────────

  if (!variantSku || !selectedItem) {
    const fmtPrice = (amount: number, currency = "INR") =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount);

    return (
      <Box padding={6}>
        {overrideModalItem && (
          <OverrideModal
            item={overrideModalItem}
            onCancel={() => setOverrideModalItem(null)}
            onConfirm={reason => {
              setOverrideModalItem(null);
              handleSelectItem(overrideModalItem, reason);
            }}
          />
        )}

        <Button
          variant="secondary"
          size="small"
          onClick={() => navigate(manualExchangeListPath + "/new")}
          marginBottom={4}
        >
          <ArrowLeft size={14} /> Back
        </Button>

        {/* Header */}
        <Box display="flex" alignItems="baseline" gap={2} marginBottom={1}>
          <Text size={8} fontWeight="bold">
            Order #{orderData.orderNumber}
          </Text>
          <Box
            borderRadius={2}
            paddingX={2}
            paddingY={1}
            style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "11px", fontWeight: 600 }}
          >
            {orderData.orderStatus?.replace(/_/g, " ")}
          </Box>
        </Box>
        <Text size={3} color="default2" display="block" marginBottom={1}>
          {orderData.orderCreated
            ? new Date(orderData.orderCreated).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : ""}
        </Text>

        {/* Customer */}
        <Box marginBottom={4}>
          <Text size={3} fontWeight="bold">
            {orderData.customerName || "—"}
          </Text>
          {orderData.customerEmail && (
            <Text size={3} color="default2">
              {" "}
              · {orderData.customerEmail}
            </Text>
          )}
          {orderData.customerPhone && (
            <Text size={3} color="default2">
              {" "}
              · {orderData.customerPhone}
            </Text>
          )}
        </Box>

        <Text size={3} color="default2" fontWeight="bold" display="block" marginBottom={3}>
          SELECT AN ITEM TO EXCHANGE
        </Text>

        <Box display="flex" flexDirection="column" gap={3}>
          {(orderData.items || []).map((item: any, i: number) => {
            const canExchange = item.isFulfilled && !item.orderStatus && !item.cxReturnRequestId;
            const eligible = canExchange && !item.requiresOverride;
            const needsOverride = canExchange && item.requiresOverride;

            // Disabled-row hint precedence: an existing CX return request is
            // the most actionable signal (points the agent at the linked
            // REQ-id), then an in-flight delivery status, then the generic
            // "not yet delivered" placeholder.
            let ctaText = "Cannot Exchange";
            let ctaHelper: string;

            if (item.cxReturnRequestId) {
              ctaHelper = `Return: ${item.cxReturnRequestId}${
                item.cxReturnStatus ? ` · ${String(item.cxReturnStatus).replace(/_/g, " ")}` : ""
              }`;
            } else if (item.orderStatus) {
              ctaHelper = `Status: ${String(item.orderStatus).replace(/_/g, " ")}`;
            } else {
              ctaHelper = "Item not yet delivered";
            }

            if (eligible) {
              ctaText = "Exchange → Select Size";
              ctaHelper = "Eligible — no override needed";
            }

            if (needsOverride) {
              ctaText = "Override & Exchange";
              ctaHelper = item.overrideReasons?.includes("not_exchangeable")
                ? "Product not marked exchangeable"
                : `${item.windowDays}-day window exceeded by ${item.daysSinceDelivery - item.windowDays} days`;
            }

            return (
              <Box
                key={i}
                borderWidth={1}
                borderColor="default1"
                borderStyle="solid"
                borderRadius={3}
                padding={4}
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                style={{ opacity: canExchange ? 1 : 0.6 }}
              >
                {/* Left: product info */}
                <Box __flexGrow="1" marginRight={4}>
                  <Text size={4} fontWeight="bold" display="block" marginBottom={1}>
                    {item.productName}
                  </Text>
                  <Text size={2} color="default2" display="block" marginBottom={2}>
                    {[
                      item.size && `SIZE: ${item.size}`,
                      item.colour && `COLOUR: ${item.colour}`,
                      item.productSku && `SKU: ${item.productSku}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>

                  {/* Badges row */}
                  <Box display="flex" flexWrap="wrap" gap={2} marginBottom={2}>
                    <Box
                      as="span"
                      borderRadius={2}
                      paddingX={2}
                      paddingY={1}
                      style={{
                        background: item.isFulfilled ? "#dcfce7" : "#f3f4f6",
                        color: item.isFulfilled ? "#16a34a" : "#6b7280",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      {item.isFulfilled ? "Fulfilled" : "Unfulfilled"}
                    </Box>
                    <ExchangeabilityBadge item={item} />
                    <WindowBadge item={item} />
                  </Box>

                  {item.deliveredAt && (
                    <Text size={2} color="default2" display="block">
                      DELIVERED: {daysAgoLabel(item.deliveredAt, item.daysSinceDelivery)}
                    </Text>
                  )}
                  {!item.isFulfilled && (
                    <Text size={2} color="default2" display="block">
                      {item.cxReturnRequestId
                        ? `Return: ${item.cxReturnRequestId}${
                            item.cxReturnStatus
                              ? ` · ${String(item.cxReturnStatus).replace(/_/g, " ")}`
                              : ""
                          }`
                        : item.orderStatus
                          ? `Status: ${String(item.orderStatus).replace(/_/g, " ")}`
                          : "Not yet delivered"}
                    </Text>
                  )}
                </Box>

                {/* Right: price + CTA */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                  gap={2}
                  style={{ minWidth: 170 }}
                >
                  <Text size={4} fontWeight="bold">
                    {fmtPrice(item.unitPrice ?? 0, item.currency)}
                  </Text>
                  <Text size={2} color="default2">
                    Qty: {item.quantity}
                  </Text>

                  {canExchange ? (
                    <Button
                      variant={eligible ? "primary" : "secondary"}
                      size="small"
                      onClick={() => handleItemClick(item)}
                      style={
                        needsOverride ? { color: "#b45309", borderColor: "#b45309" } : undefined
                      }
                    >
                      {ctaText}
                    </Button>
                  ) : (
                    <Box
                      borderRadius={2}
                      paddingX={3}
                      paddingY={2}
                      style={{
                        background: "#f3f4f6",
                        color: "#9ca3af",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Cannot Exchange
                    </Box>
                  )}

                  <Text
                    size={2}
                    color={eligible ? "success1" : needsOverride ? "default2" : "default2"}
                    style={{ textAlign: "right", fontStyle: "italic" }}
                  >
                    {ctaHelper}
                  </Text>
                </Box>
              </Box>
            );
          })}

          {(!orderData.items || orderData.items.length === 0) && (
            <Text color="default2">No items found in this order</Text>
          )}
        </Box>
      </Box>
    );
  }

  // ─── Step 3: Select replacement size ─────────────────────────────────────

  return (
    <Box padding={6} __maxWidth={640}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" gap={2} marginBottom={1}>
        <Text
          size={2}
          color="default2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(manualExchangeListPath)}
        >
          Manual Exchange
        </Text>
        <Text size={2} color="default2">
          {" "}
          /{" "}
        </Text>
        <Text
          size={2}
          color="default2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(manualExchangeNewOrderPath(orderId))}
        >
          Order #{orderData.orderNumber}
        </Text>
        <Text size={2} color="default2">
          {" "}
          /{" "}
        </Text>
        <Text size={2} fontWeight="bold">
          Select Replacement
        </Text>
      </Box>

      <Text size={3} color="default2" display="block" marginBottom={4}>
        {selectedItem.productName}
        {selectedItem.size ? ` · ${selectedItem.size}` : ""}
        {selectedItem.colour ? ` · ${selectedItem.colour}` : ""}
      </Text>

      {/* Info banner */}
      <Box
        borderRadius={2}
        padding={4}
        marginBottom={5}
        style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
      >
        <Text size={3} color="default2">
          Manual exchange: no eligibility or window check applies at this step. Stock is verified
          before order creation.
        </Text>
      </Box>

      {/* Section header */}
      <Box borderWidth={1} borderColor="default1" borderStyle="solid" borderRadius={3} padding={5}>
        <Text size={4} fontWeight="bold" display="block" marginBottom={4}>
          {selectedItem.productName} — Select Replacement Variant
        </Text>

        {variantsLoading ? (
          <Skeleton __height={200} />
        ) : (
          <>
            {/* Colour — disabled; locked to the original item's colour */}
            {selectedColour && (
              <Box marginBottom={5}>
                <Text size={3} fontWeight="bold" display="block" marginBottom={2}>
                  Colour
                </Text>
                <Select
                  value={selectedColour}
                  onChange={() => undefined}
                  options={[{ value: selectedColour, label: selectedColour }]}
                  disabled
                />
              </Box>
            )}

            {/* Size grid (variants are restricted to the original item's colour) */}
            <Box marginBottom={5}>
              <Text size={3} fontWeight="bold" display="block" marginBottom={2}>
                Size{" "}
                <Text size={3} color="critical1">
                  *
                </Text>
              </Text>
              <Box display="flex" flexWrap="wrap" gap={3}>
                {sizeVariants.length === 0 ? (
                  <Text color="default2" size={3}>
                    No sizes available for this colour
                  </Text>
                ) : (
                  sizeVariants.map((v: any) => {
                    const outOfStock = (v.quantityAvailable ?? 0) === 0;
                    const isSelected = v.id === selectedVariantId;
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
                        __minWidth={100}
                        textAlign="center"
                        onClick={() => !outOfStock && setSelectedVariantId(v.id)}
                        style={{
                          cursor: outOfStock ? "default" : "pointer",
                          opacity: outOfStock ? 0.5 : 1,
                          background: isSelected ? "#1a1a1a" : outOfStock ? "transparent" : "white",
                          borderStyle: outOfStock ? "dashed" : "solid",
                        }}
                      >
                        <Text
                          size={3}
                          fontWeight={isSelected ? "bold" : "regular"}
                          style={{ color: isSelected ? "white" : "inherit" }}
                        >
                          {sizeLabel}
                        </Text>
                        <Text
                          size={2}
                          display="block"
                          style={{
                            color: isSelected ? "#d1d5db" : outOfStock ? "#9ca3af" : "#6b7280",
                          }}
                        >
                          {outOfStock ? "Out of stock" : `In stock (${v.quantityAvailable})`}
                        </Text>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>

            {/* Selected indicator */}
            {selectedVariant && (
              <Box
                borderRadius={2}
                padding={3}
                marginBottom={4}
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <Text size={3} color="success1">
                  ✓ Selected: {selectedVariantName} / {selectedColour} · In stock (
                  {selectedVariant.quantityAvailable} units)
                </Text>
              </Box>
            )}

            {submitError && (
              <Text color="critical1" size={3} display="block" marginBottom={3}>
                {submitError}
              </Text>
            )}

            <Box display="flex" gap={3}>
              <Button
                variant="secondary"
                onClick={() => navigate(manualExchangeNewOrderPath(orderId))}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={submitting || !selectedVariantId}
              >
                {submitting ? "Creating exchange..." : "Confirm Manual Exchange →"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
