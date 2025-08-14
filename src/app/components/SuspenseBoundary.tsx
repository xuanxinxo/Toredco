"use client";

import { Suspense } from "react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function SuspenseBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  );
}
