import { type RefObject, useCallback, useRef, useState } from "react";

interface UseNodeRefResult<T extends HTMLElement> {
  /** Stable ref for imperative reads that should not trigger re-renders. */
  ref: RefObject<T | null>;
  /** Reactive value, so effects/hooks can re-run when the node mounts or unmounts. */
  node: T | null;
  /** Callback ref to attach to the element; keeps both `ref` and `node` in sync. */
  setRef: (value: T | null) => void;
}

/**
 * Keeps a stable ref and reactive state pointing at the same DOM node.
 *
 * Useful when some consumers need the node imperatively (via `ref.current`)
 * while others need to react to it mounting (via `node` in a hook dependency).
 */
export const useNodeRef = <T extends HTMLElement>(): UseNodeRefResult<T> => {
  const ref = useRef<T | null>(null);
  const [node, setNode] = useState<T | null>(null);

  const setRef = useCallback((value: T | null) => {
    ref.current = value;
    setNode(value);
  }, []);

  return { ref, node, setRef };
};
