import { select, text } from "@clack/prompts";
import { RetryAsync } from "./common";
import { INIT_QUESTIONS } from "./constants";

export const selectInitDestination = async (retries = 1) => {
  const error = "Select installation destination!";
  const cb = () =>
    select({
      message: "Where should components be added by default?",
      options: INIT_QUESTIONS,
    });

  let getSelected = await cb();

  if (!getSelected || typeof getSelected !== "string")
    getSelected = await RetryAsync({
      cb: cb,
      error,
      retries,
    });

  if (getSelected === "recommended") return "/src";
  if (getSelected === "base") return "/";

  if (getSelected === "manual") {
    const cb = () =>
      text({
        message: "Enter destination...",
      });

    let answer = await cb();

    if (!answer || typeof answer !== "string")
      answer = await RetryAsync({
        cb: cb,
        error,
        retries,
      });

    if (answer && typeof answer === "string") {
      if (answer.startsWith("/")) return answer;

      return `/${answer}`;
    }
  }

  throw error;
};
