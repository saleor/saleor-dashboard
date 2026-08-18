/**
 * A navigation pin is a sidebar shortcut that opens the model list filtered to a single
 * model type. See CONTEXT.md for the domain vocabulary.
 */
export interface NavigationPin {
  /** `PageType.id`. Immutable, unlike the slug. */
  id: string;
  /** Id of the sidebar section the pin appears under, or `favorites`. */
  target: string;
}

/** Who a pin belongs to. User pins live on `me`, organization pins on `Shop`. */
export type PinScope = "user" | "organization";

/** A pin joined with the model type it points at. Unresolvable pins are dropped. */
export interface ResolvedNavigationPin extends NavigationPin {
  name: string;
  scope: PinScope;
}
