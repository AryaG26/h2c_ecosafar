"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Leaf, MapPin, QrCode, Settings, Trophy, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Travel",
    href: "/dashboard/travel",
    icon: MapPin,
  },
  {
    title: "Scanner",
    href: "/dashboard/scanner",
    icon: QrCode,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Tips",
    href: "/dashboard/tips",
    icon: Leaf,
  },
  {
    title: "Challenges",
    href: "/dashboard/challenges",
    icon: Trophy,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start px-2 py-4">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-start gap-2 px-2",
              pathname === item.href && "bg-accent text-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

