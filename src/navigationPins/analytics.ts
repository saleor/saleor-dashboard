import { type PinScope } from "./types";

interface NavigationPinChangedProperties {
  action: "pin" | "unpin";
  result: "error" | "success";
  scope: PinScope;
  target: string;
}

export const getNavigationPinChangedProperties = ({
  action,
  result,
  scope,
  target,
}: NavigationPinChangedProperties): NavigationPinChangedProperties => ({
  action,
  result,
  scope,
  target,
});
