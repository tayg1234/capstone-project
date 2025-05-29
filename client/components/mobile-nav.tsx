"use client"

import { Home, Calendar, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "식당",
      href: "/customer",
      icon: Home,
      active: pathname === "/customer",
    },
    {
      label: "내 예약",
      href: "/customer/bookings",
      icon: Calendar,
      active: pathname === "/customer/bookings",
    },
    {
      label: "내 정보",
      href: "/customer/profile",
      icon: User,
      active: pathname === "/customer/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              item.active ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
            )}
          >
            <item.icon className={cn("h-5 w-5 mb-1", item.active ? "text-blue-500" : "")} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
