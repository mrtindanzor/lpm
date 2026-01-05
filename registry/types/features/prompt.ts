import type { ButtonVariantTypes } from "lpm/types/ui/button";

export type PromptProps = {
  message: string;
  title?: string;
  accept?: string;
  decline?: string;
  acceptAction: () => void;
  acceptButtonVariants?: ButtonVariantTypes["variant"];
  declineButtonVariants?: ButtonVariantTypes["variant"];
};

export type PromptContextProps = {
  setPrompt: React.Dispatch<React.SetStateAction<PromptProps | null>>;
  prompt: PromptProps | null;
} | null;
