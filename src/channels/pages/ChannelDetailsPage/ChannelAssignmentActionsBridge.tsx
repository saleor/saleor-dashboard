import { useEffect } from "react";

import {
  type ChannelAssignmentActions,
  type ChannelAssignmentActionsRef,
  type ChannelDisplayedAssignmentIds,
} from "./ChannelAssignmentActions";

interface ChannelAssignmentActionsBridgeProps {
  assignmentActionsRef?: ChannelAssignmentActionsRef;
  actions: ChannelAssignmentActions;
  warehouseIds: string[];
  shippingZoneIds: string[];
  onDisplayedAssignmentIdsChange?: (ids: ChannelDisplayedAssignmentIds) => void;
}

/** Publishes form-staged assign actions/ids to the view. */
export const ChannelAssignmentActionsBridge = ({
  assignmentActionsRef,
  actions,
  warehouseIds,
  shippingZoneIds,
  onDisplayedAssignmentIdsChange,
}: ChannelAssignmentActionsBridgeProps) => {
  useEffect(
    function syncChannelAssignmentActions() {
      if (assignmentActionsRef) {
        assignmentActionsRef.current = actions;
      }

      onDisplayedAssignmentIdsChange?.({ warehouseIds, shippingZoneIds });

      return () => {
        if (assignmentActionsRef) {
          assignmentActionsRef.current = null;
        }
      };
    },
    [actions, assignmentActionsRef, onDisplayedAssignmentIdsChange, shippingZoneIds, warehouseIds],
  );

  return null;
};
