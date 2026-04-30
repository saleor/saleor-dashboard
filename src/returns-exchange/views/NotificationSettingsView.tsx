import { useUser } from "@dashboard/auth/useUser";
import { Box, Button, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchNotificationSettings, saveNotificationSettings } from "../api/returnsApi";
import { type NotificationSettings } from "../types";

const DEFAULT_SETTINGS: NotificationSettings = {
  AT_RISK_EMAILS: [],
  AT_RISK_THRESHOLD: 5,
  CRITICAL_EMAILS: [],
  CRITICAL_THRESHOLD: 2,
  ERP_SYNC_EMAILS: [],
  AUTO_APPROVAL_EMAILS: [],
  EXCHANGE_ORDER_EMAILS: [],
  WEBHOOK_FAIL_EMAILS: [],
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_KEYS: Array<keyof NotificationSettings> = [
  "AT_RISK_EMAILS",
  "CRITICAL_EMAILS",
  "ERP_SYNC_EMAILS",
  "AUTO_APPROVAL_EMAILS",
  "EXCHANGE_ORDER_EMAILS",
  "WEBHOOK_FAIL_EMAILS",
];

export const NotificationSettingsView = () => {
  const { user } = useUser();
  const agentId = user?.id ?? null;

  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  // Raw text for each comma-separated email field, keyed by setting name.
  // We track this separately from `settings` because the canonical array form
  // (used at save time) drops trailing commas and whitespace — round-tripping
  // through it on every keystroke would eat the comma the user just typed.
  const [emailInputs, setEmailInputs] = useState<
    Partial<Record<keyof NotificationSettings, string>>
  >({});
  const [emailErrors, setEmailErrors] = useState<
    Partial<Record<keyof NotificationSettings, string[]>>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await fetchNotificationSettings();
        const merged = { ...DEFAULT_SETTINGS, ...data };

        setSettings(merged);

        // Seed the raw-text inputs from the loaded settings.
        const seeded: Partial<Record<keyof NotificationSettings, string>> = {};

        for (const key of EMAIL_KEYS) {
          seeded[key] = ((merged[key] as string[]) || []).join(", ");
        }

        setEmailInputs(seeded);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const parseEmails = (raw: string): string[] =>
    raw
      .split(",")
      .map(e => e.trim())
      .filter(Boolean);

  const handleSave = async () => {
    if (!agentId) {
      setError("Your user session is still loading. Please wait a moment.");

      return;
    }

    // Build the final settings payload from the raw inputs (single source of
    // truth at save time) and validate each list.
    const errs: Partial<Record<keyof NotificationSettings, string[]>> = {};
    const finalSettings: NotificationSettings = { ...settings };

    for (const key of EMAIL_KEYS) {
      const raw = emailInputs[key] ?? "";
      const list = parseEmails(raw);
      const bad = list.filter(e => !EMAIL_REGEX.test(e));

      if (bad.length > 0) errs[key] = bad;

      (finalSettings[key] as string[]) = list;
    }

    if (Object.keys(errs).length > 0) {
      setEmailErrors(errs);
      setError(
        "One or more recipient lists contain invalid email addresses. Fix them and try again.",
      );

      return;
    }

    setEmailErrors({});
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await saveNotificationSettings(finalSettings, agentId);
      setSettings(finalSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const setEmails = (key: keyof NotificationSettings, value: string) => {
    // Preserve the raw text exactly as the user typed it (commas, whitespace,
    // partial entries) so the input doesn't fight with their keystrokes.
    setEmailInputs(prev => ({ ...prev, [key]: value }));

    // Live-validate against a normalized snapshot, but don't write that
    // snapshot back to the input.
    const bad = parseEmails(value).filter(e => !EMAIL_REGEX.test(e));

    setEmailErrors(prev => {
      const next = { ...prev };

      if (bad.length > 0) next[key] = bad;
      else delete next[key];

      return next;
    });
  };

  const setThreshold = (key: keyof NotificationSettings, value: string) => {
    const num = parseInt(value, 10);

    if (!isNaN(num)) {
      setSettings(prev => ({ ...prev, [key]: num }));
    }
  };

  if (loading) {
    return (
      <Box padding={6}>
        <Skeleton __height={400} />
      </Box>
    );
  }

  return (
    <Box padding={6} __maxWidth={700}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={6}>
        <Box>
          <Text size={8} fontWeight="bold" display="block">
            Notification Settings
          </Text>
          <Text size={3} color="default2">
            Configure SLA alert and failure notification recipients
          </Text>
        </Box>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          <Save size={14} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </Button>
      </Box>

      {error && (
        <Text color="critical1" size={3} display="block" marginBottom={4}>
          {error}
        </Text>
      )}

      <Box display="flex" flexDirection="column" gap={6}>
        {/* SLA Alerts */}
        <Box
          borderWidth={1}
          borderColor="default1"
          borderStyle="solid"
          borderRadius={3}
          padding={5}
        >
          <Text size={5} fontWeight="bold" display="block" marginBottom={4}>
            SLA Alerts
          </Text>

          <Box display="flex" flexDirection="column" gap={4}>
            <Box>
              <Text size={3} display="block" marginBottom={1}>
                At Risk Alert Emails
              </Text>
              <Text size={2} color="default2" display="block" marginBottom={2}>
                Notified when requests are 3–6 hours from auto-approval (comma separated)
              </Text>
              <Input
                value={emailInputs.AT_RISK_EMAILS ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmails("AT_RISK_EMAILS", e.target.value)
                }
                placeholder="cx@example.com, manager@example.com"
              />
              {emailErrors.AT_RISK_EMAILS && (
                <Text size={2} color="critical1" display="block" marginTop={1}>
                  Invalid: {emailErrors.AT_RISK_EMAILS.join(", ")}
                </Text>
              )}
            </Box>

            <Box>
              <Text size={3} display="block" marginBottom={1}>
                At Risk Threshold
              </Text>
              <Text size={2} color="default2" display="block" marginBottom={2}>
                Minimum number of at-risk requests before sending alert
              </Text>
              <Input
                type="number"
                value={String(settings.AT_RISK_THRESHOLD)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setThreshold("AT_RISK_THRESHOLD", e.target.value)
                }
              />
            </Box>

            <Box>
              <Text size={3} display="block" marginBottom={1}>
                Critical Alert Emails
              </Text>
              <Text size={2} color="default2" display="block" marginBottom={2}>
                Notified when requests are under 3 hours from auto-approval (comma separated)
              </Text>
              <Input
                value={emailInputs.CRITICAL_EMAILS ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmails("CRITICAL_EMAILS", e.target.value)
                }
                placeholder="cx@example.com, manager@example.com"
              />
              {emailErrors.CRITICAL_EMAILS && (
                <Text size={2} color="critical1" display="block" marginTop={1}>
                  Invalid: {emailErrors.CRITICAL_EMAILS.join(", ")}
                </Text>
              )}
            </Box>

            <Box>
              <Text size={3} display="block" marginBottom={1}>
                Critical Threshold
              </Text>
              <Text size={2} color="default2" display="block" marginBottom={2}>
                Minimum number of critical requests before sending alert
              </Text>
              <Input
                type="number"
                value={String(settings.CRITICAL_THRESHOLD)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setThreshold("CRITICAL_THRESHOLD", e.target.value)
                }
              />
            </Box>
          </Box>
        </Box>

        {/* Failure Alerts */}
        <Box
          borderWidth={1}
          borderColor="default1"
          borderStyle="solid"
          borderRadius={3}
          padding={5}
        >
          <Text size={5} fontWeight="bold" display="block" marginBottom={4}>
            Failure Alerts (Engineering)
          </Text>

          <Box display="flex" flexDirection="column" gap={4}>
            {(
              [
                {
                  key: "ERP_SYNC_EMAILS" as keyof NotificationSettings,
                  label: "ERP Sync Failure Emails",
                  desc: "Notified when ERP sync fails after all retry attempts",
                },
                {
                  key: "AUTO_APPROVAL_EMAILS" as keyof NotificationSettings,
                  label: "Auto-Approval Worker Failure Emails",
                  desc: "Notified when the auto-approval cron job encounters an error",
                },
                {
                  key: "EXCHANGE_ORDER_EMAILS" as keyof NotificationSettings,
                  label: "Exchange Order Creation Failure Emails",
                  desc: "Notified when a replacement order fails to create in Saleor",
                },
                {
                  key: "WEBHOOK_FAIL_EMAILS" as keyof NotificationSettings,
                  label: "Return Ingestion Failure Emails",
                  desc: "Notified when a return webhook fails to process",
                },
              ] as const
            ).map(({ key, label, desc }) => (
              <Box key={key}>
                <Text size={3} display="block" marginBottom={1}>
                  {label}
                </Text>
                <Text size={2} color="default2" display="block" marginBottom={2}>
                  {desc}
                </Text>
                <Input
                  value={emailInputs[key] ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmails(key, e.target.value)
                  }
                  placeholder="eng@example.com, oncall@example.com"
                />
                {emailErrors[key] ? (
                  <Text size={2} color="critical1" display="block" marginTop={1}>
                    Invalid: {(emailErrors[key] ?? []).join(", ")}
                  </Text>
                ) : null}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" marginTop={5}>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          <Save size={14} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );
};
