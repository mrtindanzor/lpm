"use client";

import { AnimatePresence } from "framer-motion";
import usePrompt from "./PromptProvider";
import Modal from "lpm/features/Modal/Modal";
import Button from "lpm/ui/Buttons/Button";

export default function Prompt() {
  const { prompt, setPrompt } = usePrompt();
  const close = () => setPrompt(null);

  const promptAction = prompt?.acceptAction;
  const title = prompt?.title;
  const message = prompt?.message;
  const acceptText = prompt?.accept;
  const declineText = prompt?.decline;
  const declineButtonVariant = prompt?.declineButtonVariants;
  const acceptButtonVariant = prompt?.acceptButtonVariants;

  return (
    <AnimatePresence>
      {!!message && (
        <Modal close={close}>
          <div className="w-9/10 max-w-xl py-4 px-3 grid gap-3">
            <header className="py-2 border-b border-b-accent font-semibold tracking-wide">
              {title}
            </header>
            <p>{message}</p>
            <ul className="flex gap-2 justify-end text-neutral font-medium ">
              <li>
                <Button
                  variant={declineButtonVariant || "success"}
                  onClick={() => setPrompt(null)}
                >
                  {declineText || "No"}
                </Button>
              </li>
              <li>
                <Button
                  variant={acceptButtonVariant || "danger"}
                  onClick={() => {
                    setPrompt(null);
                    if (promptAction) promptAction();
                  }}
                >
                  {acceptText || "Yes"}
                </Button>
              </li>
            </ul>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
