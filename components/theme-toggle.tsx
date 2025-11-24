"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <Button variant="ghost" size="icon" className="w-9 h-9" />
    }

    const currentTheme = theme === "system" ? resolvedTheme : theme
    const isDark = currentTheme === "dark"

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark"
        console.log("Toggling theme to:", newTheme)
        setTheme(newTheme)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
            title={isDark ? "Light Mode" : "Dark Mode"}
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
                <Moon className="h-5 w-5 text-gray-700" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
