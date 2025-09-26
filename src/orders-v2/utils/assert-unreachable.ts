export const assertUnreachable = (_unreachable: never, err: Error): never => {
  throw new Error("Unreachable code reached", { cause: err });
};
