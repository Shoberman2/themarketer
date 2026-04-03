"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/studio", label: "Create" },
  { href: "/outreach", label: "Outreach" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-[13px] transition-colors ${
              isActive
                ? "text-foreground font-medium"
                : "text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
