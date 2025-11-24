"use client"

import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[99] bg-black/50 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Sheet */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-[100] w-72 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out md:hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar />
            </div>
        </>
    )
}
