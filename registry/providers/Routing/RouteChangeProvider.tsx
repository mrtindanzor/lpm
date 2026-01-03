"use client";

import type { RouteChangeContextProps } from "lpm/types/providers/routing";
import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  type PropsWithChildren,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

const RouteChangeContext = createContext<RouteChangeContextProps | null>(null);

export function RouteChangeListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { routeHistoryRef } = useRouteChange();

  const url = useMemo(() => {
    const search = searchParams.toString();
    return `${pathname}${search ? `?${search}` : ""}`;
  }, [searchParams, pathname]);

  useEffect(() => {
    routeHistoryRef.current.unshift(url);
  }, [url, routeHistoryRef]);

  return null;
}

export function RouteChangeProvider({ children }: PropsWithChildren) {
  const routeHistoryRef = useRef<string[]>(["/", "/"]);

  return (
    <RouteChangeContext value={{ routeHistoryRef }}>
      <Suspense fallback={null}>
        <RouteChangeListener />
      </Suspense>

      {children}
    </RouteChangeContext>
  );
}

export default function useRouteChange() {
  const ctx = useContext(RouteChangeContext);
  if (!ctx)
    throw Error("Route change must be used inside Route change provider");

  return ctx;
}
