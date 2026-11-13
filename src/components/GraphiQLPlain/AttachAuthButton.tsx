import { UnStyledButton, useEditorContext } from "@graphiql/react";
import { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./AttachAuthButton.module.css";

interface AttachAuthButtonProps {
  setActiveSecondaryEditor: (editor: "variables" | "headers") => void;
  showEditorTools: () => void;
}

export const AttachAuthButton = ({
  setActiveSecondaryEditor,
  showEditorTools,
}: AttachAuthButtonProps) => {
  const intl = useIntl();
  const editorContext = useEditorContext({ nonNull: true });

  const handleClick = useCallback(() => {
    const headerEditor = editorContext.headerEditor;

    if (!headerEditor) {
      return;
    }

    let headers: Record<string, string> = {};

    try {
      const current = headerEditor.getValue();

      if (current) {
        headers = JSON.parse(current);
      }
    } catch {
      // invalid JSON, start fresh
    }

    const existingToken = (
      headers["Authorization-Bearer"] ||
      headers["Authorization"] ||
      ""
    ).replace(/^Bearer\s+/i, "");
    const rawToken = window.prompt(
      intl.formatMessage({
        id: "HDoUL0",
        defaultMessage: "Paste auth token (leave empty to clear):",
      }),
      existingToken,
    );

    if (rawToken === null) {
      return;
    }

    if (rawToken.trim() === "") {
      delete headers["Authorization-Bearer"];
      delete headers["Authorization"];
    } else {
      const token = rawToken.trim();

      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      delete headers["Authorization-Bearer"];
    }

    const updated = Object.keys(headers).length > 0 ? JSON.stringify(headers, null, 2) : "";

    headerEditor.setValue(updated);
    showEditorTools();
    setActiveSecondaryEditor("headers");
  }, [editorContext.headerEditor, intl, setActiveSecondaryEditor, showEditorTools]);

  return (
    <UnStyledButton type="button" className={styles.attachButton} onClick={handleClick}>
      <FormattedMessage id="wqT5JO" defaultMessage="Attach Token" />
    </UnStyledButton>
  );
};
