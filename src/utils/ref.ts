import React, { forwardRef, ReactNode, Ref } from "react";

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
