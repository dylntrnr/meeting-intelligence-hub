"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, CalendarDays, ClipboardList, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Today", icon: CalendarDays },
  { href: "/prep", label: "Prep", icon: Brain },
  { href: "/action-items", label: "Actions", icon: ClipboardList },
];

export default function NavSidebar() {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return null;
  }

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-56 md:flex-col md:gap-8 md:border-r md:border-white/10 md:bg-black/30 md:px-6 md:py-8">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <div className="rounded-2xl bg-accent/20 p-2 text-accent">
            <Sparkles size={20} />
          </div>
          <span>Meeting Hub</span>
        </div>
        <nav className="flex flex-col gap-3 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition-all",
                  isActive
                    ? "bg-white/10 text-textPrimary shadow-glass"
                    : "text-textSecondary hover:bg-white/5 hover:text-textPrimary"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-4 left-1/2 z-20 flex w-[90%] -translate-x-1/2 items-center justify-around rounded-full border border-white/10 bg-black/60 px-6 py-3 text-xs text-textSecondary shadow-glass backdrop-blur md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1",
                isActive ? "text-textPrimary" : "text-textSecondary"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
