import { atom, type PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

type EntityRefreshFn = () => void;

interface EntityRefreshRegistration {
  /**
   * Identifies the registration that owns the slot, so cleanup only clears the
   * slot when it still belongs to the unmounting page (React can mount the next
   * route before unmounting the previous one).
   */
  token: symbol;
  refresh: EntityRefreshFn;
}

/**
 * Single active-page slot. Only one entity detail page is mounted at a time, so
 * this always points at the current page's refresh function. Used to let apps
 * embedded as widgets or popups request the host page to refetch its entity via
 * the `refreshEntity` app-bridge action.
 *
 * It is a global atom (not a React context) on purpose: widgets render inside
 * the detail page subtree, but popups are portal-mounted above all routes, so a
 * subtree context would not reach the popup's message handler. A global atom
 * serves both uniformly.
 */
const entityRefreshAtom: PrimitiveAtom<EntityRefreshRegistration | null> = atom(
  null as EntityRefreshRegistration | null,
);

/**
 * Registers the current entity detail page's refresh function. The page decides
 * what the function does - it may call a single Apollo `refetch` or chain
 * several to cover all related queries mounted on the page.
 *
 * The latest function is kept in a ref and invoked through a stable wrapper, so
 * navigating between entities of the same type (e.g. order 5 -> order 6, which
 * re-renders the same component without unmounting) always runs the current
 * page's current refetch instead of a stale closure.
 */
export const useRegisterEntityRefresh = (refresh: EntityRefreshFn) => {
  const setRegistration = useSetAtom(entityRefreshAtom);
  const refreshRef = useRef(refresh);

  refreshRef.current = refresh;

  useEffect(() => {
    const token = Symbol("entity-refresh");

    setRegistration({
      token,
      refresh: () => refreshRef.current(),
    });

    return () => {
      setRegistration(current => (current?.token === token ? null : current));
    };
  }, [setRegistration]);
};

/**
 * Returns a trigger that refreshes the entity of the currently mounted detail
 * page. No-op when no page is registered (e.g. homepage widget, full app page),
 * which keeps the `refreshEntity` action a pure acknowledgement.
 */
export const useTriggerEntityRefresh = () => {
  const registration = useAtomValue(entityRefreshAtom);

  return () => {
    registration?.refresh();
  };
};
