import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import styles from "./RichTextEditorClamp.module.css";

const messages = defineMessages({
  showAll: {
    id: "xKNUrr",
    defaultMessage: "Show all",
    description: "expands a clamped rich text field to its editing height",
  },
});

/**
 * Focus opens the field only while you're in it. Show all keeps it open
 * after blur, so reading doesn't collapse the moment you move on.
 */
export const RichTextEditorClamp = ({
  active = true,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) => {
  const intl = useIntl();
  const frameRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [released, setReleased] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const clamped = active && !focused && !released;

  useEffect(() => {
    const frame = frameRef.current;

    if (!clamped || !frame) {
      return;
    }

    const measure = () => {
      setOverflows(frame.scrollHeight > frame.clientHeight + 1);
    };

    measure();

    const resize = new ResizeObserver(measure);
    const content = frame.firstElementChild;

    resize.observe(frame);

    if (content) {
      resize.observe(content);
    }

    const mutations = new MutationObserver(measure);

    mutations.observe(frame, { childList: true, subtree: true, characterData: true });

    return () => {
      resize.disconnect();
      mutations.disconnect();
    };
  }, [clamped]);

  if (!active) {
    return children;
  }

  return (
    <div
      className={styles.root}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        const next = event.relatedTarget;

        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setFocused(false);
        }
      }}
    >
      <div ref={frameRef} className={clsx(clamped && styles.clamped)}>
        {children}
      </div>
      {clamped && overflows ? (
        <button
          type="button"
          className={styles.showAll}
          data-test-id="rich-text-show-all"
          onMouseDown={event => event.preventDefault()}
          onClick={() => setReleased(true)}
        >
          {intl.formatMessage(messages.showAll)}
          <ChevronDown size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
        </button>
      ) : null}
    </div>
  );
};
