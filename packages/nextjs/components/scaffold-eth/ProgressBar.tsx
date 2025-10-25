"use client";

import NProgress from "nprogress";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const ProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname]);

  return null;
};
