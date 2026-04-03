"use client";

import { useRouter } from "next/navigation";
import { BrandSwitcher } from "./brand-switcher";

export function BrandSwitcherNav() {
  const router = useRouter();

  return (
    <BrandSwitcher
      onBrandChange={() => {
        // Refresh the current page to re-scope data
        router.refresh();
        // Also trigger a full page reload to reset client state
        window.location.reload();
      }}
    />
  );
}
