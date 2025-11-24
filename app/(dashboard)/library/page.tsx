"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface GenerationLog {
    id: string
    prompt: string
    model: string
    createdAt: Date
}

export default function LibraryPage() {
    const [logs, setLogs] = useState<GenerationLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/logs")
            const data = await res.json()

            // Check if data is an array
            if (Array.isArray(data)) {
                setLogs(data)
            } else {
                console.error("API returned non-array:", data)
                setLogs([])
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error)
            setLogs([])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return

        try {
            const res = await fetch(`/api/logs/${id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                setLogs(logs.filter(log => log.id !== id))
            } else {
                alert("O'chirishda xatolik")
            }
        } catch (error) {
            console.error("Delete error:", error)
            alert("O'chirishda xatolik")
        }
    }

    if (loading) {
        return (
            <div className="p-4 md:p-8">
                <p>Yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kutubxona</h1>
                <p className="text-muted-foreground mt-1">Barcha yaratilgan postlaringiz</p>
            </div>

            {logs.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Hozircha hech qanday post yaratilmagan.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {logs.map((log) => (
                        <Link key={log.id} href={`/library/${log.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-base line-clamp-2">{log.prompt}</CardTitle>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={(e) => handleDelete(e, log.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
                                        {log.model}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
