import { AllFormPayloadUpdatePayloads } from "@saleor/app-sdk/app-bridge";
import { atom, useAtom } from "jotai";

const extensionFormResponseState = atom<AllFormPayloadUpdatePayloads[]>([]);

type FramesByFormType = Record<
  AllFormPayloadUpdatePayloads["form"],
  AllFormPayloadUpdatePayloads[]
>;

export const extensionFormResponseByFormAtom = atom(
  get => {
    const states = get(extensionFormResponseState);

    return states.reduce<Record<string, AllFormPayloadUpdatePayloads[]>>((acc, state) => {
      const formKey = state.form;

      if (!acc[formKey]) {
        acc[formKey] = [];
      }

      acc[formKey].push(state);

      return acc;
    }, {} as FramesByFormType);
  },
  (get, set, newState: AllFormPayloadUpdatePayloads) => {
    const currentStates = get(extensionFormResponseState);
    // Check if this exact state already exists
    const exists = currentStates.some(
      state => state.form === newState.form && JSON.stringify(state) === JSON.stringify(newState),
    );

    if (!exists) {
      set(extensionFormResponseState, [...currentStates, newState]);
    }
  },
);

export const useExtensionFormPayloadUpdate = () => {
  const [extensionResponseFrames, setExtensionResponseState] = useAtom(extensionFormResponseState);
  const [framesByFormType] = useAtom(extensionFormResponseByFormAtom);

  return {
    allFrames: extensionResponseFrames,
    attachFormResponseFrame(response: AllFormPayloadUpdatePayloads) {
      setExtensionResponseState(prev => [...prev, response]);
    },
    framesByFormType,
  };
};
