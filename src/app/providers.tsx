"use client";

import type { ReactNode } from "react";
import { FluidProvider } from "@/lib/fluid-provider";

export function Providers({ children }: { children: ReactNode }) {
  return <FluidProvider>{children}</FluidProvider>;
}
