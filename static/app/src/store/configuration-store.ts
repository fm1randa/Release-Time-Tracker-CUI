import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfigurationState {
  showOutOfScopeIssues: boolean;
  showIssuesNoWorklogs: boolean;
  setShowOutOfScopeIssues: (value: boolean) => void;
  setShowIssuesNoWorklogs: (value: boolean) => void;
}

export const useConfigurationStore = create<ConfigurationState>()(
  persist(
    (set) => ({
      showOutOfScopeIssues: true,
      showIssuesNoWorklogs: true,
      setShowOutOfScopeIssues: (value: boolean) =>
        set(() => ({ showOutOfScopeIssues: value })),
      setShowIssuesNoWorklogs: (value: boolean) =>
        set(() => ({ showIssuesNoWorklogs: value })),
    }),
    {
      name: "configuration",
    }
  )
);
