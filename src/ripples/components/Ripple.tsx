import { RippleAnimation } from "@dashboard/ripples/components/RippleAnimation";
import { localizeRippleContent } from "@dashboard/ripples/contentMessages";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import type { Ripple as RippleModel } from "@dashboard/ripples/types";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

export const Ripple = (props: { model: RippleModel }) => {
  const intl = useIntl();
  const content = localizeRippleContent(props.model, intl).contextual;
  const isPlainString = typeof content === "string";
  const { setFirstSeenFlag, getShouldShow, setManuallyHidden } = useRippleStorage();

  if (!getShouldShow(props.model)) {
    return null;
  }

  return (
    <Tooltip
      onOpenChange={() => {
        setFirstSeenFlag(props.model);
      }}
    >
      <Tooltip.Trigger>
        <Box>
          <RippleAnimation cursor="pointer" />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content align="start" side="bottom">
        <Tooltip.Arrow />
        <Box __maxWidth="320px">
          <Tooltip.ContentHeading>
            <FormattedMessage id="n6WpC1" defaultMessage="Hint" />
          </Tooltip.ContentHeading>
          <Box marginBottom={4}>{isPlainString ? <Text>{content}</Text> : content}</Box>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            {props.model.actions?.map((rippleAction, index) => {
              if (rippleAction.href) {
                return (
                  <Button
                    key={index}
                    size="small"
                    variant="tertiary"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setManuallyHidden(props.model);
                      window.open(rippleAction.href, "_blank", "noopener,noreferrer");
                    }}
                  >
                    {intl.formatMessage(rippleAction.label)}
                  </Button>
                );
              }

              return (
                <Button
                  size="small"
                  key={index}
                  variant="tertiary"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    setManuallyHidden(props.model);

                    rippleAction.onClick?.();
                  }}
                >
                  {intl.formatMessage(rippleAction.label)}
                </Button>
              );
            })}
            <Button
              size="small"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();

                setManuallyHidden(props.model);
              }}
            >
              {intl.formatMessage({
                defaultMessage: "OK",
                id: "kAEQyV",
              })}
            </Button>
          </Box>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
