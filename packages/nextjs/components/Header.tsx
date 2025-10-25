"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SwitchTheme } from "./SwitchTheme";

export const Header = () => {
  const pathname = usePathname();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          🌾 Umay
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <SwitchTheme />
        <ConnectButton />
      </div>
    </div>
  );
};
