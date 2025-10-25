"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

import NProgress from "nprogress";

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
