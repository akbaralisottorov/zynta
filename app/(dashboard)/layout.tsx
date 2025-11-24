"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <p>Siz tizimga kirmagansiz. Login sahifasiga yo'naltirilmoqda...</p>
                <button onClick={() => router.push("/login")} className="text-blue-500 underline">
                    Login sahifasiga o'tish
                </button>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen relative bg-gray-50 dark:bg-gray-900">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10">
                <Navbar />
                {children}
            </main>
        </div>
    )
}
