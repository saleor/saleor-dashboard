import { getPermissionsDiff } from "@dashboard/extensions/getPermissionsDiff";
import { PermissionEnum } from "@dashboard/graphql";
import { useState } from "react";

type State =
  | {
      type: "pick-permissions";
      selected: PermissionEnum[];
    }
  | {
      type: "confirm-permissions";
      selected: PermissionEnum[];
      addedPermissions: PermissionEnum[];
      removedPermissions: PermissionEnum[];
    }
  | {
      selected: PermissionEnum[];
      type: "saving";
    }
  | {
      selected: PermissionEnum[];
      type: "error";
      error: string;
    };

export const useAppPermissionsDialogState = (initialPermissions: PermissionEnum[]) => {
  const [state, setState] = useState<State>({
    type: "pick-permissions",
    selected: initialPermissions,
  });

  return {
    state,
    stateType: state.type,
    selectedPermissions: state.selected,
    updateSelected(newPermissions: PermissionEnum[]) {
      if (state.type !== "pick-permissions") {
        throw new Error("Invalid state");
      }

      setState({
        type: "pick-permissions",
        selected: newPermissions,
      });
    },
    onConfirmSelection() {
      if (state.type !== "pick-permissions") {
        throw new Error("Invalid state");
      }

      const diff = getPermissionsDiff(initialPermissions, state.selected);

      setState({
        type: "confirm-permissions",
        selected: state.selected,
        addedPermissions: diff.added,
        removedPermissions: diff.removed,
      });
    },
    onApprove() {
      if (state.type !== "confirm-permissions") {
        throw new Error("Invalid state");
      }

      setState({
        type: "saving",
        selected: state.selected,
      });
    },
    onBackFromConfirmation() {
      if (state.type !== "confirm-permissions") {
        throw new Error("Invalid state");
      }

      setState({
        type: "pick-permissions",
        selected: state.selected,
      });
    },
    onMutationError(message: string) {
      if (state.type !== "saving") {
        throw new Error("Invalid state");
      }

      setState({
        type: "error",
        error: message,
        selected: state.selected,
      });
    },
  };
};
