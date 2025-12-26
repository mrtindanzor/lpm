export type RetryAsyncProps<T = string> = {
  cb: () => Promise<T>;
  error: string;
  retries?: number;
  returnType?: string;
};

export type CLI_SELECTOR_OPTION = {
  label: string;
  value: string;
  hint?: string;
};
