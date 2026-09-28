import { create } from "zustand";
import { CreateCampaignInput } from "@/lib/types";

export interface CampaignWizardState {
  currentStep: number;
  setStep: (step: number) => void;
  wizardData: Partial<CreateCampaignInput>;
  updateWizardData: (data: Partial<CreateCampaignInput>) => void;
  resetWizard: () => void;
}

export const useCampaignWizardStore = create<CampaignWizardState>((set) => ({
  currentStep: 0,
  setStep: (step) => set({ currentStep: step }),
  wizardData: {},
  updateWizardData: (data) =>
    set((state) => ({
      wizardData: { ...state.wizardData, ...data },
    })),
  resetWizard: () => set({ currentStep: 0, wizardData: {} }),
}));
