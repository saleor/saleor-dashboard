import { RippleAnimation } from "@dashboard/ripples/components/RippleAnimation";
import { useRippleStorage } from "@dashboard/ripples/hooks/useRipplesStorage";
import type { Ripple as RippleModel } from "@dashboard/ripples/types";
import { TooltipMountWrapper } from "@saleor/macaw-ui";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

/**
 * TODO
 * Looks like tooltip from macaw-next doesnt work for non-button triggers.
 * the TooltipMountWrapper is imported from old macaw, but it works
 * We need to fix macaw-next or re-export similar helper from it
 *
 * TODO
 * Make tooltip working on click instead of hover
 */
export const Ripple = (props: { model: RippleModel }) => {
  const content = props.model.content.contextual;
  const isPlainString = typeof content === "string";
  const intl = useIntl();
  const { setFirstSeenFlag, shouldShow, setManuallyHidden } = useRippleStorage(props.model);

  if (!shouldShow) {
    return null;
  }

  return (
    <Tooltip
      onOpenChange={() => {
        setFirstSeenFlag();
      }}
    >
      <Tooltip.Trigger>
        <TooltipMountWrapper>
          <RippleAnimation cursor="pointer" />
        </TooltipMountWrapper>
      </Tooltip.Trigger>
      <Tooltip.Content align="start" side="bottom">
        <Tooltip.Arrow />
        <Tooltip.ContentHeading>Hint</Tooltip.ContentHeading>
        <Box marginBottom={4}>{isPlainString ? <Text>{content}</Text> : content}</Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          {props.model.actions?.map((act, index) => {
            return (
              <Button
                key={index}
                variant="tertiary"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  act.onClick();
                }}
              >
                {intl.formatMessage(act.label)}
              </Button>
            );
          })}
          <Button
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();

              setManuallyHidden();
            }}
          >
            Ok & Hide
          </Button>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
