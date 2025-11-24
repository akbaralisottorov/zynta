"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    PenTool,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    Sparkles,
    User
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Post Yaratish",
        icon: PenTool,
        href: "/create",
    },
    {
        label: "Statistika",
        icon: BarChart3,
        href: "/library", // Using Library as Stats for now
    },
    {
        label: "Sozlamalar",
        icon: Settings,
        href: "/settings",
    },
    {
        label: "Yordam",
        icon: HelpCircle,
        href: "/help",
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-gray-800">
            <div className="px-6 py-4">
                <Link href="/dashboard" className="flex items-center gap-2 mb-8">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        ZYNTA
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200",
                                pathname === route.href
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300")} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-auto px-6 py-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-blue-100">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="text-blue-600 font-medium">
                            {session?.user?.name?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {session?.user?.name || "Foydalanuvchi"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            Pro Plan
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
