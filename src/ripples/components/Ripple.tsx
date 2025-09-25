import { RippleAnimation } from "@dashboard/ripples/components/RippleAnimation";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import type { Ripple as RippleModel } from "@dashboard/ripples/types";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const Ripple = (props: { model: RippleModel }) => {
  const content = props.model.content.contextual;
  const isPlainString = typeof content === "string";
  const intl = useIntl();
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
        <Tooltip.ContentHeading>Hint</Tooltip.ContentHeading>
        <Box marginBottom={4}>{isPlainString ? <Text>{content}</Text> : content}</Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          {props.model.actions?.map((rippleAction, index) => {
            return (
              <Button
                size="small"
                key={index}
                variant="tertiary"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  setManuallyHidden(props.model);

                  rippleAction.onClick();
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
      </Tooltip.Content>
    </Tooltip>
  );
};
