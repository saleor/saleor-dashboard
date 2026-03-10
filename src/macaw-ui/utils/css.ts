export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
