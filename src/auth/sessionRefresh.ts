// Shared by all SDK instances: login/logout must fence refreshes started by another instance.
let sessionVersion = 0;

export const getSessionVersion = (): number => sessionVersion;

export const advanceSession = (): void => {
  sessionVersion += 1;
};

export const assertCurrentSession = (version: number): void => {
  if (version !== sessionVersion) {
    throw new Error("Authentication session changed while the request was pending");
  }
};
