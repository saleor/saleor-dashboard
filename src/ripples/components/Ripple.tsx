import { RippleAnimation } from "@dashboard/ripples/components/RippleAnimation";
import type { Ripple as RippleModel } from "@dashboard/ripples/types";
import { TooltipMountWrapper } from "@saleor/macaw-ui";
import { Text, Tooltip } from "@saleor/macaw-ui-next";

/**
 * TODO
 * Looks like tooltip from macaw-next doesnt work for non-button triggers.
 * the TooltipMountWrapper is imported from old macaw, but it works
 * We need to fix macaw-next or re-export similar helper from it
 */
export const Ripple = (props: { model: RippleModel }) => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <TooltipMountWrapper>
          <RippleAnimation cursor="pointer" />
        </TooltipMountWrapper>
      </Tooltip.Trigger>
      <Tooltip.Content align="start" side="bottom">
        <Tooltip.Arrow />
        <Text>test</Text>
      </Tooltip.Content>
    </Tooltip>
  );
};
