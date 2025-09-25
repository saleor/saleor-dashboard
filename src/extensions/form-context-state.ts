import { AppBridgeState } from "@saleor/app-sdk/app-bridge";
import { atom } from "jotai";

// todo import from sdk
type State = AppBridgeState["formContext"];

export const translateProductFormStateAtom = atom<State>();
