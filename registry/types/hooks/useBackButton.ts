"use client";

import useRouteChange from "lpm/providers/Routing/RouteChangeProvider";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function useBackButton() {
  const router = useRouter();
  const { routeHistoryRef } = useRouteChange();

  const goBack = useCallback(
    (path?: string) => {
      routeHistoryRef.current.shift();
      if (path) return router.push(path);

      const backPage = routeHistoryRef.current[0];
      routeHistoryRef.current.shift();

      return router.push(backPage);
    },
    [router, routeHistoryRef],
  );

  return {
    goBack,
  };
}
