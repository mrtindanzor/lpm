"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { UpdateProps } from "@lpm/types/hooks/useResponse";

export default function useResponse<El extends HTMLElement>() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const msgCtnRef = useRef<El>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [progressMsg, setProgressMsg] = useState("");

  const setResponse = useCallback(
    ({ message, error, success }: UpdateProps) => {
      setMessage(message);
      if (error) setError(error);
      if (success) setSuccess(success);

      const ctn = msgCtnRef.current;
      if (!(ctn instanceof HTMLElement)) return;

      ctn.classList.add("scroll-mt-120");
      ctn.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  const clsRespone = useCallback(() => {
    setError(false);
    setSuccess(false);
    setMessage("");
    setProgressMsg("");
  }, []);

  const schClear = useCallback(
    (delayInSecs = 7) => {
      const timeoutId = timeoutRef.current;
      if (timeoutId) clearTimeout(timeoutId);

      timeoutRef.current = setTimeout(clsRespone, delayInSecs * 1000);
    },
    [clsRespone],
  );

  useEffect(() => {
    return () => {
      const timeoutId = timeoutRef.current;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return {
    message,
    success,
    error,
    setResponse,
    clsRespone,
    msgCtnRef,
    schClear,
    setProgressMsg,
    progressMsg,
  };
}
