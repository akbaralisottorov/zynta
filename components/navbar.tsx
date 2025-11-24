"use client"

import { ExpandableTabs } from "@/components/ui/expandable-tabs"
import { LayoutDashboard, PenTool, BarChart3, Settings, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
    const router = useRouter()

    const tabs = [
        { title: "Dashboard", icon: LayoutDashboard },
        { title: "Yaratish", icon: PenTool },
        { title: "Kutubxona", icon: BarChart3 },
        { type: "separator" as const },
        { title: "Sozlamalar", icon: Settings },
        { title: "Yordam", icon: HelpCircle },
    ]

    const handleTabChange = (index: number | null) => {
        if (index === null) return

        switch (index) {
            case 0: router.push("/dashboard"); break;
            case 1: router.push("/create"); break;
            case 2: router.push("/library"); break;
            case 4: router.push("/settings"); break;
            case 5: router.push("/help"); break;
        }
    }

    return (
        <div className="flex items-center justify-between p-4 md:hidden border-b bg-white dark:bg-gray-900 sticky top-0 z-50 w-full overflow-x-auto">
            <ExpandableTabs
                tabs={tabs}
                onChange={handleTabChange}
                className="border-none shadow-none bg-transparent"
            />
        </div>
    )
}
