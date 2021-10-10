import { proxy } from "valtio";
import { SupportedProviders } from "../../types";

type AllowedSteps = "credentials" | "settings" | "test_connection" | null;

interface ConnectRegistryState {
  selectedProvider: SupportedProviders | null;
  currentStep: AllowedSteps;
  actions: typeof actions;
}

const actions = {
  selectProvider(provider: SupportedProviders) {
    State.selectedProvider = provider;
  },

  clearState() {
    State.selectedProvider = null;
    State.currentStep = "credentials";
  },
};

const initialState: ConnectRegistryState = {
  selectedProvider: null,
  currentStep: "credentials",
  actions,
};

export const State = proxy(initialState);
