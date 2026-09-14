import { RippleAnimation } from "@dashboard/ripples/components/RippleAnimation";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import type { Ripple as RippleModel } from "@dashboard/ripples/types";
import { Box, Button, Popover, Text } from "@saleor/macaw-ui-next";
import { useId } from "react";
import { useIntl } from "react-intl";

import styles from "./Ripple.module.css";

export const Ripple = ({ model }: { model: RippleModel }) => {
  const intl = useIntl();
  const titleId = useId();
  const { setFirstSeenFlag, getShouldShow, setManuallyHidden } = useRippleStorage();

  if (!getShouldShow(model)) {
    return null;
  }

  return (
    <Popover
      onOpenChange={open => {
        if (open) setFirstSeenFlag(model);
      }}
    >
      <Popover.Trigger>
        <button
          type="button"
          className={styles.trigger}
          aria-label={intl.formatMessage(
            { defaultMessage: "Learn about {feature}", id: "9flAMP" },
            { feature: model.content.oneLiner },
          )}
          onClick={event => event.stopPropagation()}
        >
          <RippleAnimation />
        </button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        side="bottom"
        sideOffset={8}
        className={styles.content}
        aria-labelledby={titleId}
      >
        <Box onClick={event => event.stopPropagation()}>
          <Text id={titleId} size={3} fontWeight="bold">
            {model.content.oneLiner}
          </Text>
          <Box className={styles.description}>
            <Text size={2} color="default2">
              {model.content.contextual}
            </Text>
          </Box>
          <div className={styles.actions}>
            <Button size="small" variant="tertiary" onClick={() => setManuallyHidden(model)}>
              {intl.formatMessage({ defaultMessage: "Dismiss", id: "TDaF6J" })}
            </Button>
            {model.actions?.map((action, index) => (
              <Button
                key={index}
                size="small"
                variant="secondary"
                onClick={() => {
                  setManuallyHidden(model);

                  if (action.href) window.open(action.href, "_blank", "noopener,noreferrer");
                  else action.onClick?.();
                }}
              >
                {intl.formatMessage(action.label)}
              </Button>
            ))}
          </div>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
