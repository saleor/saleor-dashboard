import { useUser } from "@dashboard/auth/useUser";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Input, Select, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchCallLogs, fetchReturn, submitLogCall } from "../api/returnsApi";
import { SLABadge } from "../components/SLABadge";
import { type CXCallLog, type CXReturnDetail } from "../types";
import { requestDetailPath } from "../urls";

interface LogCallViewProps {
  requestId: string;
}

const OUTCOME_OPTIONS = [
  { value: "", label: "Select outcome..." },
  { value: "Answered", label: "Answered" },
  { value: "No Answer", label: "No Answer" },
  { value: "Busy", label: "Busy" },
  { value: "Callback Requested", label: "Callback Requested" },
];

const USER_ACTION_OPTIONS = [
  { value: "", label: "— Select customer decision —" },
  { value: "Agreed to exchange", label: "Agreed to exchange" },
  { value: "Disagreed to exchange", label: "Disagreed to exchange" },
  { value: "User Unreachable", label: "User Unreachable" },
];

const MAX_NOTES = 1000;

export const LogCallView = ({ requestId }: LogCallViewProps) => {
  const navigate = useNavigator();
  const { user } = useUser();
  const [detail, setDetail] = useState<CXReturnDetail | null>(null);
  const [callLogs, setCallLogs] = useState<CXCallLog[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(true);

  const [outcome, setOutcome] = useState("");
  const [userAction, setUserAction] = useState("");
  const [notes, setNotes] = useState("");
  const [callbackDate, setCallbackDate] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agentId = user?.id || "unknown";
  const agentName = user?.email || "CX Agent";

  useEffect(() => {
    const load = async () => {
      setLoadingDetail(true);

      try {
        const [det, logs] = await Promise.all([fetchReturn(requestId), fetchCallLogs(requestId)]);

        setDetail(det);
        setCallLogs(logs);
      } catch {
        // silently continue — form still works without context
      } finally {
        setLoadingDetail(false);
      }
    };

    load();
  }, [requestId]);

  const nextCallNumber = callLogs.length + 1;
  const showUserAction = outcome === "Answered";
  const showCallback = outcome === "Callback Requested";

  const handleSubmit = async () => {
    if (!outcome) {
      setError("Please select an outcome");

      return;
    }

    if (!notes.trim()) {
      setError("Please enter call notes");

      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitLogCall(requestId, {
        outcome,
        user_action: userAction || undefined,
        notes,
        callback_date: callbackDate || undefined,
        callback_time: callbackTime || undefined,
        cx_agent_id: agentId,
        cx_agent_name: agentName,
      });
      navigate(requestDetailPath(requestId));
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <Box padding={6}>
      <Button
        variant="secondary"
        size="small"
        onClick={() => navigate(requestDetailPath(requestId))}
        marginBottom={4}
      >
        <ArrowLeft size={14} />
        {requestId}
      </Button>

      {/* Header breadcrumb area */}
      <Box display="flex" alignItems="center" gap={3} marginBottom={6}>
        <Text size={8} fontWeight="bold">
          Call Log
        </Text>
        {detail && (
          <>
            <Box
              borderRadius={2}
              paddingX={2}
              paddingY={1}
              style={{ background: "#ede9fe", color: "#7c3aed", fontSize: "12px", fontWeight: 600 }}
            >
              {detail.cx_status.replace(/_/g, " ")}
            </Box>
            {detail.auto_approval_due_at && (
              <SLABadge tier={detail.sla_tier} hoursRemaining={detail.sla_hours_remaining} />
            )}
          </>
        )}
      </Box>

      <Box display="grid" gap={6} __gridTemplateColumns="1fr 280px">
        {/* ── Left: existing logs + form ── */}
        <Box>
          {/* Previous call logs (if any) */}
          {loadingDetail ? (
            <Skeleton __height={60} marginBottom={4} />
          ) : callLogs.length === 0 ? (
            <Box
              padding={4}
              marginBottom={5}
              borderRadius={2}
              style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <Text size={3} color="default2">
                No calls logged yet. Use the form below to log the first call attempt.
              </Text>
            </Box>
          ) : (
            <Box marginBottom={5} display="flex" flexDirection="column" gap={3}>
              {callLogs.map(log => (
                <Box
                  key={log.id}
                  borderWidth={1}
                  borderColor="default1"
                  borderStyle="solid"
                  borderRadius={2}
                  padding={4}
                >
                  <Box display="flex" justifyContent="space-between" marginBottom={2}>
                    <Text size={3} fontWeight="bold">
                      CALL {log.call_number} ·{" "}
                      {new Date(log.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    <Text size={2} color="default2">
                      {log.cx_agent_name}
                    </Text>
                  </Box>
                  <Box display="flex" gap={4}>
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
                          color={log.user_action === "Agreed to exchange" ? "success1" : "default1"}
                        >
                          {log.user_action}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Text size={3} color="default2" display="block" marginTop={2}>
                    {log.notes}
                  </Text>
                </Box>
              ))}
            </Box>
          )}

          {/* Form */}
          <Box
            borderWidth={1}
            borderColor="default1"
            borderStyle="solid"
            borderRadius={3}
            padding={5}
          >
            <Text size={4} fontWeight="bold" display="block" marginBottom={4}>
              Log Call — Call {nextCallNumber}
            </Text>

            <Box display="flex" flexDirection="column" gap={4}>
              {/* Outcome */}
              <Box>
                <Text size={3} display="block" marginBottom={2} fontWeight="bold">
                  Outcome *
                </Text>
                <Select
                  value={outcome}
                  onChange={v => {
                    setOutcome(v as string);

                    if (v !== "Answered") setUserAction("");
                  }}
                  options={OUTCOME_OPTIONS}
                />
              </Box>

              {/* User Action (only when Answered) */}
              {showUserAction && (
                <>
                  <Box>
                    <Text size={3} display="block" marginBottom={2} fontWeight="bold">
                      User Action{" "}
                      <Text size={2} color="default2" fontWeight="regular">
                        (required when Outcome = Answered)
                      </Text>
                    </Text>
                    <Select
                      value={userAction}
                      onChange={v => setUserAction(v as string)}
                      options={USER_ACTION_OPTIONS}
                    />
                  </Box>

                  {/* Tips */}
                  <Box
                    borderRadius={2}
                    padding={4}
                    style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
                  >
                    <Text
                      size={2}
                      color="default2"
                      fontWeight="bold"
                      display="block"
                      marginBottom={2}
                    >
                      TIPS & GUIDELINES
                    </Text>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text size={2} color="success1">
                        ✓ Agreed to exchange → &quot;Convert to Exchange&quot; unlocks on the
                        request detail page.
                      </Text>
                      <Text size={2} color="critical1">
                        ✗ Disagreed → &quot;Approve Return&quot; becomes the primary action.
                      </Text>
                      <Text size={2} color="critical1">
                        ✗ No Answer / Busy → Log at least 2 call attempts before &quot;Approve
                        Return&quot; becomes available.
                      </Text>
                    </Box>
                  </Box>
                </>
              )}

              {/* Callback fields */}
              {showCallback && (
                <Box display="flex" gap={4}>
                  <Box __flexGrow="1">
                    <Text size={3} display="block" marginBottom={2} fontWeight="bold">
                      Callback Date
                    </Text>
                    <Input
                      type="date"
                      value={callbackDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCallbackDate(e.target.value)
                      }
                    />
                  </Box>
                  <Box __flexGrow="1">
                    <Text size={3} display="block" marginBottom={2} fontWeight="bold">
                      Callback Time
                    </Text>
                    <Input
                      type="time"
                      value={callbackTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCallbackTime(e.target.value)
                      }
                    />
                  </Box>
                </Box>
              )}

              {/* Notes */}
              <Box>
                <Box display="flex" justifyContent="space-between" marginBottom={2}>
                  <Text size={3} fontWeight="bold">
                    Notes *
                  </Text>
                  <Text size={2} color="default2">
                    {notes.length} / {MAX_NOTES}
                  </Text>
                </Box>
                <Box
                  as="textarea"
                  rows={5}
                  value={notes}
                  maxLength={MAX_NOTES}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  placeholder="Enter call notes..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </Box>

              {error && (
                <Text color="critical1" size={3}>
                  {error}
                </Text>
              )}

              {/* Save note */}
              <Text size={2} color="default2" style={{ fontStyle: "italic" }}>
                Saving this call will: reset the 24h auto-approval timer · transition status to
                CX_REVIEW (first action) · append to call log.
              </Text>

              <Box display="flex" gap={3} justifyContent="flex-end">
                <Button variant="secondary" onClick={() => navigate(requestDetailPath(requestId))}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Saving..." : "Save Call Log"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Right sidebar: request context ── */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Customer */}
          {detail && (
            <Box
              borderWidth={1}
              borderColor="default1"
              borderStyle="solid"
              borderRadius={3}
              padding={4}
            >
              <Text size={2} color="default2" fontWeight="bold" display="block" marginBottom={2}>
                CUSTOMER
              </Text>
              <Text size={4} fontWeight="bold" display="block">
                {detail.customer_name || "—"}
              </Text>
              {detail.customer_phone && (
                <Text size={3} color="default2" display="block">
                  {detail.customer_phone}
                </Text>
              )}
            </Box>
          )}

          {/* Request summary */}
          {detail && (
            <Box
              borderWidth={1}
              borderColor="default1"
              borderStyle="solid"
              borderRadius={3}
              padding={4}
            >
              <Text size={2} color="default2" fontWeight="bold" display="block" marginBottom={3}>
                REQUEST
              </Text>
              <Text size={3} display="block" marginBottom={1}>
                {requestId} · Order #{detail.saleor_order_number}
              </Text>
              {detail.auto_approval_due_at && (
                <Box marginBottom={2}>
                  <Text size={2} color="default2" fontWeight="bold" display="block">
                    SLA REMAINING
                  </Text>
                  <SLABadge tier={detail.sla_tier} hoursRemaining={detail.sla_hours_remaining} />
                </Box>
              )}
              {detail.return_reason && (
                <Box marginBottom={2}>
                  <Text size={2} color="default2" fontWeight="bold" display="block">
                    RETURN REASON
                  </Text>
                  <Text size={3}>{detail.return_reason}</Text>
                </Box>
              )}
              {detail.product_name && (
                <Box>
                  <Text size={2} color="default2" fontWeight="bold" display="block">
                    PRODUCT
                  </Text>
                  <Text size={3}>
                    {detail.product_name}
                    {detail.product_size ? ` · ${detail.product_size}` : ""}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Form guide */}
          <Box
            borderWidth={1}
            borderColor="default1"
            borderStyle="solid"
            borderRadius={3}
            padding={4}
          >
            <Text size={2} color="default2" fontWeight="bold" display="block" marginBottom={2}>
              FORM GUIDE
            </Text>
            <Box display="flex" flexDirection="column" gap={1}>
              <Text size={2}>
                <Text size={2} fontWeight="bold">
                  Answered
                </Text>{" "}
                → User Action + Notes required
              </Text>
              <Text size={2}>
                <Text size={2} fontWeight="bold">
                  No Answer
                </Text>{" "}
                → Notes required
              </Text>
              <Text size={2}>
                <Text size={2} fontWeight="bold">
                  Busy
                </Text>{" "}
                → Notes required
              </Text>
              <Text size={2}>
                <Text size={2} fontWeight="bold">
                  Callback Requested
                </Text>{" "}
                → Date + Time + Notes required
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
