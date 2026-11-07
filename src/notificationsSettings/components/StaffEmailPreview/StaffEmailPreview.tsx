import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { type IntlShape, useIntl } from "react-intl";

import { type TemplateMode } from "../../constants";
import { notificationsMessages } from "../../messages";
import styles from "./StaffEmailPreview.module.css";

interface StaffEmailPreviewProps {
  notificationId: string;
  subject: string;
  templateMode: TemplateMode;
  customTemplate: string;
}

interface DefaultPreviewContent {
  heading: string;
  paragraphs: string[];
  cta?: string;
}

const SAMPLE_REPLACEMENTS: Record<string, string> = {
  logo_url: "",
  password_set_url: "#",
  reset_url: "#",
  csv_link: "#",
  data_type: "products",
  "order.order_details_url": "#",
  "order.number": "1234",
  "order.details_url": "#",
  site_name: "Your store",
  domain: "yourstore.com",
  url: "#",
  "user.email": "colleague@example.com",
};

const getDefaultPreviewContent = (
  notificationId: string,
  intl: IntlShape,
): DefaultPreviewContent => {
  switch (notificationId) {
    case "staff-invite":
      return {
        heading: intl.formatMessage({
          id: "UJ6FkX",
          defaultMessage: "You’re in—welcome to Saleor Commerce!",
        }),
        paragraphs: [
          intl.formatMessage({
            id: "g3jUhb",
            defaultMessage:
              "Someone just added you to a Saleor project. That means you’ve got things to build, break, or ship (preferably in that order).",
          }),
          intl.formatMessage({
            id: "mbZ2tL",
            defaultMessage:
              "To get in, you’ll need to set a password. Just click the button below.",
          }),
          intl.formatMessage({ id: "aYIUar", defaultMessage: "Thank you!" }),
        ],
        cta: intl.formatMessage({
          id: "YemaN+",
          defaultMessage: "Set my password",
        }),
      };
    case "staff-password-reset":
      return {
        heading: intl.formatMessage({
          id: "0KGiQf",
          defaultMessage: "Hello there!",
        }),
        paragraphs: [
          intl.formatMessage({
            id: "vbjwe2",
            defaultMessage: "We received your dashboard password reset request.",
          }),
          intl.formatMessage({
            id: "ObJEZl",
            defaultMessage:
              "To reset your password, simply click the “Reset my password” button below.",
          }),
          intl.formatMessage({
            id: "7zG4at",
            defaultMessage:
              "This link expires in 24 hours. If you miss the window, please reset your password again.",
          }),
          intl.formatMessage({
            id: "M68oOR",
            defaultMessage:
              "Didn’t request a reset? Ignore this message (or reply to let us know).",
          }),
          intl.formatMessage({ id: "aYIUar", defaultMessage: "Thank you!" }),
        ],
        cta: intl.formatMessage({
          id: "OXLLjP",
          defaultMessage: "Reset my password",
        }),
      };
    case "staff-order-confirmation":
      return {
        heading: intl.formatMessage({
          id: "PA5XoW",
          defaultMessage: "New order just came in!",
        }),
        paragraphs: [
          intl.formatMessage({
            id: "iTwHiz",
            defaultMessage: "Someone placed a new order in your store.",
          }),
          intl.formatMessage({
            id: "4Bs5En",
            defaultMessage: "To see order details please click the button below.",
          }),
          intl.formatMessage({
            id: "Bx4Qp/",
            defaultMessage: "Have a great day!",
          }),
        ],
        cta: intl.formatMessage({ id: "nyiw2C", defaultMessage: "See order" }),
      };
    case "csv-export-success":
      return {
        heading: intl.formatMessage({ id: "YKXkbB", defaultMessage: "Hello," }),
        paragraphs: [
          intl.formatMessage({
            id: "fPT1IV",
            defaultMessage:
              "We’re happy to let you know that your file with products data is ready to download.",
          }),
          intl.formatMessage({
            id: "NEeeDI",
            defaultMessage: "To download your products data, simply click the button below.",
          }),
          intl.formatMessage({
            id: "aIBHm6",
            defaultMessage: "Have a great day and thank you!",
          }),
        ],
        cta: intl.formatMessage({
          id: "u1GExT",
          defaultMessage: "Download data",
        }),
      };
    case "csv-export-failed":
      return {
        heading: intl.formatMessage({ id: "YKXkbB", defaultMessage: "Hello," }),
        paragraphs: [
          intl.formatMessage({
            id: "WC05wl",
            defaultMessage:
              "Sorry, we couldn’t finish exporting products due to unexpected errors. Please try again.",
          }),
          intl.formatMessage({
            id: "XpMM3P",
            defaultMessage: "Our apologies and thank you.",
          }),
        ],
      };
    default:
      return {
        heading: intl.formatMessage({
          id: "leZPAy",
          defaultMessage: "Staff email",
        }),
        paragraphs: [
          intl.formatMessage({
            id: "mLJnYL",
            defaultMessage: "This is the Saleor default message for this notification.",
          }),
        ],
      };
  }
};

const fillSampleData = (html: string, intl: IntlShape): string => {
  let next = html;

  for (const [key, value] of Object.entries(SAMPLE_REPLACEMENTS)) {
    const sampleValue =
      key === "site_name"
        ? intl.formatMessage({ id: "gQoY3r", defaultMessage: "Your store" })
        : value;

    next = next.replaceAll(`{{ ${key} }}`, sampleValue);
    next = next.replaceAll(`{{${key}}}`, sampleValue);
  }

  // Hide unresolved Handlebars blocks for a readable preview.
  next = next.replace(/\{\{[#/][^}]+\}\}/g, "");
  next = next.replace(/\{\{[^}]+\}\}/g, "…");

  return next;
};

export const StaffEmailPreview = ({
  notificationId,
  subject,
  templateMode,
  customTemplate,
}: StaffEmailPreviewProps): JSX.Element | null => {
  const intl = useIntl();

  const customHtml = useMemo(() => {
    if (templateMode !== "custom" || !customTemplate.trim()) {
      return null;
    }

    return fillSampleData(customTemplate, intl);
  }, [customTemplate, intl, templateMode]);

  if (templateMode === "off") {
    return null;
  }

  const defaultContent = getDefaultPreviewContent(notificationId, intl);

  return (
    <Box className={styles.root} data-test-id={`staff-email-preview-${notificationId}`}>
      <Text size={2} color="default2" className={styles.label}>
        {intl.formatMessage(notificationsMessages.emailPreviewLabel)}
      </Text>
      <Box className={styles.frame} aria-hidden={false}>
        <Box className={styles.subjectBar}>
          <Text size={1} color="default2">
            {intl.formatMessage(notificationsMessages.subjectLabel)}
          </Text>
          <Text size={3} fontWeight="medium">
            {subject || "—"}
          </Text>
        </Box>
        {customHtml ? (
          <iframe
            title={intl.formatMessage(notificationsMessages.emailPreviewLabel)}
            className={styles.iframe}
            sandbox=""
            srcDoc={customHtml}
          />
        ) : (
          <Box className={styles.body}>
            <Box className={styles.accent} />
            <Text size={5} fontWeight="bold" className={styles.heading}>
              {defaultContent.heading}
            </Text>
            {defaultContent.paragraphs.map(paragraph => (
              <Text key={paragraph} size={3} color="default2" className={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
            {defaultContent.cta ? (
              <Box className={styles.cta} as="span">
                {defaultContent.cta}
              </Box>
            ) : null}
            <Text size={1} color="default2" className={styles.footer}>
              {intl.formatMessage(notificationsMessages.emailPreviewFooter)}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
