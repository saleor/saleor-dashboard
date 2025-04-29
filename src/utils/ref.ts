import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  Ref,
  RefCallback,
  useCallback,
} from "react";

/** This is exact copy of React.forwardRef but with re-defined types
 * that allow using it with components that expect a TypeScript generic
 *
 * For example:
 * Component = <T,>(props: MyType<T>)
 * Won't normally with React.forwardRef, this fixedForwardRef can be used
 * as drop-in replacement
 *
 * More details: https://www.totaltypescript.com/forwardref-with-generic-components
 *
 * Note that this will not work with `Component.displayName` (core limitation of initial forwardRef)
 * instead we can override TypeScript type:
 * (HookFormInput as any).displayName = "HookFormInput";
 * */
export function fixedForwardRef<TRef, TProps = {}>(
  render: (props: TProps, ref: Ref<TRef>) => ReactNode,
): (props: TProps & React.RefAttributes<TRef>) => JSX.Element {
  return forwardRef(render as any) as any;
}

/**
 * Defines the possible types for a ref that can be passed to useCombinedRefs.
 * It can be a standard React callback ref, an object ref (like one created by useRef),
 * or undefined/null if the ref is optional.
 * @template T The type of the DOM element the ref points to.
 */
type PossibleRef<T> = RefCallback<T> | MutableRefObject<T | null> | undefined | null;

/**
 * A custom React hook that merges multiple refs into a single callback ref.
 * This is useful for scenarios like combining `forwardRef` with refs from libraries
 * (e.g., `react-hook-form`) or internal refs, and attaching them all to a single DOM element.
 *
 * @template T The type of the DOM element the combined ref will be attached to (e.g., HTMLInputElement, HTMLDivElement).
 * @param {...PossibleRef<T>} refs A variable number of refs (callback refs or object refs) to be combined.
 * @returns {RefCallback<T>} A single callback ref function. Attach this function to the `ref` prop of your target DOM element.
 * When the element mounts or unmounts, this callback will update all the provided refs.
 */
export function useCombinedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return useCallback(
    (element: T | null) => {
      // Iterate over each ref passed to the hook
      refs.forEach(ref => {
        // Skip if the ref is null or undefined
        if (!ref) {
          return;
        }

        // If the ref is a function (callback ref), call it with the element.
        if (typeof ref === "function") {
          ref(element);
        } else {
          // If the ref is an object (created with useRef), assign the element to its 'current' property.
          // The 'PossibleRef<T>' type already ensures it's a MutableRefObject<T | null> if it's an object.
          // We don't strictly need the 'current' in ref check here due to TS types, but it adds robustness
          // in plain JS or if types are bypassed.
          // if (ref && typeof ref === 'object' && 'current' in ref) {
          ref.current = element;
          // }
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs, // Dependency array: Recalculate the callback if the array of refs itself changes instance.
  );
}
